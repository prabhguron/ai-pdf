const AppError = require('../utils/appError');
const multer = require('multer');
const multerStorage = multer.memoryStorage();

const multerFilter = (allowedTypes) => (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        "Invalid file type! Please upload the allowed file types only",
        400,
        "error"
      ),
      false
    );
  }
};

function generalUploadMiddleware(fields, allowedTypes) {
  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter(allowedTypes),
  });

  return (req, res, next) => {
    const data = req.body;
    upload.fields(fields)(req, res, (err) => {
      if (err) return next(err);
      const fileFields = {};
      fields.forEach((field) => {
        if (field?.name) {
          if (req.files[field?.name]) {
            fileFields[field?.name] =
              field?.maxCount === 1
                ? req.files[field?.name][0]
                : req.files[field?.name];
          }
        }
      });
      req.body = { ...req.body, ...data, ...fileFields };

      next();
    });
  };
}

module.exports = { generalUploadMiddleware };
