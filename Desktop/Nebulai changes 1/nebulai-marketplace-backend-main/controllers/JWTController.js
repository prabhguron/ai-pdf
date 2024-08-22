const { issueJWT } = require("../lib/utils");
const BlacklistToken = require("../models/blacklistTokenSchema");
const catchAsync = require("../utils/catchAsync");

const generateToken = (userOrCustomData, expiresIn, type = "access", customData = false) => {
  let accessTokenData = userOrCustomData;
  if(!customData){
    accessTokenData = {
      id: userOrCustomData._id,
      role: userOrCustomData.role,
      email: userOrCustomData.email,
      isEmailVerified: userOrCustomData.isEmailVerified,
    }
  }
  const { token } = issueJWT(
    accessTokenData,
    expiresIn,
    type
  );
  return token;
};

const addToBlacklist = catchAsync(async (token) => {
  await BlacklistToken.create({ token });
});

module.exports = { generateToken, addToBlacklist };
