const CompanyProfile = require('../models/companyProfileModel');
const TalentProfile = require('../models/talentProfileModel');
const User = require('../models/userModel');
const Job = require('../models/jobModel');
const Application = require('../models/applicationModel');
const { APPLICATION_STATUS } = require('../utils/constants');
const {
  cryptoPrice,
} = require('../services/blockchain/priceListener/priceListener');
const { regexArray } = require('../utils/helpers');
const { isApproved } = require('../contract/Whitelist');

const checkIfUserProfileCompleted = async (user) => {
  let profileCompleted = false;
  let profileCreationStarted = false;
  let completedFields = [];
  let incompleteFields = [];
  try {
    const userId = user?._id;
    const role = user?.role;
    const telegram = user?.telegramUsername ?? '';

    const profileModel = profileModelForRole(role);
    if (profileModel) {
      const profile = await profileModel.findOne({ userId: userId });
      if (profile) {
        const profileFields = getProfileFieldsForRole(role);
        incompleteFields = profileFields;
        if (profileFields.length) {
          let allFieldsComplete = true;
          for (const field of profileFields) {
            let fieldValLength = profile[field]?.length;
            if (typeof profile[field] === 'number') {
              fieldValLength = profile[field];
            }
            if (field === 'socialNetwork') {
              fieldValLength = Object.values(profile[field]).find(
                (value) => value !== ''
              )?.length;
            }
            if (!fieldValLength) {
              allFieldsComplete = false;
              break;
            }
            completedFields.push(field)
          }
          profileCompleted = allFieldsComplete; 
        }

        profileCreationStarted = profileFields.length !== completedFields.length
        incompleteFields = profileFields.filter(field => !completedFields.includes(field));
        
        if (!telegram.length){
          profileCompleted = false;
          incompleteFields.push('telegram');
        }
      }
    }
  } catch (error) {
    console.log(error.message);
  }
  return {
    profileCompleted, 
    incompleteFields,
    profileCreationStarted
  };
};

const profileModelForRole = (role) => {
  let profileModel = null;
  switch (role) {
    case 1:
      profileModel = TalentProfile;
      break;
    case 2:
      profileModel = CompanyProfile;
      break;
  }
  return profileModel;
};

const getProfileFieldsForRole = (role) => {
  let profileFields = [];
  switch (role) {
    //Talent
    case 1:
      profileFields = [
        'overAllWorkExperience',
        //"socialNetwork",
        'languages',
        'skills',
        //"projects",
        //"certificates",
        'workExperiences',
        //"education",
        'bio',
        'email',
        'fullName',
        'jobTitle',
        'phone',
        //"profileImage",
      ];
      break;
    //Company
    case 2:
      profileFields = [
        // "socialNetwork",
        'technologies',
        //"projects",
        //"caseStudies",
        //"teamMembers",
        //"partnerships",
        //"testimonials",
        'companyName',
        'description',
        'email',
        'industry',
        'location',
        // "profileImage",
        'size',
      ];
      break;
  }
  return profileFields;
};

const getUserRoleText = (role) => {
  let roleText = null;
  switch (role) {
    case 1:
      roleText = 'talent';
      break;
    case 2:
      roleText = 'company';
      break;
  }
  return roleText;
};

const checkIfUserWalletIsLinked = async (user) => {
  let result = {
    walletLinked: false,
    wallets: [],
  };
  try {
    const userId = user?._id;
    const userRecord = await User.findOne({ _id: userId }).select({
      linkedWallets: 1,
    });
    if (userRecord) {
      result.walletLinked = userRecord?.linkedWallets?.length > 0;
      result.wallets = userRecord?.linkedWallets || [];
    }
  } catch (error) {
    console.log(error?.message);
  }
  return result;
};

const checkIfWalletLinkedWithSomeOtherUser = async (
  walletAddress,
  excludedIds
) => {
  try {
    const result = await User.findOne({
      _id: { $nin: excludedIds },
      'linkedWallets.address': walletAddress
    }).select(["linkedWallets"]);
    return result;
  } catch (error) {}
  return null;
};

const getUserStatistics = async (user) => {
  try {
    const role = user?.role;
    const roleText = getUserRoleText(role);
    if (!role) return null;

    let stats = null;
    switch (roleText) {
      case 'talent':
        stats = await talentStats(user?._id);
        break;
      case 'company':
        stats = await companyStats(user?._id);
        break;
      default:
        break;
    }
    return stats;
  } catch (error) {}
  return null;
};

const companyStats = async (userId) => {
  const userStats = await Job.aggregate([
    {
      $match: { userId: userId },
    },
    {
      $lookup: {
        from: 'applications',
        localField: '_id',
        foreignField: 'jobId',
        as: 'applications',
      },
    },
    {
      $group: {
        _id: null,
        totalPostedJobs: { $sum: 1 },
        totalShortlistedApplications: {
          $sum: {
            $cond: [
              {
                $eq: [
                  {
                    $ifNull: [
                      { $arrayElemAt: ['$applications.status', 0] },
                      '',
                    ],
                  },
                  APPLICATION_STATUS['SHORTLISTED'],
                ],
              },
              1,
              0,
            ],
          },
        },
        totalAcceptedApplications: {
          $sum: {
            $cond: [
              {
                $eq: [
                  {
                    $ifNull: [
                      { $arrayElemAt: ['$applications.status', 0] },
                      '',
                    ],
                  },
                  APPLICATION_STATUS['ACCEPTED'],
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalPostedJobs: 1,
        totalShortlistedApplications: 1,
        totalAcceptedApplications: 1,
      },
    },
  ]);

  return userStats?.[0] ?? null;
};

const talentStats = async (userId) => {
  const userStats = await Application.aggregate([
    {
      $match: { userId: userId },
    },
    {
      $group: {
        _id: null,
        totalAppliedJobs: { $sum: 1 },
        totalShortlistedJobs: {
          $sum: {
            $cond: [
              {
                $eq: [
                  { $ifNull: ['$status', ''] },
                  APPLICATION_STATUS['SHORTLISTED'],
                ],
              },
              1,
              0,
            ],
          },
        },
        totalAcceptedJobs: {
          $sum: {
            $cond: [
              {
                $eq: [
                  { $ifNull: ['$status', ''] },
                  APPLICATION_STATUS['ACCEPTED'],
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalAppliedJobs: 1,
        totalShortlistedJobs: 1,
        totalAcceptedJobs: 1,
      },
    },
  ]);
  // TODO: Need to figure out a different way to calculate total earnings.
  const earningSummary = 0 //await getTotalEarnings;
  userStats[0]['earningSummary'] = earningSummary;
  return userStats[0] ?? null;
};

const getTotalEarnings = async (userId) => {
  const userRecord = await TalentProfile.findOne({ userId }).select({
    earnings: 1,
    _id: 0,
  });
  let earningSummary = {};
  let totalSum = 0;
  await Promise.all(
    userRecord.earnings.map(async (val) => {
      if (val.currency !== 'USD' && val.currency !== 'NEBTT') {
        const price = await cryptoPrice(val.currency);
        totalSum += price * val.amount;
        earningSummary[val.currency] = val.amount;
      } else {
        totalSum += val.amount;
        earningSummary[val.currency] = val.amount;
      }
    })
  );
  earningSummary['TotalEarningsInUSD'] = totalSum;
  return earningSummary;
};


const markUserOnboardingComplete = async (user, verify=false) => {
  try {
    const userId = user?.id;
    const {profileCompleted} = await checkIfUserProfileCompleted(user);
    if(profileCompleted){
      const updateData = {
        isOnboardingComplete: true,
      }
      if(verify){
        updateData.isVerified = verify
      }
      await User.updateOne(
        { _id: userId },
        updateData
      );
    }
  } catch (error) {
    console.log(error);
  }
}


const getTalentProfilesMatchFilter = (options) => {
  const { tags, skills } = options;
  let matchFilter = null;
  let caseInsensitiveTags = [];
  let caseInsensitiveSkills = [];
  if (tags?.length) {
    caseInsensitiveTags = regexArray(tags);
  }
  if (skills?.length) {
    caseInsensitiveSkills = regexArray(skills);
  }

  if (!caseInsensitiveTags?.length && !caseInsensitiveSkills.length)
    return matchFilter;

  matchFilter = {
      $and: [
        caseInsensitiveTags?.length
          ? {
              profileTags: {
                $in: caseInsensitiveTags,
              },
            }
          : {},
        caseInsensitiveSkills?.length
          ? {
              skills: {
                $elemMatch: {
                  skill: {
                    $in: caseInsensitiveSkills,
                  },
                },
              },
            }
          : {},
      ],
  };

  return matchFilter;
};


const getUserProfiles = async (userRole, options) => {
  try {
    switch (userRole) {
      case "talent":
        return await getTalentProfiles(options);
      default:
        break;
    }
  } catch (error) {}
  return {
    allProfiles: [],
    totalCount: 0,
  };
};


const getTalentProfiles = async (options) => {
  let totalCount = 0;
  let allProfiles = [];
  try {
    let {
      limit,
      skip,
    } = options;
    if (!limit) {
      limit = 10;
    }
    if (!skip) {
      skip = 0;
    }
  
    let talentProfiles = TalentProfile.find()
      .select({
        _id: 1,
        userId: 1,
        fullName: 1,
        rating: 1,
        projectsDone: 1,
        jobTitle: 1,
        location: 1,
        profileTags: 1,
        profileImage: 1,
        created_at: 1,
      })
      .sort({ created_at: -1 });

    let conditions = {
      email: {
        $exists: true,
        $ne: "",
      },
    };

    const matchFilter = getTalentProfilesMatchFilter(options);
    if (matchFilter) {
      conditions = { ...conditions, ...matchFilter };
    }
    talentProfiles = talentProfiles.where(conditions);

    if (limit) {
      totalCount = await TalentProfile.countDocuments(talentProfiles.getQuery());
      talentProfiles = talentProfiles.limit(parseInt(limit)).skip(parseInt(skip));
    }

    allProfiles = await talentProfiles.lean().exec();

    allProfiles = await Promise.all(allProfiles.map(async(profile) => {
      return {
        ...profile,
        avatar: profile?.profileImage
          ? `${process.env.BUCKET_CDN_URI}/${profile?.profileImage}`
          : null,
      };
    }));
  } catch (error) {
    console.log(error?.message);
  }
   return { allProfiles, totalCount };
};


const getDashboardRecommendedProfiles = async (userRole) => {
  try {
    switch (userRole) {
      case "talent":
        return await getRecommendedTalentProfiles();
      case "company":
          return await getRecommendedCompanyProfiles();
      default:
        break;
    }
    return
  } catch (error) {}
  return [];
};


const getRecommendedCompanyProfiles = async () => {
  let data = [];
  try {
    data = await CompanyProfile.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "usersInfo",
        },
      },
      {
        $match: {
          $and: [
            { "usersInfo.isVerified": true }, // Check if usersInfo.isVerified is true
            { industry: { $exists: true, $ne: "" } }, // Check if industry exists and is not empty string
            { location: { $exists: true, $ne: "" } }, // Check if location exists and is not empty string
          ],
        },
      },
      { $sample: { size: 3 } },
      {
        $project: {
          userId: 1,
          companyName: 1,
          location: 1,
          profileImage: {
            $cond: {
              if: { $ne: ["$profileImage", null] },
              then: {
                $concat: [`${process.env.BUCKET_CDN_URI}/`, "$profileImage"],
              },
              else: "$profileImage",
            },
          },
          industry: 1,
        },
      },
    ]);
  } catch (error) {
      console.log('getRecommendedCompanyProfiles: ERROR | ', error?.message);   
  }
  return data;
};


const getRecommendedTalentProfiles = async () => {
  let data = [];
  try {
    data = await TalentProfile.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "usersInfo",
        },
      },
      {
        $match: {
          $and: [
            { "usersInfo.isVerified": true }, // Check if usersInfo.isVerified is true
            { profileTags: { $ne: [] } }, // Check if profileTags is not empty array
            { location: { $exists: true, $ne: "" } }, // Check if location exists and is not empty string
          ],
        },
      },
      { $sample: { size: 3 } },
      {
        $project: {
          userId: 1,
          fullName: 1,
          location: 1,
          profileImage: {
            $cond: {
              if: { $ne: ["$profileImage", null] },
              then: {
                $concat: [`${process.env.BUCKET_CDN_URI}/`, "$profileImage"],
              },
              else: "$profileImage",
            },
          },
          profileTags: 1,
        },
      },
    ]);
  } catch (error) {
    console.log("getRecommendedTalentProfiles: ERROR | ", error?.message);
  }
  return data;
};

const formatUserWalletsWithWhitelistedCheck = async (wallets) => {
  if (!wallets.length) return [];
  const updatedWallets = await Promise.all(
    wallets.map(async (wallet) => {
      const isWhitelisted = await isApproved(wallet?.address);
      return { 
        _id: wallet._id, 
        name: wallet.name,
        address: wallet.address,
        isApproved: isWhitelisted 
      };
    })
  );
  return updatedWallets;
};

module.exports = {
  checkIfUserProfileCompleted,
  checkIfUserWalletIsLinked,
  checkIfWalletLinkedWithSomeOtherUser,
  getUserRoleText,
  getUserStatistics,
  getTalentProfiles,
  getUserProfiles,
  markUserOnboardingComplete,
  getDashboardRecommendedProfiles,
  formatUserWalletsWithWhitelistedCheck
};
