"use client";
import {
  goToStep,
  updateContractSteps,
} from "@/redux/contractSteps/contractStepsSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { OFFER_STATUS } from "@/utils/constants";
import React, { useEffect } from "react";

const ContractSteps = () => {
  const dispatch = useAppDispatch();
  const contractSteps = useAppSelector((state) => state.contractSteps.steps);
  const selectedOfferInfo = useAppSelector(
    (state) => state.jobOffer.selectedOfferInfo
  );

  useEffect(() => {
    let currentStep = 1;
    let steps = [
      {
        step: 1,
        title: "Send Offer",
        active: true,
        allowed: true,
      },
      {
        step: 2,
        title: "Create Contract",
        active: false,
        allowed: false,
      },
    ];

    if (selectedOfferInfo?.existingOffer) {
      steps[0].allowed = true;
      //steps[1].allowed = true;
      steps[1].allowed = false;
      currentStep = 1;
    }

    if (
      selectedOfferInfo?.offerStatus === OFFER_STATUS["APPROVED"] &&
      !selectedOfferInfo?.escrowProjectId
    ) {
      steps[0].allowed = true;
      steps[1].allowed = true;
      //steps[2].allowed = true;
      currentStep = 2;
    }

    if (
      selectedOfferInfo?.offerStatus === OFFER_STATUS["APPROVED"] &&
      selectedOfferInfo?.escrowProjectId
    ) {
      steps[0].allowed = true;
      steps[1].allowed = true;
      //steps[2].allowed = true;
      currentStep = 2;
    }

    if (
      selectedOfferInfo?.offerStatus === OFFER_STATUS["OFFERED"] &&
      selectedOfferInfo?.isOfferSent
    ) {
      steps[0].allowed = true;
      steps[1].allowed = false;
      currentStep = 1;
    }

    dispatch(updateContractSteps(steps));
    dispatch(goToStep(currentStep));
  }, []);

  return (
    <div className="row">
      <div className="col-12">
        <div className="multisteps-form__progress mt-3">
          {contractSteps?.map((step) => {
            return (
              <button
                key={step.step}
                onClick={() => {
                  dispatch(goToStep(step.step));
                }}
                className={`multisteps-form__progress-btn fw-bold ${
                  step.active ? "js-active" : ""
                } ${step.step !== 1 && !step.allowed ? "disabledDiv" : ""}`}
                type="button"
              >
                {step?.title}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ContractSteps;
