const express = require("express");
const { authenticateJwt } = require("../middleware/authenticateJwt");
const isTokenBlacklisted = require("../middleware/isTokenBlacklisted");
const offerController = require("../controllers/offerController");
const checkMissingFields = require("../middleware/checkMissingFields");
const {
  generalUploadMiddleware,
} = require("../middleware/generalUploadMiddleware");

const router = express.Router();

const checkMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
  "application/docx",
  "application/msword",
  "text/csv",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const offerMandatoryFields = [
  "jobTitle",
  "jobRequirements",
  "compensation",
  "currencyType",
  "dueDate",
  "talentWalletAddress",
];


router
  .route("/:applicationId")
  .get(authenticateJwt, isTokenBlacklisted, offerController.getApplicationOffer)
  .post(
    generalUploadMiddleware(
      [{ name: "jobResources", maxCount: 4 }],
      checkMimeTypes
    ),
    checkMissingFields(offerMandatoryFields),
    authenticateJwt,
    isTokenBlacklisted,
    offerController.createOffer
  );

router.patch(
  "/update/:offerId",
  generalUploadMiddleware(
    [{ name: "jobResources", maxCount: 4 }],
    checkMimeTypes
  ),
  checkMissingFields(offerMandatoryFields),
  authenticateJwt,
  isTokenBlacklisted,
  offerController.updateOffer
);

router.get(
    "/get-all/:jobId",
   authenticateJwt, isTokenBlacklisted, 
    offerController.getAllJobOffers
)

router.patch(
  "/talent/accept-reject",
 authenticateJwt, isTokenBlacklisted, 
  offerController.approveRejectJobOffer
)

router.get('/metadata/:offerId', 
authenticateJwt, isTokenBlacklisted,
offerController.getJobOfferMetadata);

router.post(
  "/prepare/:offerId",
 authenticateJwt, isTokenBlacklisted, 
  offerController.prepareOfferForContract
)

router.post(
  "/prepare-change-order/:offerId",
  checkMissingFields(['changeOrderDesc']),
 authenticateJwt, isTokenBlacklisted, 
  offerController.prepareChangeOrder
)

router.post(
  "/prepare-evidence/:offerId",
  checkMissingFields(['evidenceDesc']),
 authenticateJwt, isTokenBlacklisted, 
  offerController.prepareEvidenceURI
)

router.patch(
  "/tx-info/:offerId",
  checkMissingFields(['escrowProjectId', 'transactionHash']),
 authenticateJwt, isTokenBlacklisted, 
  offerController.updateOfferTxInfo
)

module.exports = router;
