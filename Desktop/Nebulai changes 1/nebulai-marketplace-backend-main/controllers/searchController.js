// In your searchController.js
const Job = require('../models/jobModel');
const TalentProfile = require('../models/talentProfileModel');
const CompanyProfile = require('../models/companyProfileModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.searchAll = catchAsync(async (req, res, next) => {
  try {
    const searchTerm = req.query.term;

    const regex = new RegExp(searchTerm, 'i'); // 'i' for case-insensitive

    // Perform the search on each model
    const jobResults = await Job.find({ jobTitle: regex });
    const talentResults = await TalentProfile.find({ fullName: regex });
    const organizationResults = await CompanyProfile.find({
      companyName: regex,
    });

    // Combine the results
    const results = {
      jobs: jobResults,
      talents: talentResults,
      organizations: organizationResults,
    };

    res.status(200).json({
      status: 'success',
      results,
    });
  } catch (error) {
    next(new AppError(error));
  }
});
