const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const TalentProfile = require('../models/talentProfileModel');
const CompanyProfile = require('../models/companyProfileModel');
const { formatCompanyProfileAssets, formatTalentProfileAssets } = require('./generalController');
const { checkIfUserProfileCompleted, checkIfUserWalletIsLinked, getUserStatistics, getUserRoleText, getUserProfiles, getDashboardRecommendedProfiles } = require('../resources/users');
const UserKYC = require('../models/userKYCModel');
const { checkIfKYCRetry } = require('../resources/userKYC');

exports.updatePersonalInfo = catchAsync(async (req, res, next) => {
  try {
    const { user, firstName, lastName, companyName, /* telegramUsername */ } = req.body;
    user.firstName = firstName?.length ? firstName : user.firstName;
    user.lastName = lastName?.length ? lastName : user.lastName;
    user.companyName = companyName?.length ? companyName : user.companyName;
    //user.telegramUsername = telegramUsername?.length ? telegramUsername : user.telegramUsername;

    await user.save();

    return res
      .status(200)
      .json({ status: 'success', message: 'Successfully updated info' });
  } catch (error) {
    console.log(error.message);
  }
  return next(new AppError('Something went wrong', 500, 'error'));
});

exports.getMyProfile = catchAsync(async (req, res, next) => {
  let model;
  switch (req.body.user.role) {
    // case 0:
    //   model = ;
    //   break;
    case 1:
      model = TalentProfile;
      break;
    case 2:
      model = CompanyProfile;
      break;
    // case 3:
    //   model = SolutionProviderProfile;
    //   break;
    // case 4:
    //   model = InvestorProfile;
    //   break;
    // default:
    //   model = ;
  }
  let profile = await model.findOne(
    { userId: req.body.user._id },
    { _id: 0 }
  );
  if (!profile) {
    return next(new AppError('No profile found', 404, 'error'));
  }

  profile = profile.toJSON();
  let fullProfile = {
    ...profile,
    telegramUsername: req.body.user?.telegramUsername ?? ''
  }

  
  if (req.body.user.role === 1) {
    fullProfile = formatTalentProfileAssets(fullProfile)
  }
  if (req.body.user.role === 2) {
    fullProfile = formatCompanyProfileAssets(fullProfile)
  }
  
  const walletLinked = await checkIfUserWalletIsLinked(req.body.user);
  const {profileCompleted} = await checkIfUserProfileCompleted(req.body.user);

  res.status(200).json({
    status: 'success',
    profile: fullProfile,
    profileCompleted,
    ...walletLinked
  });
});

exports.validateUserProfile = catchAsync(async(req, res, next)=>{
  const {user} = req.body;
  if(!user){
    return next(new AppError('User not found', 404, 'error'));
  }
  const userId = user.id;
  const isOnboardingComplete = user?.isOnboardingComplete;
  const isVerified = user?.isVerified;
  const {profileCompleted, incompleteFields} = await checkIfUserProfileCompleted(user);
  const walletLinked = await checkIfUserWalletIsLinked(user);
  const userKycRecord = await UserKYC.findOne({ 
    userId
  }).select(["reviewStatus", "reviewResult", "resultResponse"]);
  const userKYCReviewStatus = userKycRecord?.reviewStatus ?? '';
  const userKYCResult = userKycRecord?.reviewResult ?? '';
  let userKYCDecision = userKycRecord?.resultResponse?.reviewResult?.reviewRejectType ?? null;
  let retryKYC = false;
  let retryKYCInfo = null;
  let userKycCompleted = isVerified;
  if(userKYCResult === 'RED'){
    let {retry, retryInfo} = await checkIfKYCRetry(userKycRecord?.resultResponse);
    retryKYC = retry;
    retryKYCInfo = retryInfo
  }
  const isOnboardingStarted = !isOnboardingComplete && (profileCompleted || walletLinked?.walletLinked || userKycCompleted);

  res.status(200).json({
    status: 'success',
    role: getUserRoleText(user?.role),
    isOnboardingStarted,
    isOnboardingComplete,
    profileCompleted,
    userKycCompleted,
    userKYCReviewStatus,
    userKYCDecision,
    retryKYC,
    retryKYCInfo,
    userKYCResult,
    incompleteFields,
    ...walletLinked
  });
});

exports.getUserStats = catchAsync(async(req, res, next)=>{
  const {user} = req.body;
  if(!user){
    return next(new AppError('User not found', 404, 'error'));
  }

  const userStats = await getUserStatistics(user);

  res.status(200).json({
    status: 'success',
    userStats: userStats || null
  });
});

exports.getProfiles = catchAsync(async (req, res, next) => {
  let {limit, skip} = req.query;
  if (!limit) {
    limit = 10;
  }
  if (!skip) {
    skip = 0;
  }
  
  const { userRole } = req.params;

  const {allProfiles, totalCount} = await getUserProfiles(userRole, {
    ...req.query,
  });
  let nextPage = parseInt(skip) + parseInt(limit);
  if (!allProfiles?.length || nextPage >= totalCount) nextPage = null;

  res.status(200).json({
    status: "success",
    data: allProfiles ?? [],
    totalCount: totalCount ?? 0,
    nextPage
  });
});


exports.getRecommendedProfiles = catchAsync(async (req, res, next) => {
  const { userRole } = req.params;
  const profiles = await getDashboardRecommendedProfiles(userRole);
  res.status(200).json({
    status: "success",
    data: profiles
  });
});
