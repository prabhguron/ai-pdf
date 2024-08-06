"use client";
import React from "react";
import OfferMetadataView from "@/components/talent/offers/OfferMetadataView";
import { useAppSelector } from "@/redux/store";
import JobOfferActions from "../offers/JobOfferActions";
import { OFFER_STATUS } from "@/utils/constants";
import AcceptedOfferInfo from "../offers/AcceptedOfferInfo";
import { FaCheckCircle, FaTimes } from "react-icons/fa";

const TalentReviewOffer = () => {
  const { user } = useAppSelector((state) => state.auth);
  const role = user?.role || "";
  const offerMetadata = useAppSelector(
    (state) => state.talentJobFlowSteps.offerData
  );
  const escrowProjectId = useAppSelector(
    (state) => state.talentJobFlowSteps.txData?.escrowProjectId
  );
  const offerStatus = useAppSelector(
    (state) => state.talentJobFlowSteps.offerData?.offerStatus
  );
  return (
    <>
      {offerStatus === OFFER_STATUS["REJECTED"] && (
        <div className="row">
          <div className="col-12 mb-4">
            <div className="pull-right cursor-pointer fw-bold">
              <span
                className={`bg-danger text-white px-2 py-1 rounded fw-bold mb-2`}
              >
                <FaTimes /> OFFER {offerStatus?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      )}
      {offerStatus === OFFER_STATUS["APPROVED"] &&
        escrowProjectId &&
        role === "talent" && (
          <div className="row">
          <div className="col-12 mb-4">
            <div className="pull-right cursor-pointer fw-bold">
              <span
                className={`bg-success text-white px-2 py-1 rounded fw-bold mb-2`}
              >
                <FaCheckCircle /> OFFER ACCEPTED
              </span>
            </div>
          </div>
        </div>
      )}

      {offerStatus === OFFER_STATUS["APPROVED"] &&
        !escrowProjectId &&
        role === "talent" && (
          <div className="row">
            <div className="col-12">
              <AcceptedOfferInfo />
            </div>
          </div>
        )}
      <OfferMetadataView offerMetadata={offerMetadata} />
      <JobOfferActions />
    </>
  );
};

export default TalentReviewOffer;
