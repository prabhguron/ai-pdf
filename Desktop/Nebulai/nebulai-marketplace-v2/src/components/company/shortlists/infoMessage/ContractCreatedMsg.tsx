"use client"
import { setContractID, setContractModalOpen, setOfferID } from "@/redux/contractInfo/contractInfoSlice";
import { setOfferModalOpen } from "@/redux/contractSteps/contractStepsSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import Link from "next/link";
import React from "react";

const ContractCreatedMsg = ({role, escrowId}:{role: Role, escrowId: string}) => {
  const dispatch = useAppDispatch();
  const offerId = useAppSelector(state => state.jobOffer.selectedOfferInfo?.offerId);

  const viewContractModal = () => {
    dispatch(setOfferModalOpen(false));
    dispatch(setContractID(escrowId));
    dispatch(setOfferID(offerId));
    dispatch(setContractModalOpen(true));
  }

  return (
    <span className="my-3 h5">
      <em>
        Contract Hash Been Initiated,  
        <Link href="#" onClick={viewContractModal}>
          <strong>View Contract</strong>
        </Link>
      </em>
    </span>
  );
};

export default ContractCreatedMsg;
