const AppError = require('../utils/appError');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');
const { validateAccessToken } = require('../lib/utils');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const catchAsync = require('../utils/catchAsync');

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
  region: process.env.BUCKET_REGION,
});

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(
      new AppError('Not an Image! Please upload images only', 400, 'error'),
      false
    );
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.uploadPhoto = upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'certificatesImages', maxCount: 3 },
]);

exports.resizePhoto = catchAsync(async (req, res, next) => {
  if (!req.body.user) {
    let decoded = validateAccessToken(req.headers.authorization.split(' ')[1]);
    const user = await User.findById(decoded.id);
    req.body.user = user;
  }
  if (!req.files) return next();
  // used the above if block for testing via postman form-data
  // 1. profileImage
  if (req.files.profileImage) {
    req.body.profileImage = `user-${req.body.user._id}/profile/my-profile.jpeg`;
    await sharp(req.files.profileImage[0].buffer)
      .resize(330, 300)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      // .toFile(`public/img/users/${req.file.filename}`);
      .toBuffer()
      .then(async (data) => {
        const params = {
          Bucket: process.env.BUCKET_NAME,
          Key: req.body.profileImage,
          Body: data,
          // ACL: 'public-read',
          ContentType: req.files.profileImage[0].mimetype,
        };
        const command = new PutObjectCommand(params);
        await s3.send(command);
      });
  }
  // 2. Project Images
  if (req.files.certificatesImages) {
    req.body.certificatesImages = [];
    await Promise.all(
      req.files.certificatesImages.map(async (file, i) => {
        const filename = `cert-${i + 1}.jpeg`;
        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toBuffer()
          .then(async (data) => {
            const params = {
              Bucket: process.env.BUCKET_NAME,
              Key: `user-${req.body.user._id}/certificates/cert-${i + 1}.jpeg`,
              Body: data,
              // ACL: 'public-read',
              ContentType: file.mimetype,
            };
            const command = new PutObjectCommand(params);
            await s3.send(command);
            req.body.certificatesImages.push(filename);
          });
      })
    );
  }
  next();
});

// exports.uploadPhoto = (req, res, next) => {
//   const { user } = req.body;
//   upload.fields([
//     {
//       name: 'profileImage',
//       maxCount: 1,
//     },
//     { name: 'projectsImagess', maxCount: 3 },
//   ])(req, res, (err) => {
//     if (err) {
//       // handle error
//       return;
//     }
//     req.body.user = user;
//     req.body.projectsImagess = req.files.projectsImagess[0] ?? '';
//     // access req.body and req.files to process the uploaded files
//     // the 'projectsImagess' file will be available as req.files.projectsImagess[0]
//     next();
//   });
// };
