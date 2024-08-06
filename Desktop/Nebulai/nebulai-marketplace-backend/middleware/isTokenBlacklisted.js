const BlacklistToken = require('../models/blacklistTokenSchema');

async function isTokenBlacklisted(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: 'Authorization header not found' });
  }
  const token = authorization.replace('Bearer ', '');
  try {
    const blacklistedToken = await BlacklistToken.findOne({ token });
    if (blacklistedToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = isTokenBlacklisted;
