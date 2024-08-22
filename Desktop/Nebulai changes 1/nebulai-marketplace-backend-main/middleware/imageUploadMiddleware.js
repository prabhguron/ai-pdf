const AppError = require('../utils/appError');
const multer = require('multer');
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

function imageUploadMiddleware(fields) {
  return (req, res, next) => {
    const data = req.body;
    upload.fields(fields)(req, res, (err) => {
      if (err) return next(err);
      const imgFields = {};
      fields.forEach((field) => {
        if (field?.name) {
          if (req.files[field?.name]) {
            imgFields[field?.name] =
              field?.maxCount === 1
                ? req.files[field?.name][0]
                : req.files[field?.name];
          }
        }
      });
      req.body = { ...req.body, ...data, ...imgFields };

      next();
    });
  };
}

module.exports = { imageUploadMiddleware };
