const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const { authenticateJwt } = require('../middleware/authenticateJwt');
const isTokenBlacklisted = require('../middleware/isTokenBlacklisted');
const checkMissingFields = require('../middleware/checkMissingFields');
const {
  checkRequiredFieldsForRole,
  validateRegistrationFields,
} = require('../middleware/checkRequiredFieldsForRole');
const userEmailExists = require('../middleware/userEmailExists');
const validateEmail = require('../middleware/validation/validateEmail');
const router = express.Router();
const {
  imageUploadMiddleware,
} = require('../middleware/imageUploadMiddleware');
const userKYCController = require('../controllers/userKYCController');

router.post(
  '/signup',
  checkRequiredFieldsForRole,
  validateRegistrationFields,
  userEmailExists(),
  authController.signup
);
router.get('/verify-email', authController.verifyEmail);
router.post(
  '/resend-verify-email',
  checkMissingFields(['email']),
  validateEmail,
  authController.resendVerifyEmail
);
router.post('/login', authController.login);

router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);
router.post(
  '/forgot-password',
  checkMissingFields(['email']),
  validateEmail,
  authController.forgotPassword
);
router.patch(
  '/reset-password/:token',
  checkMissingFields(['password']),
  authController.resetPassword
);
router.get(
  '/info',
  authenticateJwt,
  isTokenBlacklisted,
  authController.userInfo
);
router.get(
  '/check-wallet/:address',
  authenticateJwt,
  isTokenBlacklisted,
  authController.checkWalletLinked
);
router.get(
  '/wallet-addresses',
  authenticateJwt,
  isTokenBlacklisted,
  authController.allUserWallets
);
router.patch(
  '/personal-info',
  authenticateJwt,
  isTokenBlacklisted,
  userController.updatePersonalInfo
);

router.put(
  '/password',
  checkMissingFields(['currentPassword', 'newPassword']),
  authenticateJwt,
  isTokenBlacklisted,
  authController.updatePassword
);

router
  .route('/profile')
  .get(authenticateJwt, isTokenBlacklisted, userController.getMyProfile);

router.get(
  '/validate-profile',
  authenticateJwt,
  isTokenBlacklisted,
  userController.validateUserProfile
);

router.get(
  '/stats',
  authenticateJwt,
  isTokenBlacklisted,
  userController.getUserStats
);

router.post(
  '/kyc',
  authenticateJwt,
  isTokenBlacklisted,
  imageUploadMiddleware([{ name: 'idDoc', maxCount: 1 }]),
  checkMissingFields(['idDocType', 'country']),
  userKYCController.submitKYC
);

router.get(
  '/getApplicantStatus',
  authenticateJwt,
  isTokenBlacklisted,
  userKYCController.getApplicantStatus
);

router.post(
  '/createAccessToken',
  authenticateJwt,
  isTokenBlacklisted,
  userKYCController.createAccessToken
);

router
  .route("/profiles/:userRole")
  .get(authenticateJwt, isTokenBlacklisted, userController.getProfiles);

router
  .route("/recommended/:userRole")
  .get(authenticateJwt, isTokenBlacklisted, userController.getRecommendedProfiles);

module.exports = router;
