const express = require('express');
const companyController = require('../controllers/companyController');
const { authenticateJwt } = require('../middleware/authenticateJwt');
const isTokenBlacklisted = require('../middleware/isTokenBlacklisted');
const checkMissingFields = require('../middleware/checkMissingFields');
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
      'companyName',
      'industry',
      'location',
      'email',
      'technologies',
      'description',
      'size',
      'telegramUsername'
    ]),
    companyController.updateMyProfile
  );

router.post(
  '/projects',
  authenticateJwt,
  isTokenBlacklisted,
  imageUploadMiddleware([{ name: 'projectsImages', maxCount: 3 }]),
  checkMissingFields(['name', 'url']),
  companyController.createProjects
);
router
  .route('/projects/:id')
  .patch(
    authenticateJwt,
    isTokenBlacklisted,
    imageUploadMiddleware([{ name: 'projectsImages', maxCount: 3 }]),
    companyController.updateMyProjects
  )
  .delete(authenticateJwt, isTokenBlacklisted, companyController.deleteProject);

router.post(
  '/case-studies',
  authenticateJwt,
  isTokenBlacklisted,
  imageUploadMiddleware([{ name: 'caseStudiesImages', maxCount: 3 }]),
  checkMissingFields(['clientName', 'url']),
  companyController.createCaseStudies
);
router
  .route('/case-studies/:id')
  .patch(
    authenticateJwt,
    isTokenBlacklisted,
    imageUploadMiddleware([{ name: 'caseStudiesImages', maxCount: 3 }]),
    companyController.updateMyCaseStudies
  )
  .delete(
    authenticateJwt,
    isTokenBlacklisted,
    companyController.deleteCaseStudies
  );

router.post(
  '/team-members',
  authenticateJwt,
  isTokenBlacklisted,
  checkMissingFields(['name', 'jobTitle']),
  companyController.createTeamMember
);
router
  .route('/team-members/:id')
  .patch(
    authenticateJwt,
    isTokenBlacklisted,
    companyController.updateTeamMembers
  )
  .delete(
    authenticateJwt,
    isTokenBlacklisted,
    companyController.deleteTeamMembers
  );

router.post(
  '/partnerships',
  authenticateJwt,
  isTokenBlacklisted,
  imageUploadMiddleware([{ name: 'partnershipsImages', maxCount: 3 }]),
  checkMissingFields(['name', 'url']),
  companyController.createPartnerships
);
router
  .route('/partnerships/:id')
  .patch(
    authenticateJwt,
    isTokenBlacklisted,
    imageUploadMiddleware([{ name: 'partnershipsImages', maxCount: 3 }]),
    companyController.updatePartnerships
  )
  .delete(
    authenticateJwt,
    isTokenBlacklisted,
    companyController.deletePartnerships
  );

router.post(
  '/testimonials',
  authenticateJwt,
  isTokenBlacklisted,
  imageUploadMiddleware([{ name: 'testimonialsImages', maxCount: 3 }]),
  checkMissingFields(['clientName']),
  companyController.createTestimonials
);
router
  .route('/testimonials/:id')
  .patch(
    authenticateJwt,
    isTokenBlacklisted,
    imageUploadMiddleware([{ name: 'testimonialsImages', maxCount: 3 }]),
    checkMissingFields(['clientName']),
    companyController.updateTestimonials
  )
  .delete(
    authenticateJwt,
    isTokenBlacklisted,
    companyController.deleteTestimonials
  );

router.patch(
  '/socials',
  authenticateJwt,
  isTokenBlacklisted,
  companyController.updateMySocialNetwork
);

router.get(
  '/:companyId',
  authenticateJwt,
  isTokenBlacklisted,
  companyController.getCompanyDetails
)

module.exports = router;
