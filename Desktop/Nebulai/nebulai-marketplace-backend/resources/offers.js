const { default: mongoose } = require("mongoose");
const Offer = require("../models/offerModel");
const moment = require("moment");
const { calculateNebulaiTxFee, getErc20Tokens } = require("../contract/Marketplace");
const { ethers } = require("ethers");
const IPFSService = require("../integrations/IPFS/IPFSService");
const { DUMMY_CHANGE_ORDER_IPFS_HASH } = require("../utils/constants");

const getAllOffers = async (options) => {
  let allJobOffers = [];
  let totalCount = 0;
  try {
    let { jobId, talentId, limit, skip } = options;
    if (!limit || !skip) {
      limit = 0;
      skip = 0;
    }

    let aggregateOptions = [
      {
        $lookup: {
          from: "applications",
          localField: "applicationId",
          foreignField: "_id",
          as: "application",
        },
      },
      {
        $unwind: "$application",
      },
      {
        $lookup: {
          from: "jobs",
          localField: "application.jobId",
          foreignField: "_id",
          as: "jobDetails",
        },
      },
      {
        $unwind: "$jobDetails",
      },
      {
        $lookup: {
          from: "users",
          localField: "application.userId",
          foreignField: "_id",
          as: "talentDetails",
        },
      },
      {
        $unwind: "$talentDetails",
      },
      {
        $lookup: {
          from: "companyprofiles",
          localField: "jobDetails.companyProfileId",
          foreignField: "_id",
          as: "companyDetails",
        },
      },
      {
        $unwind: "$companyDetails",
      },
      {
        $sort: {
          submittedAt: -1,
        },
      },
      {
        $skip: parseInt(skip),
      },
      {
        $project: {
          _id: 1,
          jobTitle: 1,
          status: 1,
          isOfferSent: 1,
          jobRequirements: 1,
          jobResources: 1,
          compensation: 1,
          currencyType: 1,
          dueDate: 1,
          providerWalletAddress: 1,
          providerStake:1,
          metadataHash: 1,
          transactionHash: 1,
          escrowProjectId: 1,
          offerIdentifier: 1,
          created_at: 1,
          applicationId: "$application._id",
          mainJobId: "$application.jobId",
          mainJobTitle: "$jobDetails.jobTitle",
          mainJobIdentifier: "$jobDetails.jobIdentifier",
          companyName: "$companyDetails.companyName",
          companyProfileImg: "$companyDetails.profileImage",
          talentTelegramUsername: "$talentDetails.telegramUsername",
        },
      },
      {
        $group: {
          _id: null,
          totalCount: { $sum: 1 },
          offers: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 0,
          totalCount: 1,
          offers: {
            $cond: {
              if: { $eq: [parseInt(limit), 0] },
              then: "$offers",
              else: { $slice: ["$offers", parseInt(limit)] },
            },
          },
        },
      },
    ];

    if (jobId) {
      aggregateOptions.splice(1, 0, {
        $match: {
          "application.userId": new mongoose.Types.ObjectId(talentId),
          "application.jobId": new mongoose.Types.ObjectId(jobId),
        },
      });
    }

    let jobApplicationsQuery = Offer.aggregate(aggregateOptions);

    const aggregateResult = await jobApplicationsQuery.exec();
    if (aggregateResult.length > 0) {
      totalCount = aggregateResult[0].totalCount;
      allJobOffers = aggregateResult[0].offers;
    }

    allJobOffers = allJobOffers.map((offer) => {
      const {
        _id: offerId,
        status: offerStatus,
        created_at: offerCreatedAt,
        jobTitle: offerJobTitle,
        jobRequirements: offerJobRequirements,
        jobResources: offerJobResources,
        compensation: offerCompensation,
        currencyType: offerCurrencyType,
        dueDate: offerDueDate,
        isOfferSent,
        metadataHash,
        transactionHash,
        escrowProjectId,
        mainJobId,
        mainJobTitle,
        mainJobIdentifier,
        companyName,
        companyProfileImg,
        providerWalletAddress,
        providerStake,
        offerIdentifier,
        talentTelegramUsername,
      } = offer;
      return {
        offerId: offerId.toString(),
        mainJobId: mainJobId.toString(),
        isOfferSent,
        offerStatus,
        offerJobTitle,
        offerJobRequirements,
        offerJobResources,
        offerCompensation,
        offerCurrencyType,
        offerDueDate,
        offerIdentifier,
        metadataHash,
        transactionHash,
        escrowProjectId,
        providerWalletAddress,
        providerStake,
        mainJobTitle,
        mainJobIdentifier,
        companyName,
        talentTelegramUsername,
        companyImg: companyProfileImg
          ? `${process.env.BUCKET_CDN_URI}/${companyProfileImg}`
          : null,
        offerCreatedAtRaw: offerCreatedAt,
        offerCreatedAt: offerCreatedAt.toLocaleDateString("en-US"),
      };
    });
  } catch (error) {
    console.log(error?.message);
  }

  return { totalCount, allJobOffers };
};

const generateJobOfferMetadata = async (offerIdOrApplicationId, matchApplicationId = false) => {
  let metaData = null;
  let txData = null;
  let offerDetails = null;

  let matchCondition = {
    _id: new mongoose.Types.ObjectId(offerIdOrApplicationId),
  }
  if(matchApplicationId) {
    matchCondition = {
      applicationId: new mongoose.Types.ObjectId(offerIdOrApplicationId)
    }
  }

  try {
    const offer = await Offer.aggregate([
      {
        $lookup: {
          from: "applications",
          localField: "applicationId",
          foreignField: "_id",
          as: "application",
        },
      },
      { $unwind: "$application" },
      {
        $match: matchCondition,
      },
      {
        $lookup: {
          from: "jobs",
          localField: "application.jobId",
          foreignField: "_id",
          as: "job",
        },
      },
      { $unwind: "$job" },
      {
        $lookup: {
          from: "users",
          localField: "application.userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 1,
          jobTitle: 1,
          status: 1,
          isOfferSent: 1,
          jobRequirements: 1,
          jobResources: 1,
          compensation: 1,
          projectReviewPeriod: 1,
          currencyType: 1,
          dueDate: 1,
          metadataHash: 1,
          transactionHash: 1,
          escrowProjectId: 1,
          providerStake: 1,
          providerWalletAddress: 1,
          offerIdentifier: 1,
          applicationId: "$application._id",
          smartContractInitiated: "$application.smartContractInitiated",
          mainJobIdentifier: "$job.jobIdentifier",
          mainJobTitle: "$job.jobTitle",
          mainJobStatus: "$application.status",
          companyId: "$job.userId",
          talentId: "$user._id",
        },
      },
    ]);

    if (offer?.[0]) {
      metaData = {};
      txData = {};
      offerDetails = {};
      const offerInfo = offer[0];
      metaData.identifier = offerInfo?.mainJobIdentifier;
      metaData.offerIdentifier = offerInfo?.offerIdentifier;
      metaData.title = offerInfo?.jobTitle;
      metaData.compensation = offerInfo?.compensation;
      metaData.projectReviewPeriod = offerInfo?.projectReviewPeriod;
      metaData.currencyType = offerInfo?.currencyType;
      metaData.providerWalletAddress = offerInfo?.providerWalletAddress;
      metaData.providerStake = offerInfo?.providerStake;
      metaData.talent = offerInfo?.talentId?.toString();
      metaData.company = offerInfo?.companyId?.toString();
      metaData.requirements = offerInfo?.jobRequirements;
      metaData.resources = offerInfo.jobResources?.map(
        (resource) => `${process.env.BUCKET_CDN_URI}/${resource}`
      );
      metaData.dueDate = offerInfo?.dueDate;

      txData.metadataHash = offerInfo?.metadataHash;
      txData.transactionHash = offerInfo?.transactionHash;
      txData.escrowProjectId = offerInfo?.escrowProjectId;

      offerDetails.offerId = offerInfo?._id;
      offerDetails.offerStatus = offerInfo?.status;
      offerDetails.isOfferSent = offerInfo?.isOfferSent;
      offerDetails.smartContractInitiated = offerInfo?.smartContractInitiated

    }
  } catch (error) {
    console.log('generateJobOfferMetadata  |ERROR | ', error?.message);
  }
  return {
    metaData,
    txData,
    offerDetails
  };
};

const prepareArgumentForEscrowContractCreation = async (metadata) => {
  const reviewPeriodDays = metadata?.projectReviewPeriod ?? 1;
  const arguments = {
    provider: metadata?.providerWalletAddress,
    paymentToken: ethers.constants.AddressZero, // MATIC 
    projectFee: null,
    projectFeeWithTxFee: null,
    providerStake: 0,
    dueDate: null,
    reviewPeriodLength: reviewPeriodDays * 86400, //in seconds [ 1 Day ]
    detailsURI: null,
  };
  if (metadata) {
    const dueDate = moment.utc(metadata?.dueDate);
    // Get the Unix timestamp in seconds
    const unixTimestampSeconds = dueDate.valueOf() / 1000;
    arguments.dueDate = unixTimestampSeconds;
    let _providerStake = ethers.utils.parseEther(metadata?.providerStake?.toString(), 'ether');
    let _projectFee = ethers.utils.parseEther(metadata?.compensation?.toString(), 'ether');
    const marketplaceTokens = await getErc20Tokens();
    let _paymentToken = marketplaceTokens[metadata?.currencyType] ?? ethers.constants.AddressZero;
    let _txFee = await calculateNebulaiTxFee(_projectFee, _paymentToken);
    let _projectFeeWithTxFee = _projectFee?.add(_txFee).toString();
    arguments.projectFeeWithTxFee = _projectFeeWithTxFee;
    arguments.projectFee = _projectFee.toString();
    arguments.providerStake = _providerStake.toString();
    arguments.paymentToken = _paymentToken
  }

  return arguments;
};

const prepareChangeOrderMetadata = async (offerId, changeOrderDesc, adjustedProjectFee) =>{
   try {
      const offerRecord = await Offer.findById(offerId);
      if(offerRecord){
        const meta = {
          projectId: offerRecord?.escrowProjectId,
          description: changeOrderDesc,
          adjustedProjectFee
        }
        let ipfsCID = '';
        if(process.env.NODE_ENV === 'development'){
          ipfsCID = DUMMY_CHANGE_ORDER_IPFS_HASH;
        }else{
          ipfsCID = await IPFSService.uploadToIPFS(meta);
        }
        await Offer.updateOne({
          _id: offerId
        },{
          metadataHash: ipfsCID
        });
        return `ipfs://${ipfsCID}`;
      }
   } catch (error) {
    
   }
   return null
}

const prepareEvidenceMetadata = async (offerId, evidenceDesc) =>{
  try {
     const offerRecord = await Offer.findById(offerId);
     if(offerRecord){
       const meta = {
         projectId: offerRecord?.escrowProjectId,
         description: evidenceDesc
       }
       let ipfsCID = '';
       if(process.env.NODE_ENV === 'development'){
          ipfsCID = 'DUMMY_EVIDENCE_IPFS_HASH'
        }else{
          ipfsCID = await IPFSService.uploadToIPFS(meta);
        }
       await Offer.updateOne({
         _id: offerId
       },{
         metadataHash: ipfsCID
       });
       return `ipfs://${ipfsCID}`;
     }
  } catch (error) {
   
  }
  return null
}

module.exports = {
  getAllOffers,
  generateJobOfferMetadata,
  prepareArgumentForEscrowContractCreation,
  prepareChangeOrderMetadata,
  prepareEvidenceMetadata
};
