const express = require('express');
const { authenticateJwt } = require('../middleware/authenticateJwt');
const isTokenBlacklisted = require('../middleware/isTokenBlacklisted');
const router = express.Router();
const searchController = require('../controllers/searchController');

router.get(
  '/searchAll',
  authenticateJwt,
  isTokenBlacklisted,
  searchController.searchAll
);

module.exports = router;
