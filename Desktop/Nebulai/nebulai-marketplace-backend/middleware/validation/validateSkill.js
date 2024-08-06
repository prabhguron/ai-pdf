const { body, validationResult } = require("express-validator");

const schema = [
    body('skill').isString().trim(),
    body('yearsOfExperience').isInt({min: 1})
]

async function validateSkill(req, res, next) {
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

module.exports = validateSkill;