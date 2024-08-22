const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const AppError = require('../utils/appError');

const userSchema = new mongoose.Schema(
  {
    companyName: {
      // this field only applies to organization role
      type: String,
      required: false,
    },
    firstName: {
      // this field only applies to talent role
      type: String,
      required: false,
    },
    lastName: {
      // this field only applies to talent role
      type: String,
      required: false,
    },
    telegramUsername: {
      type: String,
      //required: true,
    },
    gitHubId: {
      type: String,
      required: false,
      default: null,
    },
    role: {
      type: Number, //Value for this should be used from constants /utils/constants.js ROLE
      required: [true, 'role is required'],
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      unique: true,
      lowercase: true, // not a validator, just converts it to lowercase
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    verificationToken: String,
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    acceptedTerms: {
      type: Boolean,
      default: false,
    },
    linkedWallets: [
      {
        address: { type: String },
        name: { type: String }
      }
    ],
    isVerified: {
      type: Boolean,
      default: false
    },
    isOnboardingComplete: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

userSchema.pre('save', async function (next) {
  // Check if the email field has been modified
  if (this.isModified('email')) {
    const existingUser = await this.constructor.findOne({ email: this.email });
    if (existingUser) {
      return next(new AppError('Email address already in use', 409, 'error'));
    }
  }
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  // subtracting 1 sec as sometimes this maybe delayed when
  // compared to the time when the new jwt was created
  next();
});

userSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
