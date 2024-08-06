const { default: mongoose } = require("mongoose");
const Application = require("../models/applicationModel");
const Job = require("../models/jobModel");
const { APPLICATION_STATUS } = require("../utils/constants");

const getJobs = async (options) => {
  let totalCount = 0;
  let jobs = [];
  try {
    const {
      jobId,
      forUser,
      forMarket,
      userId,
      companyMeta,
      companyProfileMeta,
      limit,
      skip,
      fields,
      noListingCondition,
    } = options;
    let jobsQuery = Job.find().sort({ created_at: -1 });
    if (fields) {
      jobsQuery = Job.find()
        .select({
          _id: 1,
          jobTitle: 1,
          jobIdentifier: 1,
          compensation: 1,
          currencyType: 1,
          availability: 1,
          applicationDeadline: 1,
          location: 1,
          userId: 1,
          companyProfileId: 1,
          created_at: 1,
        })
        .sort({ created_at: -1 });
    }

    let conditions = {
      isActive: true,
      isListedOnMarketplace: true,
    };
    if (noListingCondition) {
      conditions = {};
    }

    if (forUser) {
      conditions = { userId };
    }
    if (jobId) {
      conditions._id = jobId;
    }

    jobsQuery = jobsQuery.where(conditions);

    if(companyProfileMeta){
      jobsQuery.populate({
        path: "companyProfileId",
        select: ["profileImage", "companyName"],
      });
    }

    if (companyMeta) {
      jobsQuery
        .populate({
          path: "userId",
          select: ["companyName", "telegramUsername"],
        })
        .populate({
          path: "companyProfileId",
          select: ["profileImage", "companyName"],
        });
    }

    if (limit) {
      totalCount = await Job.countDocuments(jobsQuery.getQuery());
      jobsQuery = jobsQuery.limit(parseInt(limit)).skip(parseInt(skip));
    }

    jobs = await jobsQuery.lean().exec();

    jobs = await Promise.all(jobs.map(async(job) => {
      let shortlistedCount = 0;
      let smartContractCount = 0;
      if(!forMarket){
        shortlistedCount = await Application.count({jobId: job?._id, status: APPLICATION_STATUS['SHORTLISTED']})
        smartContractCount = await Application.count({jobId: job?._id, smartContractInitiated: true})
      }
      return {
        ...job,
        shortlistedCount,
        smartContractCount,
        mainJobTitle: job?.jobTitle,
        availability: job?.availability?.toLocaleDateString("en-US"),
        applicationDeadline: job?.applicationDeadline?.toLocaleDateString("en-US"),
        postedOn: job?.created_at?.toLocaleDateString("en-US"),
        postedOnRaw: job?.created_at,
        companyName: job?.companyProfileId?.companyName,
        companyImage: job?.companyProfileId?.profileImage
          ? `${process.env.BUCKET_CDN_URI}/${job?.companyProfileId?.profileImage}`
          : null,
      };
    }));
  } catch (error) {
    console.log(error?.message);
  }
  return { jobs, totalCount };
};



const getJobsNew = async (options) => {
  let allJobs = [];
  let totalCount = 0;
  try {
    let {
      jobId,
      forUser,
      forMarket,
      userId,
      companyMeta,
      limit,
      skip,
      fields,
      noListingCondition,
    } = options;

    if (!limit || !skip) {
      limit = 0;
      skip = 0;
    }

    const stringToObjectId = (id) => new mongoose.Types.ObjectId(id);

    const shortlistMatch = {
      $expr: { $eq: ["$jobId", "$$jobId"] },
      status: "shortlisted",
    };


    let projectFields = {
      _id: { $toString: "$_id" },
      jobId: { $toString: "$jobId" },
      jobTitle: 1,
      mainJobTitle: 1,
      jobIdentifier: 1,
      location: 1,
      jobDescription: 1,
      jobDescriptionFormatted: 1,
      skillsRequired: 1,
      experienceLevel: 1,
      //portfolioOrWorkSamples: 1,
      availability: {
        $dateToString: { format: "%m/%d/%Y", date: "$availability" },
      },
      compensation: 1,
      currencyType: 1,
      contractType: 1,
      applicationDeadline: {
        $dateToString: { format: "%m/%d/%Y", date: "$applicationDeadline" },
      },
      contactInformation: 1,
      isListedOnMarketplace: 1,
      isActive: 1,
      postedOn: { $dateToString: { format: "%m/%d/%Y", date: "$postedOn" } },
      postedOnRaw:1,
      jobPoster: { $toString: "$companyProfileId" },
      userId: { $toString: "$userId" },
      companyProfileId: { $toString: "$companyProfileId" },
      companyName: "$companyDetails.companyName",
      companyImage: {
        $cond: {
          if: {
            $ne: ["$companyDetails.profileImage", null],
          },
          then: {
            $concat: [
              process.env.BUCKET_CDN_URI,
              "/",
              "$companyDetails.profileImage",
            ],
          },
          else: null,
        },
      },
      shortlistedCount: 1,
    };

    if(fields || forMarket){
      projectFields = {
        _id: { $toString: "$_id" },
        jobTitle: 1,
        jobIdentifier: 1,
        compensation: 1,
        currencyType: 1,
        availability: {
          $dateToString: { format: "%m/%d/%Y", date: "$applicationDeadline" },
        },
        applicationDeadline: {
          $dateToString: { format: "%m/%d/%Y", date: "$applicationDeadline" },
        },
        location: 1,
        userId: { $toString: "$userId" },
        companyProfileId: { $toString: "$companyProfileId" },
        postedOn: { $dateToString: { format: "%m/%d/%Y", date: "$postedOn" } },
        postedOnRaw: 1
      }

      if(forMarket){
        projectFields = {
          ...projectFields,
          experienceLevel: 1,
          contractType: 1,
          companyName: "$companyDetails.companyName",
          companyImage: {
            $cond: {
              if: {
                $ne: ["$companyDetails.profileImage", null],
              },
              then: {
                $concat: [
                  process.env.BUCKET_CDN_URI,
                  "/",
                  "$companyDetails.profileImage",
                ],
              },
              else: null,
            },
          }
        }
      }
    }

    const commonAggregations = [
      { $lookup: { from: "applications", let: { jobId: "$_id" }, pipeline: [{ $match: shortlistMatch }], as: "shortlistedCount" } },
      { $sort: { created_at: -1 } },
      { $skip: parseInt(skip) },
      { $addFields: { jobId: "$_id", postedOn: "$created_at", postedOnRaw: "$created_at", mainJobTitle: "$jobTitle", shortlistedCount: { $size: "$shortlistedCount" } } },
      { $project: projectFields },
    ];

    const aggregateOptions = [
      ...commonAggregations,
      { $group: { _id: null, totalCount: { $sum: 1 }, jobs: { $push: "$$ROOT" } } },
      { $project: { _id: 0, totalCount: 1, jobs: { $cond: { if: { $eq: [parseInt(limit), 0] }, then: "$jobs", else: { $slice: ["$jobs", parseInt(limit)] } } } } },
    ];
    

    let conditions = {
      isActive: true,
      isListedOnMarketplace: true,
    };
    if (noListingCondition) {
      conditions = {};
    }

    if (jobId) {
      conditions = { ...conditions, _id: stringToObjectId(jobId) };
    }

    if (forUser) {
      conditions = { ...conditions, userId: stringToObjectId(userId) };
    }

    aggregateOptions.unshift({ $match: { ...conditions } });

    if (companyMeta) {
      const companyDetailsLookUp = [
        { $lookup: { from: "companyprofiles", localField: "companyProfileId", foreignField: "_id", as: "companyDetails" } },
        { $unwind: "$companyDetails" }
      ];

      aggregateOptions.splice(forUser ? 2 : 1, 0, ...companyDetailsLookUp);
    }
    
    let totalCountPipeline = [
      {
        $match: {
          ...conditions,
        },
      },
      {
        $group: {
          _id: null,
          totalCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          totalCount: 1,
        },
      },
    ];
    // Execute the totalCountPipeline
    const totalCountResult = await Job.aggregate(totalCountPipeline).exec();
    if (totalCountResult.length > 0) {
      totalCount = totalCountResult[0].totalCount;
    }

    let allJobsQuery = Job.aggregate(aggregateOptions);
    const aggregateResult = await allJobsQuery.exec();
    if (aggregateResult.length > 0) {
      allJobs = aggregateResult[0].jobs;
    }
  } catch (error) {
    console.log(error?.message);
  }
  return { jobs: allJobs, totalCount };
};

module.exports = {
  getJobs,
  getJobsNew,
};
