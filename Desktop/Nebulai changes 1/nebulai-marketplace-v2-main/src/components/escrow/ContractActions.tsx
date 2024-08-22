"use client";
import React from "react";
import ActivateContract from "@/components/escrow/actions/ActivateContract";
import CompleteContract from "@/components/escrow/actions/CompleteContract";
import CancelContract from "@/components/escrow/actions/CancelContract";
import ApproveContract from "@/components/escrow/actions/ApproveContract";
import ClaimPayment from "@/components/escrow/actions/ClaimPayment";
import EscrowDiscontinueAction from "./EscrowDiscontinueAction";
import EscrowChallengeActionBtn from "./actions/EscrowChallengeActionBtn";
import { useAppSelector } from "@/redux/store";

const ContractActions = () => {
  const projectId = useAppSelector(
    (state) => state.contractInfo.contractDetails?.projectId
  );
  return (
    <>
      {projectId && (
        <div className="col-12 col-md-12">
          <ActivateContract />
          <CancelContract />
          <ApproveContract />
          <CompleteContract />
          <ClaimPayment />
          <EscrowDiscontinueAction />
          <EscrowChallengeActionBtn />
        </div>
      )}
    </>
  );
};

export default ContractActions;
