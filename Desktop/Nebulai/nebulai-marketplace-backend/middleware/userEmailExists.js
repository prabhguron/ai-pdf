const User = require('../models/userModel');

function userEmailExists() {
    return async function (req, res, next) {
      try {
        const {email} = req.body;
        const foundUser = await User.findOne({ email });
        if(foundUser) {
            return res.status(409).json({
                status: "error",
                message: "User with this email address already exists"
            });
        }
      } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Something went wrong"
        });
      }
      next();
    };
  }
  
  module.exports = userEmailExists;
  