"use client";
import mediationServiceABI from "@/abi/MediationService.json";
import useWriteWaitContract from "@/hooks/useWriteWaitContract";
import React from "react";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";
import deployment from "@/abi/deployment.json";
import { Address } from "viem";
import { DisputeFormatted } from "@/hooks/useMediationService";
import CommonButton from "@/components/common/CommonButton";

const MEDIATION_SERVICE_CONTRACT =
  deployment?.MEDIATION_SERVICE_CONTRACT as Address;
const mediationServiceABIAddress = {
  address: MEDIATION_SERVICE_CONTRACT,
  abi: mediationServiceABI,
};

const ReclaimMediationFeeAction = ({
  disputeData,
}: {
  disputeData: DisputeFormatted;
}) => {
  const { address } = useAccount();
  const { isExecuting, executeTransaction } = useWriteWaitContract();

  if (!disputeData) {
    return <></>;
  }
  

  const msgSender = address?.toLowerCase();
  const phaseTxt = disputeData?.phaseTxt?.toLowerCase();
  function showBtn() {
    if (
      msgSender !== disputeData?.claimant?.toLowerCase() &&
      msgSender !== disputeData?.respondent?.toLowerCase()
    ) {
      return false;
    }
    if (phaseTxt === "decision") {
      if (
        disputeData.granted &&
        msgSender !== disputeData.claimant?.toLowerCase()
      ) {
        return false;
      } else if (
        !disputeData.granted &&
        msgSender !== disputeData.respondent?.toLowerCase()
      ) {
        return false;
      }
    } else if (disputeData?.phaseTxt === "SettledExternally") {
      if (
        !disputeData.feePaidClaimant &&
        msgSender === disputeData.claimant?.toLowerCase()
      ) {
        return false;
      } else if (
        !disputeData.feePaidRespondent &&
        msgSender === disputeData.respondent?.toLowerCase()
      ) {
        return false;
      }
    } else {
      return false;
    }
    if(disputeData?.feesHeld === 0){
      return false;
    }
    return true;
  }

  if (!showBtn()) {
    return null;
  }

  const reclaimMediationFeeHandler = async () => {
    try {
      const args = {
        ...mediationServiceABIAddress,
        fromAddress: address as Address,
        functionName: "reclaimMediationFee",
        args: [disputeData?.disputeId],
        eventNameToSearch: "MediationFeeReclaimed",
      };

      const result = await executeTransaction(args);
      if (result?.status === "success") {
        toast.success(`TX: ${result?.txHash}`);
      } else {
        const errorMessage = result?.revertErrorName
          ? `Tx Failed With: ${result?.revertErrorName}`
          : result?.errorMsg;
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.log(error?.message);
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <CommonButton
        loadingText={"Please wait..."}
        btnLabel={`Reclaim Mediation Fees (${disputeData.mediationFee})`}
        customClasses={"btn-small w-100 mt-2"}
        onClick={reclaimMediationFeeHandler}
        isLoading={isExecuting}
      />
    </>
  );
};

export default ReclaimMediationFeeAction;
