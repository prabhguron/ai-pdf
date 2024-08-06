const { body, validationResult } = require("express-validator");

const schema = [
    body('email').isEmail().trim().normalizeEmail()
]

async function validateEmail(req, res, next) {
    await Promise.all(schema.map(v => v.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: "Bad Request"
      });
    }
    next();
}

module.exports = validateEmail;