"use client";
import useConfirm from "@/context/ConfirmDialog";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { OFFER_STATUS } from "@/utils/constants";
import React from "react";
import { acceptOfferPayload } from "./jobOfferTypes";
import { useMutation } from "@tanstack/react-query";
import OffersApi from "@/neb-api/OffersApi";
// import {
//   setOfferInfoStatus,
// } from "@/redux/jobOffer/jobOfferSlice";
import { toast } from "react-toastify";
import { setTalentFlowOfferStatus } from "@/redux/talentJobFlowSteps/talentJobFlowStepsSlice";
import useWindowWidth from "@/hooks/useWindowWidth";
import { screenIsMobileSize } from "@/utils/helper";
import { FaCheck } from "react-icons/fa";
import { CgClose } from "react-icons/cg";

const JobOfferActions = () => {
  //const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const offerStatus = useAppSelector(
    (state) => state.talentJobFlowSteps.offerData?.offerStatus,
  );
  const offerId = useAppSelector(
    (state) => state.talentJobFlowSteps.offerData?.offerId,
  );
  const windowWidth = useWindowWidth(9999);

  const { acceptJobOfferTalent } = OffersApi();

  const { mutate: acceptJobOfferAction, isLoading: acceptingJobOffer } =
    useMutation({
      mutationFn: (mutationData: any) => {
        return acceptJobOfferTalent(offerId ?? null, mutationData?.offerStatus);
      },
      onSuccess: (response) => {
        const { data, status } = response;
        let message = "Offer Update Failed";
        let toastType = "error";
        if (status === 200 && data?.result) {
          message = "Offer Updated successfully";
          toastType = "success";
          //queryClient.invalidateQueries({ queryKey: ["jobOffersList"] });
          dispatch(setTalentFlowOfferStatus(data?.result));
        }
        toast(message, {
          type: toastType,
        } as any);
      },
      onError: (error) => {
        toast.error("Something went wrong");
      },
    });

  const acceptOfferHandler = async (data: acceptOfferPayload) => {
    if (data?.offerStatus) {
      const choice = await confirm({
        title: "Are your sure ?",
        description: `The offer will be ${data?.offerStatus}`,
        btnLabel: "Yes",
        btnClass: "theme-btn btn-style-one btn-small",
        btnCloseClass: "btn-style-eight btn-small",
      });
      if (!choice) return;
      acceptJobOfferAction(data);
    }
  };
  return (
    <>
      {offerStatus === OFFER_STATUS["OFFERED"] && (
        <div className="row mb-3">
          <div className="col-6">
            <button
              type="button"
              className={`${screenIsMobileSize(windowWidth) ? "btn-style-success" : "btn-style-three success-variant"} theme-btn btn-small w-100 fw-bold gap-1`}
              onClick={() => {
                acceptOfferHandler({ offerStatus: OFFER_STATUS["APPROVED"] });
              }}
            >
              <FaCheck />
              Accept Offer
            </button>
          </div>
          <div className="col-6">
            <button
              className={`${screenIsMobileSize(windowWidth) ? "btn-style-danger" : "btn-style-three danger-variant"} theme-btn btn-small w-100 fw-bold gap-1`}
              onClick={() => {
                acceptOfferHandler({ offerStatus: OFFER_STATUS["REJECTED"] });
              }}
            >
              <CgClose className="fs-5" />
              Reject Offer
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default JobOfferActions;
