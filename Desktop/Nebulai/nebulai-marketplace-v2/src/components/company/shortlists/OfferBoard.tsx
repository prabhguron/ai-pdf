"use client";
import React from "react";
import OfferCardHeader from "./OfferCardHeader";
import { useAppSelector } from "@/redux/store";
import LoaderCommon from "@/components/LoaderCommon";
import OfferCardBody from "./OfferCardBody";

const OfferBoard = () => {
  const selectedOfferInfo = useAppSelector(
    (state) => state.jobOffer.selectedOfferInfo
  );
  const offerInfoLoading = useAppSelector(
    (state) => state.jobOffer.selectedOfferInfoLoading
  );

  if (offerInfoLoading) {
    return <LoaderCommon />;
  }

  return (
    <>
      {selectedOfferInfo ? (
        <>
          <OfferCardHeader />
          <OfferCardBody />
        </>
      ) : (
        <div className="loading-container fw-bolder">
          No Applicant Selected 📃
        </div>
      )}
    </>
  );
};

export default OfferBoard;
