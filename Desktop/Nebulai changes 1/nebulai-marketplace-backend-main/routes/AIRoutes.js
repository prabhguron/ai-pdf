const express = require('express');
const { authenticateJwt } = require('../middleware/authenticateJwt');
const isTokenBlacklisted = require('../middleware/isTokenBlacklisted');
const router = express.Router();
const AIController = require('../controllers/AIController');

router.post(
  '/getTalentRating',
  authenticateJwt,
  isTokenBlacklisted,
  AIController.getTalentRating
);

module.exports = router;
