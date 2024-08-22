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
import moment from "moment";

const MEDIATION_SERVICE_CONTRACT =
  deployment?.MEDIATION_SERVICE_CONTRACT as Address;
const mediationServiceABIAddress = {
  address: MEDIATION_SERVICE_CONTRACT,
  abi: mediationServiceABI,
};

const RequestDefaultDecisionAction = ({
  disputeData,
}: {
  disputeData: DisputeFormatted;
}) => {
  const { address } = useAccount();
  const { isExecuting, executeTransaction } = useWriteWaitContract();

  if (!disputeData) {
    return <></>;
  }

  function showBtn() {
    if(address?.toLowerCase() !== disputeData?.claimant?.toLowerCase() && address?.toLowerCase() !== disputeData?.respondent?.toLowerCase()){
      return false
    }
    if(disputeData?.phaseTxt?.toLowerCase() !== "disclosure") return false;
    if(address?.toLowerCase() == disputeData?.claimant?.toLowerCase() && !disputeData.feePaidClaimant){
      return false
    }
    if(address?.toLowerCase() == disputeData?.respondent?.toLowerCase() && !disputeData.feePaidRespondent){
      return false
    }
    const currentTime = moment().unix();
    const disclosurePeriodElapsed = parseInt(disputeData.disclosureStart) + disputeData.DISCLOSURE_PERIOD;
    if(currentTime < disclosurePeriodElapsed) return false
    return true;
  }

  if (!showBtn()) {
    return null;
  }

  const requestDefaultDecisionHandler = async () => {
    try {
      const args = {
        ...mediationServiceABIAddress,
        fromAddress: address as Address,
        functionName: "requestDefaultDecision",
        args: [disputeData?.disputeId],
        eventNameToSearch: "DefaultDecisionEntered",
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
        btnLabel={"Request Decision"}
        customClasses={"btn-small w-100 mt-2"}
        onClick={requestDefaultDecisionHandler}
        isLoading={isExecuting}
      />
    </>
  );
};

export default RequestDefaultDecisionAction;
