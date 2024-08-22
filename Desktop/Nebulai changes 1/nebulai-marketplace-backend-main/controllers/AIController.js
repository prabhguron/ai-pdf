const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require('@google/generative-ai');
const TalentProfile = require('../models/talentProfileModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.getTalentRating = catchAsync(async (req, res, next) => {
  return new Promise(async (resolve, reject) => {
    try {
      let talentId = req.query.talentId;
      let talentProfile = await TalentProfile.findOne({ userId: talentId });

      if (!talentProfile) {
        return next(new AppError('Talent not found'));
      }

      // Check if ratingRequests exists, if not, initialize it
      if (!talentProfile.ratingRequests) {
        talentProfile.ratingRequests = [];
      }

      // Filter requests made in the current month
      const currentMonthRequests = talentProfile.ratingRequests.filter(
        (date) => {
          const requestDate = new Date(date);
          const now = new Date();
          return (
            requestDate.getMonth() === now.getMonth() &&
            requestDate.getFullYear() === now.getFullYear()
          );
        }
      );

      // Check if the limit of 5 has been reached
      if (currentMonthRequests.length >= 5) {
        return next(new AppError('Monthly rating request limit reached'));
      }
      const safetySettings = [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ];
      const generationConfig = {
        temperature: 0.0,
      };

      const model = genAI.getGenerativeModel({
        model: 'gemini-pro',
        safetySettings,
        generationConfig,
      });
      const prompt = `Assess the talent of a candidate based on the profile details provided: X years of relevant work experience, Y completed projects, Z skills with an average of A years of experience per skill, earnings from B different currencies totaling C amount, and active engagement on D professional social networks. First, categorize the talent into levels: junior (1-3 points), mid (4-7 points), or senior (8-10 points). Then, rate the talent on a scale of 0 to 10 based on the categorization and the following scoring guidelines:
      1. Work Experience: 0.5 points for each year of relevant experience.
      2. Projects Completed: 0.1 points for each project completed.
      3. Skills and Expertise: 1 point for each skill with more than 2 years of experience.
      4. Earnings Diversity: 1 point for earnings in more than one currency.
      5. Professional Network Engagement: 0.5 point for active engagement on 1 or more professional social networks.
      6. Language Proficiency: 0.5 points for each additional language known.
      Based on the total score, assign the candidate to the appropriate category (junior, mid, senior) and provide a single integer rating within that range. For junior talent, scale their score within 1-3; for mid-level talent, scale their score within 4-7; and for senior talent, adjust their score within 8-10. Use discretion to round to the nearest whole number within the category's scale. Provide the final rating as a single integer. The talent profile: ${talentProfile}.
      Return a final repsonse inside an array with the following: always return the final rating, a two-line verbal profile analysis, and tips to improve rating in 20 words.`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      // console.log(text);
      text = JSON.parse(text.replace(/`/g, '').replace(/'/g, '"'));
      // console.log((text[0]), text[1]);
      let rating = parseInt(text[0]);
      let review = text[1];
      let improvements = text[2];

      // Update talent profile rating and add the current timestamp to ratingRequests
      talentProfile.rating = rating;
      talentProfile.review = review;
      talentProfile.improvements = improvements;
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      talentProfile.ratingRequests = talentProfile.ratingRequests.filter(
        (date) => new Date(date) > oneMonthAgo
      );
      talentProfile.ratingRequests.push(new Date()); // Add the current timestamp
      let updatedProfile = await talentProfile.save();

      if (updatedProfile) {
        resolve(true); // Resolve promise with true if rating is successfully updated
        res.status(201).json({
          status: 'success',
          rating: updatedProfile.rating,
          review: updatedProfile.review,
          improvements: updatedProfile.improvements,
          ratingRequests: updatedProfile.ratingRequests,
        });
      } else {
        reject(new AppError('Failed to update talent rating'));
      }
    } catch (error) {
      reject(error); // Reject promise with error if any error occurs during the process
    }
  });
});
