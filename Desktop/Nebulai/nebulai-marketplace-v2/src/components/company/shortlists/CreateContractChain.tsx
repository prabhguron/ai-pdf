"use client";
import OfferDetails from "@/components/talent/offers/OfferDetails";
import { goToStep } from "@/redux/contractSteps/contractStepsSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import React from "react";
import ContractCreatedMsg from "./infoMessage/ContractCreatedMsg";
import { FaChevronLeft } from "react-icons/fa6";

const CreateContractChain = () => {
    const dispatch = useAppDispatch();
  const offerId = useAppSelector(
    (state) => state.jobOffer.selectedOfferInfo?.offerId
  );
  const escrowProjectId = useAppSelector(
    (state) => state.jobOffer.selectedOfferInfo?.escrowProjectId
  );
  return (
    <>
      <OfferDetails fetchForOfferId={offerId ?? null} displayOfferMetadata={false}/>
      {escrowProjectId && (
        <ContractCreatedMsg role="company" escrowId={escrowProjectId}/>
      )}
      <button
        className="theme-btn btn-style-three btn-small w-100 mt-3 gap-1"
        onClick={() => {
          dispatch(goToStep(1));
        }}
      >
        <FaChevronLeft />
        Previous
      </button>
    </>
  );
};

export default CreateContractChain;
