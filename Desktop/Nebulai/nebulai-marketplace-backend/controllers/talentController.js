const { resizeImage } = require('../lib/sharp');
const TalentProfile = require('../models/talentProfileModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const createElement = require('../utils/createElement');
const updateElement = require('../utils/updateElement');
const deleteElement = require('../utils/deleteElements');
const {
  uploadObjectToS3,
  invalidateFromCDN
} = require('./awsController');
const { formatTalentProfileAssets, sanitizeHtmlString } = require('./generalController');
const User = require('../models/userModel');
const { markUserOnboardingComplete } = require('../resources/users');

exports.updateMyProfile = catchAsync(async (req, res, next) => {
  let { fullName, location, overAllWorkExperience, profileTags, jobTitle, phone, email, languages, bio, profileImage, user, telegramUsername } =
    req.body;
  const talentProfile = await TalentProfile.findOne({ userId: user._id });
  if (profileImage?.buffer) {
    const resizedImg = await resizeImage(profileImage?.buffer);
    profileImage = await uploadObjectToS3(
      `user-${user._id}/profile/my-profile.jpeg`,
      resizedImg,
      profileImage
    );
    invalidateFromCDN(`user-${user._id}/profile/*`);
  } else if (
    talentProfile &&
    talentProfile.profileImage &&
    talentProfile.profileImage !== ''
  ) {
    profileImage = talentProfile.profileImage;
  }else{
    profileImage = 'user-default.png'
  }

  bio = sanitizeHtmlString(bio ?? '').trim()

  let updatedProfile = await TalentProfile.findOneAndUpdate(
    { userId: req.body.user._id },
    {
      fullName,
      location,
      overAllWorkExperience,
      profileTags,
      jobTitle,
      phone,
      email,
      languages,
      bio,
      profileImage,
    },
    { new: true, runValidators: true }
  );

  //Update Telegram
  await User.updateOne({_id: req.body.user._id}, {
    telegramUsername
  });

  const userInfo = await User.findOne({_id: req.body.user._id},{
    _id: true,
    role: true,
    telegramUsername: true,
    isOnboardingComplete: true
  });
  if(userInfo && !userInfo.isOnboardingComplete){
    await markUserOnboardingComplete(userInfo, true);
  }

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

exports.createSkills = catchAsync(async (req, res, next) => {
  const {newId} = await createElement(req, TalentProfile, 'skills');
  const userInfo = await User.findOne({_id: req.body.user._id},{
    _id: true,
    role: true,
    telegramUsername: true,
    isOnboardingComplete: true
  });
  if(userInfo && !userInfo.isOnboardingComplete){
    await markUserOnboardingComplete(userInfo, true);
  }
  res.status(200).json({
    status: 'success',
    skill: {
      id: newId
    }
  });
});

exports.updateMySkills = catchAsync(async (req, res, next) => {
  const updatedElement = await updateElement(req, TalentProfile, 'skills');
  res.status(200).json({
    status: 'success',
    skill: updatedElement,
  });
});

exports.deleteSkill = catchAsync(async (req, res, next) => {
  const { user } = req.body;
  if (!req.params.id) {
    return next(new AppError('Skill not found', 404, 'error'));
  }
  const { httpCode, response } = await deleteElement(
    TalentProfile,
    user,
    req.params.id,
    'skills',
    false
  );
  res.status(httpCode).send(response);
});

exports.createProjects = catchAsync(async (req, res, next) => {
  const {newId} = await createElement(req, TalentProfile, 'projects');
  res.status(200).json({
    status: 'success',
    project: {
      id: newId
    }
  });
});

exports.updateMyProjects = catchAsync(async (req, res, next) => {
  const updatedElement = await updateElement(
    req,
    TalentProfile,
    'projects'
  );
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
    TalentProfile,
    user,
    req.params.id,
    'projects',
    false
  );
  res.status(httpCode).json(response);
});

exports.createCertifications = catchAsync(async (req, res, next) => {
  const {newId, images} = await createElement(req, TalentProfile, 'certificates');
  res.status(200).json({
    status: 'success',
    certificate: {
      id: newId,
      images
    }
  });
});

exports.updateMyCertifications = catchAsync(async (req, res, next) => {
  const updatedElement = await updateElement(
    req,
    TalentProfile,
    'certificates'
  );
  res.status(200).json({
    status: 'success',
    certificate: updatedElement,
  });
});

exports.deleteCertificate = catchAsync(async (req, res, next) => {
  const { user } = req.body;
  if (!req.params.id) {
    return next(new AppError('Certificate not found', 404, 'error'));
  }
  const { httpCode, response } = await deleteElement(
    TalentProfile,
    user,
    req.params.id,
    'certificates',
    true
  );
  res.status(httpCode).json(response);
});

exports.updateMyWorkExperiences = catchAsync(async (req, res, next) => {
  const { jobTitle, companyName, startYear, endYear, description } = req.body;

  const userWorkExperiences = await TalentProfile.findOneAndUpdate(
    { userId: req.body.user.id },
    {
      $push: {
        workExperiences: {
          jobTitle,
          companyName,
          startYear,
          endYear,
          description,
        },
      },
    },
    { new: true, runValidators: true }
  );
  const newId = userWorkExperiences['workExperiences'][userWorkExperiences['workExperiences'].length - 1]._id;
  const userInfo = await User.findOne({_id: req.body.user._id},{
    _id: true,
    role: true,
    telegramUsername: true,
    isOnboardingComplete: true
  });
  if(userInfo && !userInfo.isOnboardingComplete){
    await markUserOnboardingComplete(userInfo, true);
  }
  res.status(200).json({
    status: 'success',
    workExperience: newId,
  });
});

exports.deleteWorkExperience = catchAsync(async (req, res, next) => {
  const { user } = req.body;
  if (!req.params.id) {
    return next(new AppError('No work experience found', 404, 'error'));
  }
  const { httpCode, response } = await deleteElement(
    TalentProfile,
    user,
    req.params.id,
    'workExperiences',
    false
  );
  res.status(httpCode).json(response);
});

exports.updateMyEducation = catchAsync(async (req, res, next) => {
  const { college, courseName, startYear, endYear } = req.body;

  const talentEducation = await TalentProfile.findOneAndUpdate(
    { userId: req.body.user.id },
    {
      $push: {
        education: {
          college,
          courseName,
          startYear,
          endYear,
        },
      },
    },
    { new: true, runValidators: true }
  );
  const newId = talentEducation['education'][talentEducation['education'].length - 1]._id;
  res.status(200).json({
    status: 'success',
    education: newId,
  });
});

exports.deleteEducation = catchAsync(async (req, res, next) => {
  const { user } = req.body;
  if (!req.params.id) {
    return next(new AppError('No education found', 404, 'error'));
  }
  const { httpCode, response } = await deleteElement(
    TalentProfile,
    user,
    req.params.id,
    'education',
    false
  );
  res.status(httpCode).json(response);
});

exports.updateMySocialNetwork = catchAsync(async (req, res, next) => {
  const socialFields = ['facebook', 'twitter', 'linkedin', 'discord'];
  let updateSocials = {};
  socialFields.forEach((field) => {
    if (req.body[field] && req.body[field] !== '') {
      updateSocials[field] = req.body[field];
    }
  });

  if (!Object.keys(updateSocials).length) {
    return next(new AppError('Nothing to update', 400, 'error'));
  }

  const talentSocialNetwork = await TalentProfile.findOneAndUpdate(
    { userId: req.body.user.id },
    {
      socialNetwork: updateSocials,
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    socials: talentSocialNetwork,
  });
});


exports.getTalentDetails = catchAsync(async (req, res, next) => {
  const {talentId} = req.params;
  let {recentJobCount} = req.query;
  recentJobCount =parseInt(recentJobCount)

  let talentProfile = await TalentProfile.findOne({
    userId: talentId
  },{ _id: 0, userId: 0 });
  if(!talentProfile){
    return next(new AppError('Talent not found', 404, 'error'))
  }

  talentProfile = formatTalentProfileAssets(talentProfile);

  res.status(200).json({
    status: 'success',
    talent: talentProfile
  })
});