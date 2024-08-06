const express = require("express");
const router = express.Router();
const { authenticateJwt } = require("../middleware/authenticateJwt");
const isTokenBlacklisted = require("../middleware/isTokenBlacklisted");
const applicationController = require("../controllers/applicationController");
const offerController = require("../controllers/offerController");
const checkIfApplicationSubmitted = require("../middleware/job/checkIfApplicationSubmitted");

router
  .route("/")
  .get(
    authenticateJwt,
    isTokenBlacklisted,
    applicationController.getMyApplications
  );

router
  .route("/job/:jobId")
  .post(
    authenticateJwt,
    isTokenBlacklisted,
    checkIfApplicationSubmitted,
    applicationController.submitApplication
  );

router
  .route("/:applicationId")
  .get(
    authenticateJwt,
    isTokenBlacklisted,
    applicationController.getApplicationById
  )
  .patch(
    authenticateJwt,
    isTokenBlacklisted,
    applicationController.updateApplicationStatus
  );

router.get('/talent/offers', authenticateJwt, isTokenBlacklisted, offerController.getTalentOffers);


module.exports = router;
