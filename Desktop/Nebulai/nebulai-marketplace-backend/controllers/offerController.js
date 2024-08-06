const { default: mongoose } = require("mongoose");
const { getRecords } = require("../resources/general");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { populateJobUserInfo } = require("../resources/applications");
const Offer = require("../models/offerModel");
const path = require("path");
const { bulkUploadObjectsToS3 } = require("./awsController");
const Application = require("../models/applicationModel");
const {getAllOffers, generateJobOfferMetadata, prepareArgumentForEscrowContractCreation, prepareChangeOrderMetadata, prepareEvidenceMetadata} = require("../resources/offers");
const { getUserRoleText } = require("../resources/users");
const {nanoid} = require('nanoid');
const { APPLICATION_STATUS, OFFER_STATUS, DUMMY_PROJECT_IPFS_HASH } = require("../utils/constants");
const Job = require("../models/jobModel");
const IPFSService = require("../integrations/IPFS/IPFSService");
const { getJobs } = require("../resources/jobs");

exports.createOffer = catchAsync(async (req, res, next) => {
  const { applicationId } = req.params;
  if (!applicationId || !mongoose.isValidObjectId(applicationId)) {
    return next(new AppError("Bad Request", 400, "error"));
  }

  let existingOffer = await Offer.findOne({
    applicationId: applicationId,
  }).select(["_id"]);
  if(existingOffer){
    return next(new AppError("Application Offer Already Exists", 409, "error"));
  }

  const {
    jobTitle,
    jobRequirements,
    jobResources,
    compensation,
    currencyType,
    dueDate,
    talentWalletAddress,
    providerStake,
    user,
    sendOfferToTalent,
    projectReviewPeriod
  } = req.body;
  let uploadedResources = [];
  if (jobResources?.length > 0) {
    //upload job resources to s3
    const bucketFilePathPrefix = `user-${user._id}/job-offers/${applicationId}`;
    let resourcesToUpload = jobResources?.map((r, idx) => {
      if (r?.buffer && r?.originalname) {
        const fileName = r?.originalname;
        const fileExtension = path.extname(fileName);
        r.originalname = `${bucketFilePathPrefix}/resource${
          idx + 1
        }${fileExtension}`;
      }
      return r;
    });
    uploadedResources = await bulkUploadObjectsToS3(resourcesToUpload);
  }

  const isOfferSent = sendOfferToTalent;
  const offerIdentifier = `NEB-OFFER-${nanoid(10)}`;
  const offerData = {
    offerIdentifier,
    applicationId,
    jobTitle,
    jobRequirements,
    dueDate,
    currencyType,
    isOfferSent,
    providerStake: providerStake ? Number(providerStake) : 0,
    projectReviewPeriod: projectReviewPeriod ? Number(projectReviewPeriod) : 1,
    compensation: Number(compensation),
    providerWalletAddress: talentWalletAddress,
    jobResources: uploadedResources,
  };
  const newOffer = await Offer.create(offerData);
  res.status(201).json({
    status: "success",
    offerId: newOffer?._id || null,
    newOffer
  });
});

exports.updateOffer = catchAsync(async (req, res, next) => {
  const { offerId } = req.params;
  if (!offerId || !mongoose.isValidObjectId(offerId)) {
    return next(new AppError("Bad Request", 400, "error"));
  }

  let existingOffer = await getRecords(
    "offers",
    [],
    {
      _id: new mongoose.Types.ObjectId(offerId),
    },
    true
  );
  if (!existingOffer) {
    return next(new AppError("Offer not found", 404, "error"));
  }
  const applicationId = existingOffer.applicationId;
  const {
    jobTitle,
    jobRequirements,
    jobResources,
    compensation,
    currencyType,
    dueDate,
    talentWalletAddress,
    providerStake,
    user,
    sendOfferToTalent,
    projectReviewPeriod
  } = req.body;

  let updatedResourceData = [];
  if (jobResources?.length > 0) {
    //upload job resources to s3
    const bucketFilePathPrefix = `user-${user._id}/job-offers/${applicationId}`;
    const uploadResources = [];
    jobResources.forEach((resource, idx) => {
        if(resource?.size > 0 && resource?.buffer && resource?.originalname){
            const fileName = resource?.originalname;
            const fileExtension = path.extname(fileName);
            resource.originalname = `${bucketFilePathPrefix}/resource${
                idx + 1
              }${fileExtension}`
            uploadResources.push(resource)
        }else{
            updatedResourceData.push(`${bucketFilePathPrefix}/${resource?.originalname}`);
        }
    }); 

    if(uploadResources?.length > 0){
        const uploadResult = await bulkUploadObjectsToS3(uploadResources);
        if(uploadResult){
            updatedResourceData = [
                ...updatedResourceData,
                ...uploadResult
            ]
        }
    }
  }

  const isOfferSent = sendOfferToTalent;
  const offerUpdateData = {
    jobTitle,
    jobRequirements,
    dueDate,
    currencyType,
    isOfferSent,
    projectReviewPeriod: projectReviewPeriod ? Number(projectReviewPeriod) : 1, 
    compensation: Number(compensation),
    providerWalletAddress: talentWalletAddress,
    providerStake: providerStake ? Number(providerStake) : 0,
    jobResources: updatedResourceData
  };

  const updatedOffer = await Offer.findByIdAndUpdate(offerId, offerUpdateData, {
    new: true,
  });
  res.status(200).json({ status: "success", offerId: updatedOffer?._id ?? null, updatedOffer });
});

exports.getApplicationOffer = catchAsync(async (req, res, next) => {
  const { applicationId } = req.params;
  const { jobId } = req.query;
  if (!applicationId || !mongoose.isValidObjectId(applicationId)) {
    return next(new AppError("Bad Request", 400, "error"));
  }
  if (jobId && !mongoose.isValidObjectId(jobId)) {
    return next(new AppError("Bad Request", 400, "error"));
  }

  let offerResult = await populateJobUserInfo(jobId, applicationId);
  let existingOffer = await getRecords(
    "offers",
    [],
    {
      applicationId: new mongoose.Types.ObjectId(applicationId),
    },
    true
  );
  
  if (existingOffer) {
    offerResult.existingOffer = true;
    offerResult = {
      ...offerResult,
      mainJobTitle: offerResult.jobTitle,
      applicationDeadline: existingOffer?.dueDate?.toLocaleDateString("en-US"),
      jobTitle: existingOffer?.jobTitle,
      currencyType: existingOffer?.currencyType,
      compensation: existingOffer?.compensation,
      jobResources: existingOffer?.jobResources,
      jobRequirements: existingOffer?.jobRequirements,
      offerId: existingOffer?._id,
      offerStatus: existingOffer?.status,
      isOfferSent: existingOffer?.isOfferSent,
      providerWalletAddress: existingOffer?.providerWalletAddress,
      providerStake: existingOffer?.providerStake ?? 0,
      offerCreatedAt: existingOffer.created_at,
      escrowProjectId: existingOffer?.escrowProjectId ?? null,
      projectReviewPeriod: existingOffer?.projectReviewPeriod ?? 1
    };
  }
  res.status(200).json({
    offer: offerResult,
  });
});


exports.getTalentOffers = catchAsync(async (req, res) => {
    const {user} = req.body
  
    const jobWithOffer = await Application.aggregate(
        [
            {
              $match: {
                userId: user?._id,
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
                'offers.isOfferSent': true,
              },
            },
            {
              $project: {
                _id: '$jobDetails._id',
                applicationId: '$_id',
                offerId: '$offers._id',
                offerStatus: '$offers.status',
                jobTitle: '$jobDetails.jobTitle',
                jobIdentifier: '$jobDetails.jobIdentifier',
              },
            },
          ]
      );
    

    let jobNames = []
    if(jobWithOffer){
      jobNames = jobWithOffer?.map(job => ({
        offerId: job.offerId,
        offerStatus: job.offerStatus,
        applicationId: job.applicationId,
        jobId: job?._id,
        value: job?._id, 
        label: `${job?.jobTitle} (${job?.jobIdentifier})`,
      }))  
    }
  
    res.status(200).json({
      status: 'success',
      jobs: jobNames,
    });
});


exports.getAllJobOffers = catchAsync(async(req, res, next) => {
    const { limit, skip } = req.query;
    const { jobId } = req.params;
    const { user } = req.body;
  
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
  
    const { allJobOffers, totalCount } = await getAllOffers(
        {
        ...req.query,
        jobId,
        talentId: user?._id
        }
    );

    let nextPage = parseInt(skip) + parseInt(limit);
    if (!allJobOffers.length || nextPage >= totalCount) nextPage = null;
    res
      .status(200)
      .json({
        status: "success",
        count: totalCount,
        data: allJobOffers,
        nextPage,
      });
});


exports.approveRejectJobOffer = catchAsync(async(req, res, next) => {
  const {user, offerId, status} = req.body;
  if (!offerId || !mongoose.isValidObjectId(offerId)) {
    return next(new AppError("Bad Request", 400, "error"));
  }

  if(!Object.values(OFFER_STATUS).includes(status)){
    return next(new AppError("Invalid Offer Status Passed", 400, "error"));
  }

  let result = null; 
  const userId = user?._id;
  const role = user?.role;
  const roleTxt = getUserRoleText(role);
  if(roleTxt !== 'talent'){
    return next(new AppError("Unauthorized", 403, "error"));
  }
  
  let existingOffer = await Offer.findOne({
    _id: offerId
  }).select(["_id", "applicationId", "status"]).populate({
    path: "applicationId",
    select: ["userId", "jobId"],
    match: {
      userId
    }
  });
  if(existingOffer){
    result = status;
    existingOffer.status = status;
    await existingOffer.save();
  }

  res.status(200).json({
    result
  });
});


exports.getJobOfferMetadata = catchAsync(async (req, res, next) => {
  const {offerId} = req.params;
  const {jobId, matchApplicationId} = req.query;
  if(!offerId || !mongoose.isValidObjectId(offerId)){
    return next(new AppError('Bad Request', 400));
  }

  let companyJobInfo = null;
  if(jobId){
    let job = await getJobs({
      jobId,
      companyMeta: true,
      fields: true,
      noListingCondition: true
    });
    companyJobInfo = job['jobs'][0] ?? null;
  }

  const {metaData:offerMetadata, txData: offerTxData, offerDetails} = await generateJobOfferMetadata(offerId, matchApplicationId ?? false);
  
  res.status(200).json({
    status: 'success',
    metadata: offerMetadata,
    txData: offerTxData,
    offerDetails,
    companyJobInfo
  });
});

exports.prepareOfferForContract = catchAsync(async(req, res, next) => {
  const {offerId} = req.params;
  if(!offerId || !mongoose.isValidObjectId(offerId)){
    return next(new AppError('Bad Request', 400));
  }
  const {metaData:offerMetadata, txData: offerTxData} = await generateJobOfferMetadata(offerId);

  let ipfsCID = offerTxData?.metadataHash ?? null
  if(!offerTxData?.metadataHash){
    if(process.env.NODE_ENV === 'development'){
      ipfsCID = DUMMY_PROJECT_IPFS_HASH
    }else{
      ipfsCID = await IPFSService.uploadToIPFS(offerMetadata);
    }
    if(!ipfsCID){
      return next(new AppError('Something went wrong', 500));
    }
    await Offer.updateOne({
      _id: offerId
    },{
      metadataHash: ipfsCID
    });
  }

  const contractArgs = await prepareArgumentForEscrowContractCreation(offerMetadata, offerTxData);
  contractArgs.detailsURI = `ipfs://${ipfsCID}`;

  res.status(200).json({
    status: 'success',
    contractArgs
  });
});

exports.updateOfferTxInfo = catchAsync(async(req, res, next) => {
  const {offerId} = req.params;
  if(!offerId || !mongoose.isValidObjectId(offerId)){
    return next(new AppError('Bad Request', 400));
  }
  const {escrowProjectId, transactionHash} = req.body;
  let existingOffer = await Offer.findOne({
    _id: offerId
  }).select(["_id", "transactionHash", "escrowProjectId", "applicationId"]).populate({
    path: "applicationId",
    select: ["userId", "jobId"]
  });
  if(!existingOffer){
    return next(new AppError('Offer Not Found', 404));
  }

   existingOffer.transactionHash = transactionHash;
   existingOffer.escrowProjectId = escrowProjectId;
   await existingOffer.save();

  const applicationId = existingOffer?.applicationId?._id;
  const jobId = existingOffer?.applicationId?.jobId;

  //Reject all other applications
  await Application.updateMany(
    {
      jobId: jobId,
      _id: { $ne:  applicationId},
    },
    {
      $set: { status: APPLICATION_STATUS['REJECTED'] },
    }
  );

  //Update current application status to accepted & set flag to indicate that smartContract was created
  await Application.updateOne({
    _id: applicationId
  },{
    smartContractInitiated: true,
    status: APPLICATION_STATUS['ACCEPTED']
  });

  //Update Job Post status to inactive and remove from marketplace listing
  await Job.updateOne({
    _id: jobId
  },{
    isActive: false,
    isListedOnMarketplace: false
  });
   
  res.status(200).json({
    status: 'success'
  });
});


exports.prepareChangeOrder = catchAsync(async(req, res, next) => {
  const {offerId} = req.params;
  if(!offerId || !mongoose.isValidObjectId(offerId)){
    return next(new AppError('Bad Request', 400));
  }
  const {changeOrderDesc, adjustedProjectFee} = req.body;
  const changeOrderCID = await prepareChangeOrderMetadata(offerId, changeOrderDesc, adjustedProjectFee);
  if(!changeOrderCID){
    return next(new AppError('Something went wrong', 500));
  }

  res.status(200).json({
    status: 'success',
    changeOrderMetaHash: changeOrderCID
  });
});


exports.prepareEvidenceURI = catchAsync(async(req, res, next) => {
  const {offerId} = req.params;
  if(!offerId || !mongoose.isValidObjectId(offerId)){
    return next(new AppError('Bad Request', 400));
  }
  const {evidenceDesc} = req.body;
  const evidenceCID = await prepareEvidenceMetadata(offerId, evidenceDesc);
  if(!evidenceCID){
    return next(new AppError('Something went wrong', 500));
  }

  res.status(200).json({
    status: 'success',
    evidenceMetaHash: evidenceCID
  });
});