const GitStrategy = require("passport-github2").Strategy;
const User = require("../models/userModel");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcrypt");

const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL;

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await User.findOne({
            email,
            isEmailVerified: true
          }).select(["+password", "isOnboardingComplete", "isVerified"]);
          if (!user) {
            return done(null, false, {
              message: "Incorrect email or password.",
            });
          } else if (!(await bcrypt.compare(password, user.password))) {
            return done(null, false, {
              message: "Incorrect email or password.",
            });
          }
          return done(null, user);
        } catch (e) {
          return done(e, false);
        }
      }
    )
  );

  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
      },
      async (payload, done) => {
        try {
          const user = await User.findById(payload.id);
          if (user) {
            if (user.passwordChangedAt) {
              const changedTimestamp = parseInt(
                user.passwordChangedAt.getTime() / 1000,
                10
              );
              if (payload.iat < changedTimestamp) {
                return done(null, false, "Please log in again");
              }
            }
            return done(null, user);
          }
          return done(null, false);
        } catch (e) {
          return done(e, false);
        }
      }
    )
  );

  passport.use(
    "github",
    new GitStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_SECRET,
        callbackURL: GITHUB_CALLBACK_URL,
        scope: ['user:email']
      },
      async (accessToken, refreshToken, profile, done) => {
        return done(null, profile)
      }
    )
  );
};
