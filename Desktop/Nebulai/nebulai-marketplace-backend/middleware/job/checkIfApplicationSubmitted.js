const Application = require("../../models/applicationModel");

async function checkIfApplicationSubmitted(req, res, next) {
  try {
    const { user } = req.body;
    const { jobId } = req.params;
    const applicationExists = await Application.findOne({
      jobId,
      userId: user?._id,
    });
    if (applicationExists) {
      return res.status(409).json({
        status: "error",
        message: "Job Application already exists",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
  next();
}

module.exports = checkIfApplicationSubmitted;
