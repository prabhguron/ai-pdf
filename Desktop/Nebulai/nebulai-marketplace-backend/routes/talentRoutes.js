const express = require('express');
const talentController = require('../controllers/talentController');
const { authenticateJwt } = require('../middleware/authenticateJwt');
const isTokenBlacklisted = require('../middleware/isTokenBlacklisted');
const checkMissingFields = require('../middleware/checkMissingFields');
const validateSkill = require('../middleware/validation/validateSkill');
const {
  imageUploadMiddleware,
} = require('../middleware/imageUploadMiddleware');

const router = express.Router();

router
  .route('/profile')
  .patch(
    authenticateJwt,
    isTokenBlacklisted,
    imageUploadMiddleware([{ name: 'profileImage', maxCount: 1 }]),
    checkMissingFields([
      'fullName',
      'jobTitle',
      'phone',
      'email',
      'languages',
      'bio',
      'location',
      'overAllWorkExperience',
      'profileTags'
    ]),
    talentController.updateMyProfile
  );
  
router.post(
  '/skills',
  checkMissingFields(['skill', 'yearsOfExperience']),
  validateSkill,
  authenticateJwt,
  isTokenBlacklisted,
  talentController.createSkills
);

router
  .route('/skills/:id')
  .patch(
    validateSkill,
    authenticateJwt,
    isTokenBlacklisted,
    talentController.updateMySkills
  )
  .delete(authenticateJwt, isTokenBlacklisted, talentController.deleteSkill);

router.post(
  '/projects',
  authenticateJwt,
  isTokenBlacklisted,
  checkMissingFields(['name', 'startYear', 'endYear']),
  talentController.createProjects
);

router
  .route('/projects/:id')
  .patch(authenticateJwt, isTokenBlacklisted, talentController.updateMyProjects)
  .delete(authenticateJwt, isTokenBlacklisted, talentController.deleteProject);

router.post(
  '/certifications',
  authenticateJwt,
  isTokenBlacklisted,
  imageUploadMiddleware([{ name: 'certificatesImages', maxCount: 3 }]),
  checkMissingFields(['name', 'startYear', 'endYear']),
  talentController.createCertifications
);

router
  .route('/certifications/:id')
  .patch(
    authenticateJwt,
    isTokenBlacklisted,
    imageUploadMiddleware([{ name: 'certificatesImages', maxCount: 3 }]),
    talentController.updateMyCertifications
  )
  .delete(
    authenticateJwt,
    isTokenBlacklisted,
    talentController.deleteCertificate
  );

router.patch(
  '/work-experiences',
  authenticateJwt,
  isTokenBlacklisted,
  checkMissingFields([
    'jobTitle',
    'companyName',
    'startYear',
    'endYear',
    'description',
  ]),
  talentController.updateMyWorkExperiences
);

router.delete(
  '/work-experiences/:id',
  authenticateJwt,
  isTokenBlacklisted,
  talentController.deleteWorkExperience
);

router.patch(
  '/educations',
  authenticateJwt,
  isTokenBlacklisted,
  checkMissingFields(['college', 'courseName', 'startYear', 'endYear']),
  talentController.updateMyEducation
);

router.delete(
  '/educations/:id',
  authenticateJwt,
  isTokenBlacklisted,
  talentController.deleteEducation
);

router.patch(
  '/socials',
  authenticateJwt,
  isTokenBlacklisted,
  talentController.updateMySocialNetwork
);

router
  .route('/:talentId')
  .get(authenticateJwt, 
    isTokenBlacklisted, 
    talentController.getTalentDetails
  );

module.exports = router;
