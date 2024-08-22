const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/userModel');
const { generateToken } = require('../controllers/JWTController');

const DAPP_URL = process.env.DAPP_URL;


// Route to initiate GitHub OAuth authentication
router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
  })
);

// Route to handle the GitHub OAuth callback
router.get(
  "/github/callback",
  passport.authenticate("github", {
    scope: ['user:email'],
    session: false,
    failureRedirect: `${DAPP_URL}/app/auth-error`,
  }),
  async (req, res) => {
    if (req?.user) {
      let redirectURL = `${DAPP_URL}/app/register`;
      const { id: profileId, displayName, emails } = req.user;
      const githubEmail = emails?.[0]?.value ?? null;
      if (!profileId || !githubEmail) {
        res.redirect(`${DAPP_URL}/app/auth-error`);
        return;
      }
      const user = await User.findOne({
        $or: [
          { email: githubEmail },
          { gitHubId: profileId },
        ]
      }).select("+password");
      if(user){
          const accessToken = generateToken(user, (expiresIn = '1d'));
          const refreshToken = generateToken(user, (expiresIn = '7d'), 'refresh');
          const cookieOptions = {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true,
          };
          if(profileId && user?.gitHubId === null){
            await User.updateOne({
              _id: user._id
            },{
              gitHubId: profileId
            });
          }
          if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
          res.cookie('refreshToken', refreshToken, cookieOptions);
          redirectURL = `${DAPP_URL}/app/sign-in?t=${accessToken}`
      }else{
          // Generate temporary access token
          const tempSignUpToken = generateToken({
              displayName,
              githubEmail,
              socialSignUp: true,
              gitHubId: profileId
          }, (expiresIn = '1h'), 'access', true);
          redirectURL = `${redirectURL}?t=${tempSignUpToken}&e=${Buffer.from(githubEmail).toString('base64')}`;
      }
      
      res.redirect(redirectURL);
    } else {
      res.redirect(`${DAPP_URL}/app/auth-error`);
    }
  }
);

module.exports = router;
