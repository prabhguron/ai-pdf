const mongoose = require('mongoose');
const { APPLICATION_STATUS } = require('../utils/constants');

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    talentProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TalentProfile',
    },
    smartContractInitiated: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: Object.values(APPLICATION_STATUS),
      default: APPLICATION_STATUS["PENDING"],
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
