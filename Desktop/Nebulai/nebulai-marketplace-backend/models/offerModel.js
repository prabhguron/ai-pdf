const mongoose = require('mongoose');
const { OFFER_STATUS } = require('../utils/constants');

const offerSchema = new mongoose.Schema(
  {
    applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application',
    },
    offerIdentifier:{
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: Object.values(OFFER_STATUS),
        default: OFFER_STATUS['OFFERED'],
    },
    isOfferSent: {
        type: Boolean,
        default: false,
    },
    jobTitle: {
        type: String,
        required: true,
    },
    jobRequirements: {
        type: [String],
        required: true,
    },
    jobResources: {
        type: [String],
        required: true,
    },
    providerWalletAddress:{
        type: String,
        required: true,
    },
    providerStake: {
        type: Number,
        required: true,
        default: 0,
    },
    compensation: {
        type: Number,
        required: true,
    },
    currencyType:{
        type: String,
        required: true,
    },
    dueDate: {
        type: Date,
    },
    //project Review Period in days
    projectReviewPeriod: {
        type: Number,
        default: 1,
    },
    metadataHash:{
        type: String,
        default: null
    },
    transactionHash:{
        type: String,
        default: null
    },
    escrowProjectId:{
        type: String,
        default: null
    }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;