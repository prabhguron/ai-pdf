function appUrlMiddleware(req, res, next) {
  req.appUrl = `${req.protocol}://${req.get("host")}`;
  req.dAppUrl = process.env.DAPP_URL;
  next();
}

module.exports = appUrlMiddleware;
