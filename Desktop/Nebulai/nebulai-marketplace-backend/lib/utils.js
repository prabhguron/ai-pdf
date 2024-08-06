const jwt = require("jsonwebtoken");

const accessSecret = process.env.JWT_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;

function issueJWT(data, expiresIn, type) {
  const payload = data;

  let secret = accessSecret;
  if (type === "refresh") {
    secret = refreshSecret;
  }
  const signedToken = jwt.sign(payload, secret, { expiresIn: expiresIn });

  return {
    token: signedToken,
    expires: expiresIn,
  };
}

function validateAccessToken(token) {
  try {
    return jwt.verify(token, accessSecret);
  } catch (e) {
    console.log(e.message);
  }
  return null;
}

function validateRefreshToken(refreshToken) {
  try {
    return jwt.verify(refreshToken, refreshSecret);
  } catch (e) {
    console.log(e.message);
  }
  return null;
}

function decodeAccessToken(token) {
  try {
    const verify = validateAccessToken(token);
    return verify;
  } catch (error) {}
  return null;
}

module.exports = {
  issueJWT,
  validateAccessToken,
  validateRefreshToken,
  decodeAccessToken,
};
