const express = require('express');
const adminController = require('../controllers/adminController');
const userKYCController = require('../controllers/userKYCController');
const isAdmin = require('../middleware/isAdmin');
const { authenticateJwt } = require('../middleware/authenticateJwt');
const isTokenBlacklisted = require('../middleware/isTokenBlacklisted');
const validateAPIKey = require('../middleware/validateAPIKey');

const router = express.Router();

router.post('/handle-kyc', validateAPIKey, userKYCController.handleKYC);

router
  .route('/')
  .get(
    authenticateJwt,
    isTokenBlacklisted,
    isAdmin,
    adminController.getAllUsers
  );

module.exports = router;