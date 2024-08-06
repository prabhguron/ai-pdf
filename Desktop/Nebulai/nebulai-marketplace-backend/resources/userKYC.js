const MailService = require("../integrations/Mailer/MailService");
const SumSubAPI = require("../integrations/SumSub/SumSubVerification");
const UserKYC = require("../models/userKYCModel");

const submitUserKYC = async (userId, data) => {
  // NEW KYC PROCESS
  const result = {
    applicantId: null,
    reviewStatus: null,
    error: null
  }
  try {
    const sumsub = new SumSubAPI();
    const parsedResp = await sumsub.createApplicantPub(userId);
    if (parsedResp?.id && parsedResp?.review?.reviewStatus) {
      result.applicantId = parsedResp?.id ?? null;
      result.reviewStatus = parsedResp?.review?.reviewStatus ?? null;
      const newApplicant = await UserKYC.create({
        userId,
        applicantId: result.applicantId,
        reviewStatus: result.reviewStatus,
      });
      if (newApplicant?._id) {
        let docErrors = [];
        const docRes = await sumsub.addDocumentPub(
          result.applicantId,
          data?.metadata,
          data?.idDoc
        );
        docErrors = docRes.errors ?? [];
        await sumsub.updateApplicantStatusToPending(result.applicantId);
        await UserKYC.updateOne(
          {
            _id: newApplicant?._id,
          },
          { docs: docRes, reviewStatus: 'pending', reviewResult: 'PENDING' }
        );
      }
    }else if(parsedResp?.code === 409){
        result.error = "Applicant KYC already exists"
    }
  } catch (error) {
    console.log(error);
  }
  return result
};

const checkIfKYCRetry = async (userKycResultResponse) => {
  const result = {
    retry: false,
    retryInfo: null
  }
  const applicantId = userKycResultResponse?.applicantId;
  const reviewAnswer = userKycResultResponse?.reviewResult?.reviewAnswer ?? "RED";
  const reviewRejectType = userKycResultResponse?.reviewResult?.reviewRejectType ?? "FINAL";
  if (reviewAnswer === "RED" && reviewRejectType === "RETRY") {
    const sumsub = new SumSubAPI();
    const resp = await sumsub.getRequiredIdDocsStatus(applicantId);
    const data = resp['IDENTITY'] ?? null;
    if(data && data?.reviewResult?.moderationComment){
      result.retry = true;
      result.retryInfo = {
        comment: data?.reviewResult?.moderationComment,
        country: data?.country,
        idDocType: data?.idDocType
      }
    }
  }
  return result
}

const sendKYCVerifiedEmail = async (to, data) =>{
  return MailService.sendEmail({
    to,
    templateId: process.env.KYC_VERIFIED_EMAIL_TEMPLATE_ID,
    dynamicTemplateData: data,
    hideWarnings: true,
  });
}

const resubmitDocs = async(applicantId, docSubmitData) => {
  // RETRY DOC SUBMISSION
  let submitted = false;
  try {
    const sumsub = new SumSubAPI();
    let docErrors = [];
    const docRes = await sumsub.addDocumentPub(
      applicantId,
      docSubmitData?.metadata,
      docSubmitData?.idDoc
    );
    docErrors = docRes.errors ?? [];
    await sumsub.updateApplicantStatusToPending(applicantId, "Resubmit Docs");
    await UserKYC.updateOne(
      {
        applicantId,
      },
      { docs: docRes, reviewStatus: 'pending', reviewResult: 'PENDING', resultResponse: null }
    );
    submitted  = true;
  } catch (error) {
    console.log(error?.message);
  }
  return submitted
}

module.exports = {
  submitUserKYC,
  sendKYCVerifiedEmail,
  checkIfKYCRetry,
  resubmitDocs
};