const CompanyProfile = require('../models/companyProfileModel');

async function isCompany(req, res, next) {
  if (req.body.user.role === 2) {
    const companyId = await CompanyProfile.find({ userId: req.body.user._id });
    req.body.companyId = companyId[0]._id;
    next();
  } else {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

module.exports = isCompany;
