const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const crypto = require('crypto');
const mongoose = require('mongoose');
const { ROLES, COMPANY_SIZE_OPTIONS } = require('../utils/constants');
const MailService = require('../integrations/Mailer/MailService');
const { flippedObj } = require('../utils/helpers');
const ethers = require('ethers');
const _ = require('lodash');
// const TalentProfile = require('../models/TalentProfileModel');
const { addToBlacklist, generateToken } = require('./JWTController');
const BlacklistToken = require('../models/blacklistTokenSchema');
const { validateRefreshToken, decodeAccessToken } = require('../lib/utils');
const { formatUserWalletsWithWhitelistedCheck } = require('../resources/users');
const profiles = {
  talent: require('../models/talentProfileModel'),
  company: require('../models/companyProfileModel'),
  // solutionProvider: require('../models/solutionProviderProfileModel'),
  // investor: require('../models/investorProfileModel'),
};
const analytics = require('../integrations/Segment/AppSegment');

exports.signup = catchAsync(async (req, res, next) => {
  let mongoSession = null;
  try {
    mongoSession = await mongoose.startSession();
    mongoSession.startTransaction();

    const {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      telegramUsername,
      role,
      companyName,
      acceptedTerms,
      token,
      industry,
      size,
      location,
      primaryContactName,
      roleInCompany,
      roleInCompanyOther,
      contactPhone,
      contactEmail,
    } = req.body;
    
    // Validate that passwords match
    if (password !== confirmPassword) {
      return next(new AppError('Passwords do not match', 400, 'error'));
    }

    let accessToken = null;
    // Get access token info in case of oAuth SignUps
    const tokenInfo = token ? decodeAccessToken(token ?? '') : null;
    const isSocialSignUp = tokenInfo && tokenInfo?.socialSignUp ? true : false;
    let isEmailVerified = isSocialSignUp;
    let gitHubId =
      tokenInfo && tokenInfo?.gitHubId ? tokenInfo?.gitHubId : null;
    let gitHubEmail =
      tokenInfo && tokenInfo?.githubEmail ? tokenInfo?.githubEmail : null;

    const roleValue = ROLES[role] ?? null;
    if (!roleValue) {
      return next(new AppError('Invalid role', 400, 'error'));
    }
    const profileModule = profiles[role];
    if (!profileModule) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    const verificationToken = crypto.randomBytes(28).toString('hex');

    // Handle TALENT account creation
    // let fullName = null;
    const TALENT = 'talent';
    const COMPANY = 'company';

    if (role === TALENT) {
      if (!firstName || !lastName) {
        return next(
          new AppError(
            'First name and last name are required for TALENT role',
            400,
            'error'
          )
        );
      }
      // fullName = `${firstName} ${lastName}`;
    }

    // Handle COMPANY account creation
    if (role === COMPANY) {
      if (
        !companyName ||
        !primaryContactName ||
        !roleInCompany ||
        !contactPhone ||
        !contactEmail ||
        !industry ||
        !size ||
        !location
      ) {
        return next(
          new AppError(
            'All company details are required for COMPANY role',
            400,
            'error'
          )
        );
      }
    }

    const newUser = await User.create(
      [
        {
          telegramUsername,
          companyName,
          firstName,
          lastName,
          password,
          isEmailVerified,
          gitHubId,
          acceptedTerms: Boolean(acceptedTerms),
          role: roleValue,
          verificationToken: !isSocialSignUp ? verificationToken : null,
          email: isSocialSignUp ? gitHubEmail : email,
        },
      ],
      { session: mongoSession }
    );


    let segmentIdentifyTraits = {
      newUserRegistered: true,
      telegramUsername,
      companyName,
      firstName,
      lastName,
      gitHubId,
      acceptedTerms: Boolean(acceptedTerms),
      role,
      email: isSocialSignUp ? gitHubEmail : email,
      isSocialSignUp,
    }

    // Create profile based on the role
    if (role === TALENT) {
      await profileModule.create(
        [
          {
            userId: newUser[0]._id,
            fullName: `${firstName} ${lastName}`,
            // Add other TALENT specific fields here if needed
          },
        ],
        { session: mongoSession, new: true, validateBeforeSave: false }
      );
    } else if (role === COMPANY) {
      await profileModule.create(
        [
          {
            userId: newUser[0]._id,
            companyName,
            industry,
            size,
            location,
            primaryContactName,
            roleInCompany:
            roleInCompany === 'other' ? roleInCompanyOther : roleInCompany,
            contactPhone,
            email: contactEmail,
          },
        ],
        { session: mongoSession, new: true, validateBeforeSave: false }
      );
      const sizeLabel = COMPANY_SIZE_OPTIONS[size] ?? '';
      segmentIdentifyTraits = {
        ...segmentIdentifyTraits,
        industry,
        sizeIdentifier:size,
        size:sizeLabel,
        location,
        primaryContactName,
        roleInCompany:
        roleInCompany === 'other' ? roleInCompanyOther : roleInCompany,
        contactPhone,
        contactEmail,
      }
    }

    // --- Identify user in Segment ---
    analytics.identify({
      userId: newUser[0]._id?.toString(),
      traits: segmentIdentifyTraits,
    });

    if (newUser) {
      if (!isSocialSignUp) {
        const sent = await sendUserEmailVerification(email, {
          verify_url: `${req.dAppUrl}/verify/${verificationToken}`,
        });
        if (process.env.NODE_ENV === 'development') {
          console.log(`Email Verification Token: ${verificationToken}`);
        }
        if (!sent) {
          throw new Error('Failed to send user email verification email');
        }
      } else {
        // --- Generate Nebulai Access Token For oAuth Login ---
        if (newUser?.[0]) {
          const oAuthUser = {
            _id: newUser[0]._id?.toString(),
            role: newUser[0].role,
            email: gitHubEmail,
            isEmailVerified: true,
          };
          accessToken = generateToken(oAuthUser, (expiresIn = '1d'));
          const refreshToken = generateToken(
            oAuthUser,
            (expiresIn = '7d'),
            'refresh'
          );
          const cookieOptions = {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true,
          };
          if (process.env.NODE_ENV === 'production')
            cookieOptions.secure = true;
          res.cookie('refreshToken', refreshToken, cookieOptions);
        }
      }
      await mongoSession.commitTransaction();
      return res.status(201).json({
        status: 'success',
        message: 'user registration successful',
        accessToken,
      });
    }
  } catch (error) {
    if (mongoSession) {
      console.log('rolling back userRegistration transaction');
      await mongoSession.abortTransaction();
    }
    console.error(error.message);
  } finally {
    if (mongoSession) mongoSession.endSession();
  }
  return res.status(500).json({
    status: 'error',
    message: 'user registration failed',
  });
});

exports.verifyEmail = catchAsync(async (req, res, next) => {
  let httpCode = 200;
  let mongoSession = null;
  try {
    const { token } = req.query;
    if (!token) {
      httpCode = 400;
      return next(new AppError('Bad Request', httpCode, 'error'));
    }
    mongoSession = await mongoose.startSession();
    mongoSession.startTransaction();
    const userByVerifyToken = await User.findOne({
      verificationToken: token,
      isEmailVerified: false,
    }).session(mongoSession);
    if (!userByVerifyToken) {
      const error = new Error(
        'User By Verification Token Not Found / already verified'
      );
      error.status = 404;
      throw error;
    }

    userByVerifyToken.isEmailVerified = true;
    userByVerifyToken.verificationToken = null;
    await userByVerifyToken.save();
    await mongoSession.commitTransaction();

    return res.status(httpCode).json({
      status: 'success',
      message: 'user email verified',
    });
  } catch (error) {
    httpCode = error.status || 500;
    if (mongoSession) {
      console.log('rolling back verifyEmail transaction');
      await mongoSession.abortTransaction();
    }
    console.error(error.message);
  } finally {
    if (mongoSession) mongoSession.endSession();
  }
  return res.status(httpCode).json({
    status: 'error',
    message: 'user verification failed',
  });
});

exports.login = catchAsync(async (req, res, next) => {
  passport.authenticate(
    'local',
    { session: false },
    function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info.message });
      }
      const accessToken = generateToken(user, (expiresIn = '1d'));
      const refreshToken = generateToken(user, (expiresIn = '7d'), 'refresh');

      const cookieOptions = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

      res.cookie('refreshToken', refreshToken, cookieOptions);

      res.status(200).json({
        status: 'success',
        token: accessToken,
      });
    }
  )(req, res, next);
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    next(new AppError('Email Address not found', 404, 'error'));
  }
  const resetToken = user.createResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetURL = `${req.dAppUrl}/reset-password/${resetToken}`;

  try {
    const sent = await sendUserResetPasswordEmail(email, {
      recover_password_url: resetURL,
    });
    if (!sent) {
      throw new Error('Failed to send user reset password email');
    }
    res.status(200).json({
      status: 'success',
      message: `Link sent to ${user.email}`,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError('Link invalid/expired', 400, 'error'));
  }
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.status(200).json({
    status: 'success',
    message: 'Your password has been successfully reset.',
  });
});

exports.resendVerifyEmail = catchAsync(async (req, res, next) => {
  let httpCode = 200;
  let response = {
    status: 'error',
    message: 'resend verification failed',
  };
  try {
    const { email } = req.body;
    const user = await User.findOne({
      email,
      isEmailVerified: false,
      verificationToken: { $ne: null },
    });
    if (!user) {
      httpCode = 404;
      response.message = 'user not found';
    } else {
      const sent = await sendUserEmailVerification(user.email, {
        verify_url: `${process.env.DAPP_URL}/verify/${user.verificationToken}`,
      });
      if (!sent) {
        let msg = 'Failed to send user email verification email';
        response.message = msg;
        throw new Error(msg);
      }
      response.status = 'success';
      response.message = 'Verification sent successfully';
    }
  } catch (error) {
    httpCode = 500;
    console.log(error.message);
  }
  return res.status(httpCode).json(response);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { user: u, currentPassword, newPassword } = req.body;
  let user = await User.findById(u.id).select('+password');
  if (!(await bcrypt.compare(currentPassword, user.password))) {
    return next(new AppError('Current password is incorrect', 400, 'error'));
  }
  user.password = newPassword;
  await user.save();
  const accessToken = generateToken(user, (expiresIn = '1d'));
  res.status(200).json({
    status: 'success',
    message: 'Password updated successfully',
    token: accessToken,
  });
});

exports.userInfo = catchAsync(async (req, res, next) => {
  const { user } = req.body;
  if (!user) {
    return next(new AppError('User not found', 404, 'error'));
  }
  const roles = flippedObj(ROLES);
  const {
    firstName,
    lastName,
    email,
    isEmailVerified,
    companyName,
    role,
    telegramUsername,
    linkedWallets,
  } = user;
  let userName = `${firstName} ${lastName}`;
  if (roles[role] !== 'talent') {
    userName = companyName;
  }
  return res.status(200).json({
    status: 'success',
    data: {
      firstName,
      lastName,
      email,
      isEmailVerified,
      companyName,
      userName,
      role: roles[role],
      telegramUsername,
      linkedWallets,
    },
  });
});

exports.checkWalletLinked = catchAsync(async (req, res, next) => {
  const { address } = req.params;
  if (!ethers.utils.isAddress(address)) {
    return next(new AppError('Invalid address', 400, 'error'));
  }
  return res.status(200).json({
    status: 'success',
    isLinked: _.some(req.body.user.linkedWallets, {
      address: address.toLowerCase(),
    }),
  });
});

exports.allUserWallets = catchAsync(async (req, res, next) => {
  const { user } = req.body;
  const userWallets = user?.linkedWallets ?? [];
  const addresses = await formatUserWalletsWithWhitelistedCheck(userWallets);
  return res.status(200).json({ addresses });
});

const sendUserEmailVerification = async (to, data) => {
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  return MailService.sendEmail({
    to,
    templateId: process.env.VERIFY_EMAIL_TEMPLATE_ID,
    dynamicTemplateData: data,
    hideWarnings: true,
  });
};

const sendUserResetPasswordEmail = async (to, data) => {
  return MailService.sendEmail({
    to,
    templateId: process.env.RESET_PASSWORD_TEMPLATE_ID,
    dynamicTemplateData: data,
    hideWarnings: true,
  });
};

exports.logout = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken ?? '';
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '') ?? '';
  if (token.length && refreshToken.length) {
    await addToBlacklist(token);
    await addToBlacklist(refreshToken);
  }
  // Clear refresh token cookie
  res.clearCookie('refreshToken');
  return res.status(200).json({ message: 'Logout successful' });
});

// Refresh token API endpoint
exports.refreshToken = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return next(new AppError('Unauthorized', 403, 'error'));
  }

  const blacklistedToken = await BlacklistToken.findOne({
    token: refreshToken,
  });
  if (blacklistedToken) {
    return next(new AppError('Invalid refresh token', 403, 'error'));
  }
  try {
    const decoded = validateRefreshToken(refreshToken);
    if (decoded) {
      // Check if the user exists in the database
      const user = await User.findById(decoded.id);
      if (!user) {
        return next(new AppError('Unauthorized', 403, 'error'));
      }
      // Generate a new access token and return it
      const accessToken = generateToken(user, (expiresIn = '1d'));
      const newRefreshToken = generateToken(
        user,
        (expiresIn = '7d'),
        'refresh'
      );
      const cookieOptions = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
      res.cookie('refreshToken', newRefreshToken, cookieOptions);

      await addToBlacklist(refreshToken);
      return res.status(200).json({ accessToken });
    }
  } catch (err) {
    console.log(err);
  }
  return next(new AppError('Invalid refresh token', 403, 'error'));
});
