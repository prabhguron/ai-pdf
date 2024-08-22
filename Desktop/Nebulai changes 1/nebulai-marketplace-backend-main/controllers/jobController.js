const CompanyProfile = require('../models/companyProfileModel');
const Application = require("../models/applicationModel");
const Job = require('../models/jobModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const mongoose = require('mongoose');
const { sanitizeHtmlString } = require('./generalController');
const { getJobs } = require('../resources/jobs');
const {nanoid} = require('nanoid');
const Offer = require('../models/offerModel');
const { APPLICATION_STATUS, OFFER_STATUS } = require('../utils/constants');
const { getUserRoleText } = require('../resources/users');

exports.createJob = catchAsync(async (req, res, next) => {
  const companyProfile = await CompanyProfile.findOne({
    userId: req.body.user._id,
  }).select('_id');

  if (!companyProfile) {
    return next(new AppError('Please complete your profile', 401, 'error'));
  }

  const jobIdentifier = `NEB-JOB-${nanoid(10)}`;
  const postInsertData = {
    ...req.body,
    companyProfileId: companyProfile._id,
    userId: req.body.user._id,
    jobDescriptionFormatted: sanitizeHtmlString(
      req?.body?.jobDescriptionFormatted ?? ''
    ).trim(),
    jobDescription: sanitizeHtmlString(req?.body?.jobDescription ?? '').trim(),
    isActive: true,
    isListedOnMarketplace: true,
    jobIdentifier
  };

  const newJob = await Job.create(postInsertData);
  res.status(201).json({
    status: 'success',
    data: {
      newJob,
    },
  });
});

exports.getAllJobs = catchAsync(async (req, res, next) => {
  const { limit, skip } = req.query;
  const { jobs, totalCount } = await getJobs({
    ...req.query,
    userId: req.body.user._id,
  });
  let nextPage = parseInt(skip) + parseInt(limit);
  if (!jobs.length || nextPage >= totalCount) nextPage = null;
  res
    .status(200)
    .json({ status: 'success', count: totalCount, data: jobs, nextPage });
});

exports.getAJobById = catchAsync(async (req, res, next) => {
  const { jobId } = req.params;
  const { user } = req.body;
  const { applicationId, fields, noListingCondition } = req.query;
  if (!jobId || !mongoose.isValidObjectId(jobId)) {
    return next(new AppError('Bad Request', 400, 'error'));
  }
  let job = await getJobs({
    jobId,
    companyMeta: true,
    fields: fields || false,
    noListingCondition: noListingCondition || false
  });

  let jobResult = job['jobs'][0] ?? null;
  if(applicationId && mongoose.isValidObjectId(applicationId)){
    const applicationInfo = await Application.findOne({
      _id: applicationId,
      jobId
    }).select({userId: 1}).populate({
      path: 'userId',
      select: ['linkedWallets']
    });
    if(applicationInfo) {
      jobResult.applicationInfo = {
        applicationId,
        talentUserId: applicationInfo?.userId?._id?.toString(),
        linkedWallets: applicationInfo?.userId?.linkedWallets
      };
    }
  }

  let alreadyApplied = await Application.findOne({
    jobId,
    userId: user?._id
  });
  if(jobResult){
    jobResult.alreadyApplied = (alreadyApplied) ? true : false;
  }

  res.status(200).json({ status: 'success', job: jobResult });
});

exports.updateJob = catchAsync(async (req, res) => {
  const { jobId } = req.params;
  if (!jobId) {
    return next(new AppError('Bad Request', 400, 'error'));
  }

  let formattedStr = sanitizeHtmlString(
    req?.body?.jobDescriptionFormatted ?? ''
  ).trim();
  formattedStr = formattedStr.replace(
    /<p><\/p>/g,
    '<br/>'
  ) /* .replace(/\n/g, '<br/>') */;
  const postUpdateData = {
    ...req.body,
    jobDescriptionFormatted: formattedStr,
    jobDescription: sanitizeHtmlString(req?.body?.jobDescription ?? '').trim(),
  };
  const updatedJob = await Job.findByIdAndUpdate(jobId, postUpdateData, {
    new: true,
  });
  res.status(200).json({ status: 'success', updatedJob });
});

exports.deleteJob = catchAsync(async (req, res) => {
  const { jobId } = req.params;
  if (!jobId) {
    return next(new AppError('Bad Request', 400, 'error'));
  }

  await Job.findByIdAndDelete(jobId);
  res.status(200).json({
    status: 'success',
    message: 'Job deleted!',
  });
});

exports.getShortListedJobs = catchAsync(async (req, res) => {
  const {user} = req.body

  const shortListedJobs = await Application.aggregate([
    { $match: { 
      status: {
       $in: [APPLICATION_STATUS['SHORTLISTED'], APPLICATION_STATUS['ACCEPTED']]
      } 
    } 
    },
    {
      $group: {
        _id: '$jobId',
        applicationId: { $first: '$_id' },
        jobId: { $first: '$jobId' },
      },
    },
    {
      $lookup: {
        from: 'jobs',
        localField: 'jobId',
        foreignField: '_id',
        as: 'jobDetails',
      },
    },
    { $unwind: '$jobDetails' },
    {
      $match: { 'jobDetails.userId': user._id },
    },
    {
      $project: { 
        _id: '$applicationId',
        'jobDetails._id': 1, 
        'jobDetails.jobTitle': 1,
        'jobDetails.jobIdentifier': 1
      },
    },
  ]);

  let jobNames = []
  if(shortListedJobs){
    jobNames = shortListedJobs?.map(job => ({
      applicationId: job?._id,
      jobId: job?.jobDetails?._id,
      value: job?.jobDetails?._id, 
      label: `${job?.jobDetails?.jobTitle} (${job?.jobDetails?.jobIdentifier})`
    }))  
  }

  res.status(200).json({
    status: 'success',
    jobs: jobNames,
  });
});

exports.sendOffer = catchAsync(async(req, res, next) => {
  const {applicationId} = req.body;
  if(!applicationId || !mongoose.isValidObjectId(applicationId)){
    return next(new AppError('Bad Request', 400));
  }
  let offerSent = false;
  let existingOffer = await Offer.findOne({
    applicationId
  });

  if(existingOffer){
    offerSent = true;
    existingOffer.isOfferSent = true;
    await existingOffer.save();
  }

  res.status(200).json({
    result: offerSent
  })
});


exports.getAllApprovedJobOffers = catchAsync(async (req, res) => {
  const {user} = req.body

  const roleText = getUserRoleText(user?.role);

  const aggregateOptions =   [
    {
      $lookup: {
        from: 'jobs',
        localField: 'jobId',
        foreignField: '_id',
        as: 'jobDetails',
      },
    },
    {
      $unwind: '$jobDetails',
    },
    {
      $lookup: {
        from: 'offers',
        localField: '_id',
        foreignField: 'applicationId',
        as: 'offers',
      },
    },
    {
      $unwind: '$offers',
    },
    { 
      $match: { 
        'offers.status': {
          $in: [OFFER_STATUS['APPROVED']]
        },
        'offers.escrowProjectId' : {
          $ne: null,
          $nin: ['', null],
        } 
      } 
    },
    {
      $project: {
        _id: '$jobDetails._id',
        applicationId: '$_id',
        jobTitle: '$offers.jobTitle',
        jobIdentifier: '$jobDetails.jobIdentifier',
        offerId: '$offers._id',
        offerIdentifier: '$offers.offerIdentifier',
        escrowProjectId: '$offers.escrowProjectId'
      },
    },
  ]

  if (roleText === 'talent') {
    aggregateOptions.unshift({
      $match: {
        userId: user?._id,
      },
    });
  } else {
    aggregateOptions.splice(2, 0, {
      $match: {
        'jobDetails.userId': user?._id,
      },
    });
  }

  const jobWithOffer = await Application.aggregate(aggregateOptions);

  let jobNames = []
  if(jobWithOffer){
    jobNames = jobWithOffer?.map(job => ({
      applicationId: job.applicationId,
      jobId: job?._id,
      jobTitle: job.jobTitle,
      value: job?.escrowProjectId, 
      offerId: job?.offerId, 
      escrowProjectId: job?.escrowProjectId, 
      label: `${job?.jobTitle} (${job?.offerIdentifier}) | Contract ID: ${job?.escrowProjectId}`,
      offerIdentifier: job.offerIdentifier
    }))  
  }

  res.status(200).json({
    status: 'success',
    jobs: jobNames,
  });
});


exports.getJobStats = catchAsync(async (req, res, next) => {
  const { jobId } = req.params;

  if(!mongoose.isValidObjectId(jobId)){
    return next(new AppError("Bad Request", 400, "error"));
  }

  const applicantCount = await Application.count({jobId});
  const smartContractInitiatedCount = await Application.count({smartContractInitiated: true, jobId});

  return res.status(200).json({
    status: 'success',
    applicantCount,
    smartContractInitiatedCount
  })
});