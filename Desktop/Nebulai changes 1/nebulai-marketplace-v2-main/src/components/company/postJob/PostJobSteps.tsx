"use client";

import { useAppSelector } from "@/redux/store";

const PostJobSteps = () => {
  const userKycCompleted =
    useAppSelector(
      (state) => state.getStartedSteps?.profileStat?.userKycCompleted
    ) ?? false;
  return (
    <>
      {!userKycCompleted && (
        <div className="alert alert-warning mb-4" role="alert">
          <h6 className="fw-bolder">
          Your KYC verification is in progress and may take up to 48 hours. During this time, you will not be able to post jobs. You will be notified via email once your KYC verification is complete.
          </h6>
        </div>
      )}

      <div className="post-job-steps">
        <div className="step">
          <span className="icon flaticon-briefcase"></span>
          <h5>Job Details</h5>
        </div>

        <div className="step">
          <span className="icon flaticon-money"></span>
          <h5>Shortlist Talent & Send Offer</h5>
        </div>

        <div className="step">
          <span className="icon flaticon-checked"></span>
          <h5>Confirmation</h5>
        </div>
      </div>
    </>
  );
};

export default PostJobSteps;
