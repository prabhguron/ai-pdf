const express = require('express');
const jobController = require('../controllers/jobController');
const { authenticateJwt } = require('../middleware/authenticateJwt');
const isTokenBlacklisted = require('../middleware/isTokenBlacklisted');
// const isCompany = require('../middleware/isCompany');
const checkMissingFields = require('../middleware/checkMissingFields');
// const validateSkill = require('../middleware/validation/validateSkill');
const applicationController = require('../controllers/applicationController');

const router = express.Router();

router
  .route('/')
  .post(
    // validateSkill,
    checkMissingFields([
      'jobTitle',
      'jobDescription',
      'skillsRequired',
      'experienceLevel',
      'contractType',
    ]),
    authenticateJwt,
    isTokenBlacklisted,
    // isCompany,
    jobController.createJob
  )
  .get(authenticateJwt, isTokenBlacklisted, jobController.getAllJobs);


router.get('/shortlist', authenticateJwt, isTokenBlacklisted, jobController.getShortListedJobs);

router.get('/applicants/:jobId', authenticateJwt, isTokenBlacklisted, applicationController.getJobApplicants);

router.get('/job-stats/:jobId', authenticateJwt, isTokenBlacklisted, jobController.getJobStats);

router.get('/approved-offers', authenticateJwt, isTokenBlacklisted, jobController.getAllApprovedJobOffers);

router
  .route('/:jobId')
  .get(authenticateJwt, isTokenBlacklisted, jobController.getAJobById)
  .patch(
    authenticateJwt,
    isTokenBlacklisted,
    // isCompany,
    jobController.updateJob
  )
  .delete(
    authenticateJwt,
    isTokenBlacklisted,
    // isCompany,
    jobController.deleteJob
  );

router.post('/send-offer', authenticateJwt, isTokenBlacklisted, jobController.sendOffer)


module.exports = router;
