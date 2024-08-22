const Job = require("../models/jobModel");
const TalentProfile = require("../models/talentProfileModel");
const Application = require("../models/applicationModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const mongoose = require("mongoose");
const {
  getUserRoleText,
  checkIfUserProfileCompleted,
} = require("../resources/users");
const { getJobAllApplicants, getJobApplications } = require("../resources/applications");
const { APPLICATION_STATUS } = require("../utils/constants");

exports.submitApplication = catchAsync(async (req, res, next) => {
  const { user } = req.body;
  const { jobId } = req.params;

  const roleText = getUserRoleText(user?.role);
  if (roleText !== "talent") {
    return next(new AppError("Only talent can apply for jobs", 400, "error"));
  }

  const talentProfileCompleted = await checkIfUserProfileCompleted(user);
  if (!talentProfileCompleted) {
    return next(new AppError("Please complete your profile", 400, "error"));
  }

  const talentProfile = await TalentProfile.findOne({
    userId: req.body.user._id,
  }).select("_id");
  if (!talentProfile) {
    return next(new AppError("Profile not found", 401, "error"));
  }

  const jobInfo = await Job.findOne({
    _id: jobId,
  }).select("_id");
  if (!jobId) {
    return next(new AppError("Job not found", 404, "error"));
  }
  const newApplication = await Application.create({
    jobId: jobInfo._id,
    userId: user._id,
    talentProfileId: talentProfile._id,
  });

  res.status(201).json({
    status: "success",
    data: {
      newApplication,
    },
  });
});

exports.getMyApplications = catchAsync(async (req, res) => {
  const { limit, skip } = req.query;
  const { allApplications, totalCount } = await getJobApplications({
    ...req.query,
    userId: req.body.user._id,
  });
  let nextPage = parseInt(skip) + parseInt(limit);
  if (!allApplications.length || nextPage >= totalCount) nextPage = null;
  res
    .status(200)
    .json({
      status: "success",
      count: totalCount,
      data: allApplications,
      nextPage,
    });
});

exports.getApplicationById = catchAsync(async (req, res, next) => {
  const { applicationId } = req.params;
  if (!applicationId || !mongoose.isValidObjectId(applicationId)) {
    return next(new AppError("Bad Request", 400, "error"));
  }
  const application = await Application.find({
    _id: applicationId,
  })
    .populate("jobId")
    .populate("talentProfileId");
  if (!application) {
    return next(new AppError("Application not found", 404, "error"));
  }
  res.status(200).json({
    status: "success",
    data: application,
  });
});

exports.updateApplicationStatus = catchAsync(async (req, res, next) => {
  const { applicationId } = req.params;
  if (!applicationId || !mongoose.isValidObjectId(applicationId)) {
    return next(new AppError("Bad Request", 400, "error"));
  }
  const application = await Application.find({
    _id: applicationId,
  }).populate("jobId");
  const jobPosterId = application[0].jobId.userId;
  if (jobPosterId.toString() !== req.body.user._id.toString()) {
    return next(
      new AppError("Only job poster can update status", 403, "error")
    );
  }
  const updatedApplication = await Application.findByIdAndUpdate(
    applicationId,
    { status: req.body.status },
    { new: true }
  );
  res.status(200).json({ status: "success", updatedApplication });
});

exports.getJobApplicants = catchAsync(async (req, res, next) => {
  const { limit, skip, applicationStatus } = req.query;
  const { jobId } = req.params;

  if(!mongoose.isValidObjectId(jobId)){
    return  res
    .status(200)
    .json({
      status: "success",
      count: 0,
      data: [],
      nextPage: null
    });
  }

  let status = applicationStatus;
  switch (applicationStatus) {
    case 'shortlisted':
        status = [APPLICATION_STATUS['SHORTLISTED']]
      break;
    case 'accepted':
        status = [APPLICATION_STATUS['ACCEPTED']]
      break
    default:
       status = [APPLICATION_STATUS['SHORTLISTED'], APPLICATION_STATUS['ACCEPTED']]
      break;
  }

  const { allApplicants, totalCount } = await getJobAllApplicants({
    ...req.query,
    jobApplicationId: jobId,
    status: status
  });
  let nextPage = parseInt(skip) + parseInt(limit);
  if (!allApplicants.length || nextPage >= totalCount) nextPage = null;
  res
    .status(200)
    .json({
      status: "success",
      count: totalCount,
      data: allApplicants,
      nextPage,
    });
});


