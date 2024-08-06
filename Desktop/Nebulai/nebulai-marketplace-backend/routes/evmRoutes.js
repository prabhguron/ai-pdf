const express = require("express");
const evmController = require("../controllers/evmController");
const { authenticateJwt } = require("../middleware/authenticateJwt");
const checkMissingFields = require("../middleware/checkMissingFields");
const isTokenBlacklisted = require("../middleware/isTokenBlacklisted");

const router = express.Router();

router.post("/sig-msg", checkMissingFields(["address", "chainId"]) ,evmController.generateSignatureMsg);
router.post("/link-wallet", authenticateJwt, isTokenBlacklisted, checkMissingFields(["message", "signature", 'walletName']), evmController.linkWallet);
router.post("/unlink-wallet", authenticateJwt, isTokenBlacklisted, checkMissingFields(["address"]), evmController.unLinkWallet);
router.post("/login", checkMissingFields(["message", "signature"]), evmController.login);

module.exports = router;
