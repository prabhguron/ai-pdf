const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const UserKYC = require("../models/userKYCModel");
const User = require("../models/userModel");
const SumSubAPI = require("../integrations/SumSub/SumSubVerification");
const { submitUserKYC, sendKYCVerifiedEmail, resubmitDocs } = require("../resources/userKYC");
const { ON_BOARDING, KYC_RETRY_DOCS } = require("../utils/constants");
const { markUserOnboardingComplete, getUserRoleText } = require("../resources/users");
const moment = require("moment");

exports.submitKYC = catchAsync(async (req, res, next) => {
  try {
    let httpCode = 500;
    const kycResponse = {
      status: "error",
      message: "Failed to start KYC process",
    };
    const { user, idDoc, idDocType, country } = req.body;
    const { path } = req.query;
    const userId = user.id;

    const userKycRecord = await UserKYC.findOne({ 
      userId
    }).select(["applicantId", "reviewStatus", "reviewResult"]);
    if(userKycRecord && userKycRecord?.reviewResult === 'PENDING'){
      return next(new AppError("KYC already submitted", 409, "error"));
    }
    const userExistingApplicantId = userKycRecord?.applicantId ?? null;

    const metadata = {
      idDocType,
      country,
    };
    const docSubmitData = {
      idDoc,
      metadata,
    }

    if(userExistingApplicantId && path === KYC_RETRY_DOCS){
      // Submit only docs | RETRY FLOW
      if(await resubmitDocs(userExistingApplicantId, docSubmitData)){
        httpCode = 200;
        kycResponse.status = "success";
        kycResponse.message = "Successfully submitted your KYC docs";
      }
    }else{
      // NEW KYC PROCESS
      const { applicantId, reviewStatus, error } = await submitUserKYC(userId, docSubmitData);
      if (applicantId && reviewStatus) {
        httpCode = 201;
        kycResponse.status = "success";
        kycResponse.message = "Successfully started KYC process";
        if(path === ON_BOARDING){
          await markUserOnboardingComplete(user)
        } 
      }else if(error){
        kycResponse.message = error
      }
    }
    return res.status(httpCode).json(kycResponse);
  } catch (error) {
    console.log(error?.message);
  }
  return next(new AppError("Something went wrong", 500, "error"));
});


exports.createApplicant = catchAsync(async (req, res, next) => {
  try {
    const { user } = req.body;
    const userId = user.id;
    const sumsub = new SumSubAPI();
    const resp = await sumsub.createApplicantPub(userId);
    let parsedResp = resp;
    let response = null;
    if (parsedResp.id && parsedResp.review.reviewStatus) {
      const newApplicant = await UserKYC.create({
        userId,
        applicantId: parsedResp.id,
        reviewStatus: parsedResp.review.reviewStatus,
      });
      response = newApplicant;
    } else {
      response = parsedResp;
    }

    return res.status(201).json({ status: 'success', message: response });
  } catch (error) {
    console.log(error.message);
  }
  return next(new AppError('Something went wrong', 500, 'error'));
});

exports.addDocument = catchAsync(async (req, res, next) => {
  try {
    const { user, idDoc, idDocType, country } = req.body;
    const userId = user.id;
    const applicantInfo = await UserKYC.findOne({ userId });
    const applicantId = applicantInfo?.applicantId;
    const metadata = {
      idDocType,
      country,
    };
    const sumsub = new SumSubAPI();
    const resp = await sumsub.addDocumentPub(applicantId, metadata, idDoc);
    let parsedResp = resp;

    return res.status(200).json({ status: 'success', message: parsedResp });
  } catch (error) {
    console.log(error.message);
  }
  return next(new AppError('Something went wrong', 500, 'error'));
});


exports.getApplicantStatus = catchAsync(async (req, res, next) => {
  try {
    const { user } = req.body;
    const userId = user.id;
    const applicantInfo = await UserKYC.findOne({ userId });
    const applicantId = applicantInfo?.applicantId;

    const sumsub = new SumSubAPI();
    const resp = await sumsub.getApplicantStatus(applicantId);
    let parsedResp = resp;
    await UserKYC.findOneAndUpdate(
      { applicantId },
      { reviewStatus: parsedResp.reviewStatus },
      { new: true }
    );
    if (
      parsedResp.reviewResult.reviewAnswer === 'GREEN' &&
      parsedResp.reviewStatus === 'completed'
    ) {
      const applicantStatusUpdate = await UserKYC.findOneAndUpdate(
        { applicantId },
        { reviewStatus: parsedResp.reviewStatus, isVerified: true },
        { new: true }
      );
      if (applicantStatusUpdate?.isVerified) {
        await User.findOneAndUpdate(
          { userId },
          { isVerified: true },
          { new: true }
        );
      }
    }
    const isUserVerified = await User.findById(userId);

    return res.status(200).json({
      status: 'success',
      data: { isVerified: isUserVerified?.isVerified },
    });
  } catch (error) {
    console.log(error.message);
  }
  return next(new AppError('Something went wrong', 500, 'error'));
});


exports.createAccessToken = catchAsync(async (req, res, next) => {
  try {
    const { user } = req.body;
    const userId = user.id;

    const sumsub = new SumSubAPI();
    const resp = await sumsub.createAccessToken(userId);
    let parsedResp = resp;

    return res.status(200).json({ status: 'success', message: parsedResp });
  } catch (error) {
    console.log(error.message);
  }
  return next(new AppError('Something went wrong', 500, 'error'));
});


exports.handleKYC = catchAsync(async (req, res, next) => {
  try {
    const reqBody = req.body;
    if (!reqBody?.applicantId) {
      return next(new AppError('ApplicantId not found', 400, 'error'));
    }

    const applicantId = reqBody?.applicantId;
    const applicantInfo = await UserKYC.findOne({ applicantId }).populate('userId', ['firstName','companyName','role','email'])
    if (!applicantInfo) {
      return next(new AppError('Applicant Info Not Found', 400, 'error'));
    }
    const userRole = applicantInfo?.userId?.role;
    const role = getUserRoleText(userRole);
    const name = role === 'talent' ? applicantInfo?.userId?.firstName : applicantInfo?.userId?.companyName;
    const userEmail = applicantInfo?.userId?.email;
    const userId = applicantInfo.userId;
    const reviewStatus = reqBody?.reviewStatus ?? 'init';
    const reviewAnswer = reqBody?.reviewResult?.reviewAnswer ?? 'RED';
    const isVerified = reviewAnswer === 'GREEN';

    await UserKYC.updateOne(
      {
        applicantId,
        userId,
      },
      {
        isVerified,
        reviewStatus,
        reviewResult:reviewAnswer,
        resultResponse: reqBody,
      }
    );

    console.log(`Handle KYC ${applicantId} reviewAnswer ${reviewAnswer}`); 
    if (isVerified) {
      await User.updateOne(
        {
          _id: userId,
        },
        {
          isVerified,
        }
      );
      //send email kyc verified email
      const sent = await sendKYCVerifiedEmail(userEmail, {
        name,
        date: moment().format("MMM Do YY")
      });
      if (!sent) {
        throw new Error("Failed to send user kyc verified email");
      }
    }

    return res.status(200).json({ status: 'success' });
  } catch (error) {
    console.log(error.message);
  }
  return next(new AppError('Something went wrong', 500, 'error'));
});
