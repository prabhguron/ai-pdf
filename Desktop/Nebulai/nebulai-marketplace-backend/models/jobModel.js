const mongoose = require('mongoose');
const validator = require('validator');

const workSamplesRegex =
  /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

const jobSchema = new mongoose.Schema(
  {
    jobIdentifier: { 
      type: String,
      required: true,
      unique: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: false,
    },
    companyProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CompanyProfile',
    },
    jobTitle: {
      type: String,
      required: true,
    },

    jobDescription: {
      type: String,
      required: true,
      text: true,
    },

    jobDescriptionFormatted: {
      type: String,
      required: true,
      text: true,
    },

    skillsRequired: {
      type: [String],
      required: true,
    },

    experienceLevel: {
      type: String,
      required: true,
    },

    // portfolioOrWorkSamples: [
    //   {
    //     type: String,
    //     default: '',
    //     validate: {
    //       validator: function (v) {
    //         if (!v) return true;
    //         return workSamplesRegex.test(v);
    //       },
    //       message: 'Invalid link, begin with http',
    //     },
    //   },
    // ],

    // references: [
    //   {
    //     type: String,
    //     lowercase: true,
    //     //   validate: [validator.isEmail, 'Please provide a valid email'],
    //     validate: {
    //       validator: function (v) {
    //         if (!v) return true;
    //         return v.isEmail;
    //       },
    //       message: 'Please provide a valid email',
    //     },
    //   },
    // ],

    availability: {
      type: Date,
    },

    location: {
      type: String,
    },

    compensation: {
      type: Number,
    },
    currencyType:{
      type: String,
    },
    contractType: {
      type: String,
      required: true,
    },

    applicationDeadline: {
      type: Date,
    },

    contactInformation: {
      type: String,
    },

    isListedOnMarketplace: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
