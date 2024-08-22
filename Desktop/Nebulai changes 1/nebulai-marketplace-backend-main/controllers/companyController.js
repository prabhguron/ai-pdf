const { resizeImage } = require('../lib/sharp');
const CompanyProfile = require('../models/companyProfileModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const createElement = require('../utils/createElement');
const updateElement = require('../utils/updateElement');
const deleteElement = require('../utils/deleteElements');
const {
  uploadObjectToS3,
  invalidateFromCDN
} = require('./awsController');
const { formatCompanyProfileAssets } = require('./generalController');
const Job = require('../models/jobModel');
const User = require('../models/userModel');

exports.updateMyProfile = catchAsync(async (req, res, next) => {
  let {
    companyName,
    industry,
    location,
    email,
    technologies,
    description,
    size,
    profileImage,
    telegramUsername,
    user,
  } = req.body;

  const companyProfile = await CompanyProfile.findOne({ userId: user._id });
  if (profileImage?.buffer) {
    const profileImageName = `user-${user._id}/profile/my-profile.jpeg`
    const resizedImg = await resizeImage(profileImage?.buffer);
    profileImage = await uploadObjectToS3(
      profileImageName,
      resizedImg,
      profileImage
    );
    invalidateFromCDN(`user-${user._id}/profile/*`);
  } else if (
    companyProfile &&
    companyProfile.profileImage &&
    companyProfile.profileImage !== ''
  ) {
    profileImage = companyProfile.profileImage;
  }else{
    profileImage = 'user-default.png'
  }

  let updatedProfile = await CompanyProfile.findOneAndUpdate(
    { userId: req.body.user._id },
    {
      companyName,
      industry,
      location,
      email,
      technologies,
      description,
      size,
      profileImage,
    },
    { new: true, runValidators: true }
  );

   //Update Telegram
   await User.updateOne({_id: req.body.user._id}, {
    isVerified: true,
    isOnboardingComplete: true,
    telegramUsername,
   });

   updatedProfile = {
    ...updatedProfile,
    telegramUsername
  }

  res.status(200).json({
    status: 'success',
    data: {
      updatedProfile,
    },
  });
});

exports.createProjects = catchAsync(async (req, res, next) => {
  const {newId, images} = await createElement(req, CompanyProfile, 'projects');
  res.status(200).json({
    status: 'success',
    project: {
      id: newId,
      images
    }
  });
});

exports.updateMyProjects = catchAsync(async (req, res, next) => {
  const updatedElement = await updateElement(req, CompanyProfile, 'projects');
  res.status(200).json({
    status: 'success',
    project: updatedElement,
  });
});

exports.deleteProject = catchAsync(async (req, res, next) => {
  const { user } = req.body;
  if (!req.params.id) {
    return next(new AppError('No project found', 404, 'error'));
  }
  const { httpCode, response } = await deleteElement(
    CompanyProfile,
    user,
    req.params.id,
    'projects',
    true
  );
  res.status(httpCode).json(response);
});

exports.createCaseStudies = catchAsync(async (req, res, next) => {
  const {newId, images}  = await createElement(req, CompanyProfile, 'caseStudies');
  res.status(200).json({
    status: 'success',
    caseStudy: {
      id: newId,
      images
    }
  });
});

exports.updateMyCaseStudies = catchAsync(async (req, res, next) => {
  const updatedElement = await updateElement(
    req,
    CompanyProfile,
    'caseStudies'
  );
  res.status(200).json({
    status: 'success',
    caseStudy: updatedElement,
  });
});

exports.deleteCaseStudies = catchAsync(async (req, res, next) => {
  const { user } = req.body;
  if (!req.params.id) {
    return next(new AppError('No case study found', 404, 'error'));
  }
  const { httpCode, response } = await deleteElement(
    CompanyProfile,
    user,
    req.params.id,
    'caseStudies',
    true
  );
  res.status(httpCode).json(response);
});

exports.createTeamMember = catchAsync(async (req, res, next) => {
  const {newId} = await createElement(req, CompanyProfile, 'teamMembers');
  res.status(200).json({
    status: 'success',
    teamMember: {
      id: newId
    }
  });
});

exports.updateTeamMembers = catchAsync(async (req, res, next) => {
  const updatedElement = await updateElement(
    req,
    CompanyProfile,
    'teamMembers'
  );
  res.status(200).json({
    status: 'success',
    teamMember: updatedElement,
  });
});

exports.deleteTeamMembers = catchAsync(async (req, res, next) => {
  const { user } = req.body;
  if (!req.params.id) {
    return next(new AppError('No team member found', 404, 'error'));
  }
  const { httpCode, response } = await deleteElement(
    CompanyProfile,
    user,
    req.params.id,
    'teamMembers',
    false
  );
  res.status(httpCode).json(response);
});

exports.createPartnerships = catchAsync(async (req, res, next) => {
  const {newId, images} = await createElement(req, CompanyProfile, 'partnerships');
  res.status(200).json({
    status: 'success',
    partnership: {
      id: newId,
      images
    }
  });
});

exports.updatePartnerships = catchAsync(async (req, res, next) => {
  const updatedElement = await updateElement(
    req,
    CompanyProfile,
    'partnerships'
  );
  res.status(200).json({
    status: 'success',
    partnership: updatedElement,
  });
});

exports.deletePartnerships = catchAsync(async (req, res, next) => {
  const { user } = req.body;
  if (!req.params.id) {
    return next(new AppError('No partnership found', 404, 'error'));
  }
  const { httpCode, response } = await deleteElement(
    CompanyProfile,
    user,
    req.params.id,
    'partnerships',
    true
  );
  res.status(httpCode).json(response);
});

exports.createTestimonials = catchAsync(async (req, res, next) => {
  const {newId, images} = await createElement(req, CompanyProfile, 'testimonials');
  res.status(200).json({
    status: 'success',
    testimonial: {
      id: newId,
      images
    }
  });
});

exports.updateTestimonials = catchAsync(async (req, res, next) => {
  const updatedElement = await updateElement(
    req,
    CompanyProfile,
    'testimonials'
  );
  res.status(200).json({
    status: 'success',
    testimonial: updatedElement,
  });
});

exports.deleteTestimonials = catchAsync(async (req, res, next) => {
  const { user } = req.body;
  if (!req.params.id) {
    return next(new AppError('No testimonial found', 404, 'error'));
  }
  const { httpCode, response } = await deleteElement(
    CompanyProfile,
    user,
    req.params.id,
    'testimonials',
    true
  );
  res.status(httpCode).json(response);
});

exports.updateMySocialNetwork = catchAsync(async (req, res, next) => {
  const socialFields = ['facebook', 'twitter', 'linkedin', 'discord', 'website'];
  let updateSocials = {};
  socialFields.forEach((field) => {
    if (req.body[field] && req.body[field] !== '') {
      updateSocials[field] = req.body[field];
    }
  });

  if (!Object.keys(updateSocials).length) {
    return next(new AppError('Nothing to update', 400, 'error'));
  }


  const companySocialNetwork = await CompanyProfile.findOneAndUpdate(
    { userId: req.body.user.id },
    {
      socialNetwork: updateSocials,
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    socials: companySocialNetwork,
  });
});


exports.getCompanyDetails = catchAsync(async (req, res, next) => {
  const {companyId} = req.params;
  let {recentJobCount} = req.query;
  recentJobCount =parseInt(recentJobCount)

  let companyProfile = await CompanyProfile.findOne({
    userId: companyId
  },{ _id: 0, userId: 0 });
  if(!companyProfile){
    return next(new AppError('Company not found', 404, 'error'))
  }

  companyProfile = formatCompanyProfileAssets(companyProfile);

  let recentCompanyJobs = [];
  if(recentJobCount && recentJobCount !== 0){
    recentCompanyJobs = await Job.find({userId: companyId, isActive: true, isListedOnMarketplace: true})
    .select(["jobTitle", "experienceLevel", "location", "contractType", "compensation", "created_at"])
    .sort({ created_at: -1 })
    .limit(recentJobCount)
    .exec();
  }

  res.status(200).json({
    status: 'success',
    company: companyProfile,
    recentJobs: recentCompanyJobs
  })
});