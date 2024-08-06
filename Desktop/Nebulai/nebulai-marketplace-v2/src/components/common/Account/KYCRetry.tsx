import KYCForm from "@/components/KYC/KYCForm";
import { useAppSelector } from "@/redux/store";
import React from "react";

const KYCRetry = () => {
  const retryKYCInfo = useAppSelector(
    (state) => state.getStartedSteps.profileStat?.retryKYCInfo
  );
  return (
    <div>
      <div className="fw-bold fs-3 my-4">Reattempt KYC 📄</div>
      <div className="border-top mt-1 mb-4"></div>
      <div className="alert alert-warning mb-4" role="alert">
        <h6 className="fw-bolder">
          The documents you provided for KYC verification may have issues such
          as being expired, unclear, or not meeting our requirements. Please
          resubmit the documents, ensuring they are clear, valid, and belong to
          you.
        </h6>
        <div className="border-top my-2"></div>
        {retryKYCInfo?.comment && (
          <>
            Comments
            <h6 className="fw-bolder">{retryKYCInfo?.comment}</h6>
          </>
        )}
      </div>
      <KYCForm
        path="retry"
        initValues={{
          country: retryKYCInfo?.country ?? "USA",
          idDocType: retryKYCInfo?.idDocType ?? "PASSPORT",
          idDoc: [],
        }}
      />
    </div>
  );
};

export default KYCRetry;
