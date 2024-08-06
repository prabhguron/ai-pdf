"use client";
import useConfirm from "@/context/ConfirmDialog";
import useApplicationOffer from "@/hooks/useApplicationOffer";
import { goToStep } from "@/redux/contractSteps/contractStepsSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import React, { useState } from "react";
import { toast } from "react-toastify";
import OfferReadyToSend from "./infoMessage/OfferReadyToSend";
import { OFFER_STATUS } from "@/utils/constants";
import SuccessTick from "@/components/common/SuccessTick";
import { FaScroll, FaUserCheck } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa6";

const SendOffer = () => {
  const confirm = useConfirm();
  const dispatch = useAppDispatch();
  const applicationId = useAppSelector(
    (state) => state.jobOffer.selectedOfferInfo?.applicationId,
  );
  const isOfferSent = useAppSelector(
    (state) => state.jobOffer.selectedOfferInfo?.isOfferSent,
  );
  const existingOffer = useAppSelector(
    (state) => state.jobOffer.selectedOfferInfo?.existingOffer,
  );
  const offerStatus = useAppSelector(
    (state) => state.jobOffer.selectedOfferInfo?.offerStatus,
  );
  const escrowProjectId = useAppSelector(
    (state) => state.jobOffer.selectedOfferInfo?.escrowProjectId,
  );

  const [isSendingOffer, setIsSendingOffer] = useState(false);
  const { sendJobOfferAction } = useApplicationOffer();

  const sendJobOfferHandler = async () => {
    if (!applicationId) return;
    const choice = await confirm({
      title: "Send job offer ?",
      description: `Are you sure you want send the job offer?`,
      btnLabel: "Yes",
      btnClass: "theme-btn btn-style-one btn-small",
      btnCloseClass: "btn-style-eight btn-small",
    });
    if (!choice) return;
    setIsSendingOffer(true);
    try {
      const sent = await sendJobOfferAction(applicationId);
      if (sent) {
        setIsSendingOffer(false);
        toast.success("Job offer sent successfully");
        return;
      }
    } catch (error) {}
    setIsSendingOffer(false);
    toast.error("Something went wrong");
  };

  return (
    <div className="p-2rem">
      <div className="row">
        <div className="col-12">
          {existingOffer && !isOfferSent && <OfferReadyToSend />}

          {offerStatus === OFFER_STATUS["APPROVED"] && escrowProjectId && (
            <div className="loading-container" style={{ height: "25vh" }}>
              <FaScroll
                size={100}
                style={{
                  color: "#51a23b",
                }}
              />
              <span className="my-3 h5">
                <em>Offer Has Been Approved & Contract Has Been Initiated</em>
              </span>
            </div>
          )}

          {offerStatus === OFFER_STATUS["APPROVED"] && !escrowProjectId && (
            <div className="loading-container" style={{ height: "25vh" }}>
              <FaUserCheck
                size={100}
                style={{
                  color: "#51a23b",
                }}
              />
              <span className="my-3 h5">
                <em>
                  Offer Has Been Approved By Talent, Please
                  <strong> Go To Next Step</strong> To Initiate The Job
                </em>
              </span>
            </div>
          )}

          {offerStatus === OFFER_STATUS["OFFERED"] && isOfferSent && (
            <div className="loading-container" style={{ height: "25vh" }}>
              <SuccessTick />
              <span className="my-3 h5">
                <em>Offer Has Been Sent, Waiting For Approval From Talent</em>
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <button
            type="button"
            className="them-btn btn-style-three btn-small w-100"
            onClick={() => {
              dispatch(goToStep(1));
            }}
          >
            Previous
          </button>
        </div>
        <div className="col-6">
          {!isOfferSent && existingOffer ? (
            <button
              type="button"
              className="theme-btn btn-style-one btn-small w-100"
              disabled={isSendingOffer}
              onClick={sendJobOfferHandler}
            >
              {isSendingOffer ? (
                <>
                  Please Wait...{" "}
                  <span
                    className="spinner-border spinner-border-sm pl-4"
                    role="status"
                    aria-hidden="true"
                  ></span>
                </>
              ) : (
                "SEND OFFER"
              )}
            </button>
          ) : (
            <button
              className={`theme-btn btn-style-three btn-small w-100 gap-1 ${offerStatus !== OFFER_STATUS["APPROVED"] && "disabled-btn"}`}
              type="button"
              onClick={() => {
                dispatch(goToStep(3));
              }}
            >
              Next
              <FaChevronRight />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SendOffer;
