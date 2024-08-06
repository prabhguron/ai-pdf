function checkMissingFields(fields) {
  return function (req, res, next) {
    for (let i = 0; i < fields.length; i++) {
      if (!req.body[fields[i]]) {
        return res.status(400).json({
          status: "error",
          message: "Bad Request"
        });
      }
    }
    next();
  };
}

module.exports = checkMissingFields;
