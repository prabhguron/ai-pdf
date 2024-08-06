const mongoose = require('mongoose');
const validator = require('validator');

const socialMediaLinkRegex = {
  facebook: /^https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9_\.]+$/,
  twitter: /^https?:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9_\.]+$/,
  linkedin: /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_\-]+$/,
  discord: /^https?:\/\/(www\.)?discord\.gg\/[a-zA-Z0-9]+$/,
};

const talentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
    },
    fullName: {
      type: String,
    },
    location: {
      type: String,
    },
    overAllWorkExperience: {
      type: Number,
    },
    jobTitle: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    phone: {
      type: String,
      // validate: {
      //   validator: function (v) {
      //     return validator.isMobilePhone(v, 'any');
      //   },
      //   message: 'Invalid phone number',
      // },
    },
    email: {
      type: String,
      //required: true,
      //unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    languages: {
      type: [String],
      // required: true,
    },
    profileTags: {
      type: [String],
    },
    bio: {
      type: String,
      required: true,
      text: true,
    },
    skills: [
      {
        skill: {
          type: String,
        },
        yearsOfExperience: {
          type: Number,
          min: 0,
        },
      },
    ],
    projects: [
      {
        name: String,
        startYear: {
          type: Number,
          // required: true,
          validate: [
            {
              validator: function (v) {
                return v <= new Date().getFullYear();
              },
              message:
                'Start year must be less than or equal to the current year',
            },
          ],
        },
        endYear: {
          type: Number,
          // required: true,
          validate: [
            {
              validator: function (v) {
                return v <= new Date().getFullYear();
              },
              message:
                'End year must be less than or equal to the current year',
            },
            {
              validator: function (v) {
                return this.startYear <= v;
              },
              message: 'End year must be greater than or equal to start year',
              context: 'query',
            },
          ],
        },
        description: {
          type: String,
          maxlength: [500, 'Should be below 500 characters'],
        },
      },
    ],
    certificates: [
      {
        name: String,
        certificatesImages: [String],
        startYear: {
          type: Number,
          // required: true,
          validate: [
            {
              validator: function (v) {
                return v <= new Date().getFullYear();
              },
              message:
                'Start year must be less than or equal to the current year',
            },
          ],
        },
        endYear: {
          type: Number,
          // required: true,
          validate: [
            {
              validator: function (v) {
                return v <= new Date().getFullYear();
              },
              message:
                'End year must be less than or equal to the current year',
            },
            {
              validator: function (v) {
                return this.startYear <= v;
              },
              message: 'End year must be greater than or equal to start year',
            },
          ],
        },
        description: {
          type: String,
          maxlength: [500, 'Should be below 500 characters'],
        },
      },
    ],
    workExperiences: [
      {
        jobTitle: String,
        companyName: String,
        startYear: {
          type: Number,
          // required: true,
          validate: [
            {
              validator: function (v) {
                return v <= new Date().getFullYear();
              },
              message:
                'Start year must be less than or equal to the current year',
            },
          ],
        },
        endYear: {
          type: Number,
          // required: true,
          validate: [
            {
              validator: function (v) {
                return v <= new Date().getFullYear();
              },
              message:
                'End year must be less than or equal to the current year',
            },
            {
              validator: function (v) {
                return this.startYear <= v;
              },
              message: 'End year must be greater than or equal to start year',
            },
          ],
        },
        description: {
          type: String,
          maxlength: [500, 'Should be below 500 characters'],
        },
      },
    ],
    education: [
      {
        college: String,
        courseName: String,
        startYear: {
          type: Number,
          // required: true,
          validate: [
            {
              validator: function (v) {
                return v <= new Date().getFullYear();
              },
              message:
                'Start year must be less than or equal to the current year',
            },
          ],
        },
        endYear: {
          type: Number,
          // required: true,
          validate: [
            {
              validator: function (v) {
                return v <= new Date().getFullYear();
              },
              message:
                'End year must be less than or equal to the current year',
            },
            {
              validator: function (v) {
                return this.startYear <= v;
              },
              message: 'End year must be greater than or equal to start year',
            },
          ],
        },
      },
    ],
    socialNetwork: {
      facebook: {
        type: String,
        default: '',
        validate: {
          validator: function (v) {
            if (!v) return true;
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
            if (!v) return true;
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
            if (!v) return true;
            return socialMediaLinkRegex.linkedin.test(v);
          },
          message: 'Invalid LinkedIn link',
        },
      },
      discord: {
        type: String,
        // required: true,
        default: '',
        validate: {
          validator: function (v) {
            if (!v) return true;
            return socialMediaLinkRegex.discord.test(v);
          },
          message: 'Invalid Discord link',
        },
      },
    },
    earnings: {
      type: [
        {
          currency: {
            type: String,
            enum: ['USD', 'MATIC', 'NEBTT'],
            required: true,
          },
          amount: {
            type: Number,
            required: true,
            min: 0,
            default: 0, // Default value set to 0
          },
        },
      ],
      default: [
        // Default array for earnings
        { currency: 'USD', amount: 0 },
        { currency: 'MATIC', amount: 0 },
        { currency: 'NEBTT', amount: 0 },
      ],
    },
    rating: {
      type: Number,
      default: 0,
    },
    ratingRequests: [
      {
        type: Date,
        default: [],
      },
    ],
    review: {
      type: String,
      // required: true,
      text: true,
    },
    improvements: {
      type: String,
      // required: true,
      text: true,
    },
    projectsDone: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const TalentProfile = mongoose.model('TalentProfile', talentProfileSchema);

module.exports = TalentProfile;
