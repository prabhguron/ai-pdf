const { default: mongoose } = require("mongoose");
const Application = require("../models/applicationModel");
const { getJobs } = require("./jobs");
const Job = require("../models/jobModel");
const { OFFER_STATUS } = require("../utils/constants");

const getJobApplications = async (options) => {
  let allApplications = [];

  let totalCount = 0;
  let { forUser, forCompany, forCompanyJob, jobId, userId, limit, skip } = options;
  if (!limit || !skip) {
    limit = 0;
    skip = 0;
  }

  let aggregateOptions = [
    {
      $lookup: {
        from: "jobs",
        localField: "jobId",
        foreignField: "_id",
        as: "job",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "talentUser",
      },
    },
    {
      $lookup: {
        from: "talentprofiles",
        localField: "talentProfileId",
        foreignField: "_id",
        as: "talentProfile",
      },
    },
    {
      $lookup: {
        from: "companyprofiles",
        localField: "job.companyProfileId",
        foreignField: "_id",
        as: "companyProfile",
      },
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
        jobId: 1,
        userId: "$talentUser._id",
        talentTelegram: "$talentUser.telegramUsername",
        status: 1,
        smartContractInitiated: 1,
        submittedAt: 1,
        talentProfileId: 1,
        companyProfileId: "$job.companyProfileId",
        jobTitle: "$job.jobTitle",
        jobPoster: "$job.userId",
        companyName: "$companyProfile.companyName",
        talentFullName: "$talentProfile.fullName",
        talentProfileImg: "$talentProfile.profileImage",
        talentJobTitle: "$talentProfile.jobTitle",
        talentLocation: "$talentProfile.location",
        talentSkills: "$talentProfile.skills",
      },
    },
    {
      $group: {
        _id: null,
        totalCount: { $sum: 1 },
        applications: { $push: "$$ROOT" },
      },
    },
    {
      $project: {
        _id: 0,
        totalCount: 1,
        applications: {
          $cond: {
            if: { $eq: [parseInt(limit), 0] },
            then: "$applications",
            else: { $slice: ["$applications", parseInt(limit)] },
          },
        },
      },
    },
  ];
  if (forUser) {
    aggregateOptions.splice(3, 0, {
      $match: {
        userId,
      },
    });
    totalCount = await Application.count({userId});
  }

  if (forCompany) {
    aggregateOptions.splice(3, 0, {
      $match: {
        "job.userId": userId,
      },
    });
    totalCount = await getApplicationCountForUser(userId);
  }

  if (forCompanyJob) {
    aggregateOptions.splice(3, 0, {
      $match: {
        jobId: new mongoose.Types.ObjectId(jobId),
        "job.userId": userId
      },
    });
    totalCount = await Application.count({jobId});
  }

  let jobApplicationsQuery = Application.aggregate(aggregateOptions);

  const aggregateResult = await jobApplicationsQuery.exec();
  if (aggregateResult.length > 0) {
    //totalCount = aggregateResult[0].totalCount;
    allApplications = aggregateResult[0].applications;
  }

  allApplications = allApplications.map((application) => {
    const {
      _id: applicationId,
      jobId,
      jobTitle,
      userId: talentId,
      talentProfileId,
      jobPoster: companyUserId,
      companyName,
      talentFullName,
      submittedAt,
      status,
      smartContractInitiated,
      talentTelegram,
      talentProfileImg,
      talentJobTitle,
      talentLocation,
      talentSkills
    } = application;
    return {
      applicationId: applicationId?.toString(),
      status,
      smartContractInitiated,
      talentSkills: talentSkills[0] || [],
      talentJobTitle: talentJobTitle[0] || "",
      talentLocation: talentLocation[0] || "",
      jobId: jobId.toString(),
      talentProfileId: talentProfileId?.toString(),
      talentProfileImg: talentProfileImg
        ? `${process.env.BUCKET_CDN_URI}/${talentProfileImg}`
        : null,
      jobTitle: jobTitle[0] || "",
      companyName: companyName[0] || "",
      talentFullName: talentFullName[0] || "",
      talentTelegram: talentTelegram[0] || "",
      talentId: talentId.toString(),
      companyUserId: companyUserId[0]?.toString(),
      submittedAt: submittedAt.toLocaleDateString("en-US"),
      submittedAtRaw: submittedAt,
    };
  });

  return { allApplications, totalCount };
};

const getJobAllApplicants = async (options) => {
  let allApplicants = [];
  let totalCount = 0;
  let { jobApplicationId, status, limit, skip } = options;
  if (!limit || !skip) {
    limit = 0;
    skip = 0;
  }

  let aggregateOptions = [
    {
      $lookup: {
        from: "talentprofiles",
        localField: "talentProfileId",
        foreignField: "_id",
        as: "talentProfile",
      },
    },
    {
      $lookup: {
        from: "offers",
        localField: "_id",
        foreignField: "applicationId",
        as: "offerInfo",
      },
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
        jobId: 1,
        userId: 1,
        status: 1,
        submittedAt: 1,
        talentProfileId: 1,
        smartContractInitiated: 1,
        talentFullName: "$talentProfile.fullName",
        talentProfileImg: "$talentProfile.profileImage",
        talentJobTitle: "$talentProfile.jobTitle",
        offerId: "$offerInfo._id",
        escrowProjectId: "$offerInfo.escrowProjectId",
        offerStatus: "$offerInfo.status",
        isOfferSent: "$offerInfo.isOfferSent",
      },
    },
    {
      $group: {
        _id: null,
        totalCount: { $sum: 1 },
        applications: { $push: "$$ROOT" },
      },
    },
    {
      $project: {
        _id: 0,
        totalCount: 1,
        applications: {
          $cond: {
            if: { $eq: [parseInt(limit), 0] },
            then: "$applications",
            else: { $slice: ["$applications", parseInt(limit)] },
          },
        },
      },
    },
  ];

  let countCondition = {}
  if (jobApplicationId) {
    countCondition = {
      status:{
        $in: status
      },
      jobId: new mongoose.Types.ObjectId(jobApplicationId),
    }
    aggregateOptions.splice(1, 0, {
      $match: countCondition,
    });
  }

  totalCount = await Application.count(countCondition);

  let jobApplicationsQuery = Application.aggregate(aggregateOptions);

  const aggregateResult = await jobApplicationsQuery.exec();
  if (aggregateResult.length > 0) {
    //totalCount = aggregateResult[0].totalCount;
    allApplicants = aggregateResult[0].applications;
  }

  allApplicants = allApplicants.map((application) => {
    const {
      _id: applicationId,
      jobId,
      userId: talentId,
      talentProfileId,
      talentFullName,
      talentJobTitle,
      talentProfileImg,
      submittedAt,
      status,
      smartContractInitiated,
      offerId,
      escrowProjectId,
      offerStatus,
      isOfferSent
    } = application;
    return {
      applicationId: applicationId.toString(),
      status,
      smartContractInitiated,
      isOfferSent,
      jobId: jobId.toString(),
      talentProfileId: talentProfileId.toString(),
      talentFullName: talentFullName[0] || "",
      talentJobTitle: talentJobTitle[0] || "",
      talentProfileImg: talentProfileImg[0]
        ? `${process.env.BUCKET_CDN_URI}/${talentProfileImg[0]}`
        : null,
      talentId: talentId.toString(),
      submittedAt: submittedAt.toLocaleDateString("en-US"),
      submittedAtRaw: submittedAt,
      offerId: offerId?.[0]?.toString() || null,
      escrowProjectId: escrowProjectId[0] || null,
      offerStatus: offerStatus[0] || null,
    };
  });

  return { allApplicants, totalCount };
};

const populateJobUserInfo = async (jobId, applicationId) => {
  try {
    let offerResult = {};
    let job = await getJobs({
      jobId,
      companyMeta: true,
      fields: true,
      noListingCondition: true,
    });
    offerResult = job["jobs"][0] ?? null;
    const applicationInfo = await Application.findOne({
      _id: applicationId,
      jobId,
    })
      .select({ userId: 1, jobId: 1 })
      .populate({
        path: "userId",
        select: ["linkedWallets", "telegramUsername"],
      });
    if (applicationInfo) {
      offerResult.applicationInfo = {
        applicationId,
        talentUserId: applicationInfo?.userId?._id?.toString(),
        linkedWallets: applicationInfo?.userId?.linkedWallets,
        telegramUsername: applicationInfo?.userId?.telegramUsername,
      };
    }
    offerResult.existingOffer = false;
    offerResult.jobId = jobId;
    offerResult.offerStatus = OFFER_STATUS['OFFERED'];
    return offerResult;
  } catch (error) {
    console.log("populateJobUserInfo |ERROR| ", error?.message);
  }
  return null;
};


const getApplicationCountForUser = async (userId) => {
  try {
    const jobIds = await Job.find({ userId }, { _id: 1 }).distinct("_id");
    const totalCount = await Application.countDocuments({ jobId: { $in: jobIds } });
    return totalCount;
  } catch (error) {
    console.error(error);
    return 0;
  }
};

module.exports = {
  getJobApplications,
  getJobAllApplicants,
  populateJobUserInfo
};
