const passport = require('passport');
function authenticateJwt(req, res, next) {
  passport.authenticate('jwt', async function (err, user, info) {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({message: 'Unauthorized'})
    }
    req.body.user = user;
    next();
  })(req, res, next);
}

module.exports = { authenticateJwt };
