const { body, validationResult } = require('express-validator');
const checkMissingFields = require('./checkMissingFields');
function requiredFieldsForRole(role) {
  if (role === "org") {
    return ["companyName", "email", /* "telegramUsername", */ "password", "acceptedTerms"];
  } else if (role === "talent") {
    return ["firstName", "lastName", /* "telegramUsername", */ "email", "password", "acceptedTerms"];
  } else {
    return [];
  }
}

function roleBasedValidationSchema(role) {
  switch (role) {
    case 'talent':
      return [
        body("role").trim().escape(),
        //body("telegramUsername").trim().escape(),
        body("firstName").trim().escape().blacklist('<'),
        body("lastName").trim().escape().blacklist('<'),
        body("email").trim().escape().isEmail(),
        body("password").trim().escape(),
        body("acceptedTerms").toBoolean(),
      ];
    case 'org':
      return [
        body("role").trim().escape(),
        //body("telegramUsername").trim().escape(),
        body("companyName").trim().escape().blacklist('<'),
        body("email").trim().escape().isEmail().normalizeEmail(),
        body("password").trim().escape(),
        body("acceptedTerms").toBoolean(),
      ];
    default:
      return [];
  }
}

async function checkRequiredFieldsForRole(req, res, next) {
  const {role} = req.body;
  const requiredFields = requiredFieldsForRole(role);
  if(!role || !role.length){
    return res.status(400).json({
      status: "error",
      message: "Bad Request"
    });
  }
  checkMissingFields(requiredFields)(req, res, next);
}

async function validateRegistrationFields(req, res, next) {
    const {role} = req.body;
    const validationSchema = roleBasedValidationSchema(role);
    await Promise.all(validationSchema.map(v => v.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: "Bad Request"
      });
    }
    next();
}

module.exports = {checkRequiredFieldsForRole, validateRegistrationFields};