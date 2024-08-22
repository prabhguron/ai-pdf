const mongoose = require('mongoose');
const validator = require('validator');

const socialMediaLinkRegex = {
  facebook: /^https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9_\.]+$/,
  twitter: /^https?:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9_\.]+$/,
  linkedin: /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_\-]+$/,
  discord: /^https?:\/\/(www\.)?discord\.gg\/[a-zA-Z0-9]+$/,
  website: /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
};

const companyProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
    },
    companyName: {
      type: String,
    },
    industry: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    description: {
      type: String,
      maxlength: [1000, 'Should be below 1000 characters'],
    },
    location: {
      type: String,
    },
    /**
     * NOTE: COMPANY_SIZE_OPTIONS maps internal size identifiers to user-selected labels.
     * Keys represent size identifiers stored as integers, not actual sizes.
     * Refer to utils/constants.js for COMPANY_SIZE_OPTIONS, where:
     * - Keys (e.g., 1, 2) are internal size identifiers.
     * - Values (e.g., "1-10 employees", "11-50 employees") are user-selected labels.
    */
    size: {
      type: Number,
      defaultValue: 1
    },
    technologies: {
      type: [String],
    },
    primaryContactName: {
      type: String,
      required: true,
    },
    roleInCompany: {
      type: String,
      required: true,
    },
    contactPhone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
      required: true,
    },
    projects: [
      {
        name: String,
        description: {
          type: String,
          maxlength: [1000, 'Should be below 1000 characters'],
        },
        projectsImages: [String],
        url: {
          type: String,
          default: '',
          validate: {
            validator: function (v) {
              return socialMediaLinkRegex.website.test(v);
            },
            message: 'Invalid URL',
          },
        },
      },
    ],
    caseStudies: [
      {
        clientName: String,
        description: {
          type: String,
          maxlength: [1000, 'Should be below 1000 characters'],
        },
        caseStudiesImages: [String],
        url: {
          type: String,
          default: '',
          validate: {
            validator: function (v) {
              return socialMediaLinkRegex.website.test(v);
            },
            message: 'Invalid URL',
          },
        },
      },
    ],
    teamMembers: [
      {
        name: String,
        jobTitle: String,
        bio: {
          type: String,
          maxlength: [1000, 'Should be below 1000 characters'],
        },
      },
    ],
    partnerships: [
      {
        name: String,
        partnershipsImages: [String],
        url: {
          type: String,
          default: '',
          validate: {
            validator: function (v) {
              return socialMediaLinkRegex.website.test(v);
            },
            message: 'Invalid URL',
          },
        },
      },
    ],
    testimonials: [
      {
        clientName: String,
        description: {
          type: String,
          maxlength: [1000, 'Should be below 1000 characters'],
        },
        testimonialsImages: [String],
      },
    ],
    socialNetwork: {
      facebook: {
        type: String,
        default: '',
        validate: {
          validator: function (v) {
            if(!v) return true;
            return socialMediaLinkRegex.facebook.test(v);
          },
          message: 'Invalid Facebook link',
        },
      },
      twitter: {
        type: String,
        default: '',
        validate: {
          validator: function (v) {
            if(!v) return true;
            return socialMediaLinkRegex.twitter.test(v);
          },
          message: 'Invalid Twitter link',
        },
      },
      linkedin: {
        type: String,
        default: '',
        validate: {
          validator: function (v) {
            if(!v) return true;
            return socialMediaLinkRegex.linkedin.test(v);
          },
          message: 'Invalid LinkedIn link',
        },
      },
      discord: {
        type: String,
        default: '',
        validate: {
          validator: function (v) {
            if(!v) return true;
            return socialMediaLinkRegex.discord.test(v);
          },
          message: 'Invalid Discord link',
        },
      },
      website: {
        type: String,
        default: '',
        validate: {
          validator: function (v) {
            if(!v) return true;
            return socialMediaLinkRegex.website.test(v);
          },
          message: 'Invalid URL',
        },
      },
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const CompanyProfile = mongoose.model('CompanyProfile', companyProfileSchema);

module.exports = CompanyProfile;
