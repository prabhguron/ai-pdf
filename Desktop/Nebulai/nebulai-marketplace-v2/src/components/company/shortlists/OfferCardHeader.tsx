"use client";
import { useAppSelector } from "@/redux/store";
import Image from "next/image";
import React from "react";

const OfferCardHeader = () => {
  const selectedOfferInfo = useAppSelector(
    (state) => state.jobOffer.selectedOfferInfo
  );
  const selectedApplicantInfo = useAppSelector(
    (state) => state.jobOffer.selectedApplicantInfo
  );
  if (!selectedOfferInfo || !selectedApplicantInfo) return;
  return (
  <>
    <div className="offerHeader card-header msg_head d-flex justify-content-evenly">
      {/* Company / Job Info */}
      <div className="d-flex bd-highlight">
        <div className="img_cont">
          {selectedOfferInfo?.companyProfileImg && (
            <Image
              src={selectedOfferInfo?.companyProfileImg ?? ""}
              alt=""
              className="rounded-circle user_img"
              loading="lazy"
              width={50}
              height={50}
            />
          )}
        </div>
        <div className="user_info">
          <span className="fw-bolder">
            {selectedOfferInfo?.mainJobTitle} (
            {selectedOfferInfo?.jobIdentifier})
          </span>
          <p>{selectedOfferInfo?.companyName}</p>
        </div>
      </div>

      {/* Talent Info */}
      <div className="d-flex bd-highlight">
        <div className="img_cont">
          {selectedApplicantInfo?.talentProfileImg && (
            <Image
              src={selectedApplicantInfo?.talentProfileImg ?? ""}
              alt=""
              className="rounded-circle user_img"
              loading="lazy"
              width={50}
              height={50}
            />
          )}
        </div>
        <div className="user_info">
          <span className="fw-bolder">
            {selectedApplicantInfo?.talentFullName}
          </span>
          <p>{selectedApplicantInfo?.talentJobTitle}</p>
        </div>
      </div>

      {/* <button
            type="button"
            className="btn-close pull-right"
            aria-label="Close"
            onClick={() => {
              dispatch(setOfferModalOpen(false))
            }}
          ></button> */}
     
    </div>
    <div className="btn-box d-flex justify-content-end mt-1">
     <a
       className={"theme-btn btn-style-one btn-xs"}
       href={selectedOfferInfo?.telegramUri}
       target="_blank"
       rel="noreferrer"
     >
       <span style={{ marginRight: "5px" }}>Chat Now</span>
       <span className="la la-telegram"></span>
     </a>
   </div>
  </>
 
  );
};

export default OfferCardHeader;
