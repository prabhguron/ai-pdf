const mongoose = require('mongoose');

const userKYCSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
    },
    applicantId: {
      type: String,
      unique: true,
    },
    reviewStatus: {
      type: String,
    },
    docs:{
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    reviewResult: {
      type: String,
      default: 'PENDING' // PENDING, GREEN, RED
    },
    resultResponse:{
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    isVerified: {
      type: Boolean,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const UserKYC = mongoose.model('UserKYC', userKYCSchema);

module.exports = UserKYC;