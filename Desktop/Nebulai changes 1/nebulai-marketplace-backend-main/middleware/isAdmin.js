function isAdmin(req, res, next) {
  if (req.body.user.role === 0) {
    next();
  } else {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

module.exports = isAdmin;
