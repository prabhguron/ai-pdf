function validateAPIKey(req, res, next) {
  const apiKeyHeader = req.headers["neb-x-api"];
  const appApiKey = process.env.APP_API_KEY;
  if (!apiKeyHeader || apiKeyHeader !== appApiKey) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}
module.exports = validateAPIKey;
