"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import OffersApi from "@/neb-api/OffersApi";
import mediationServiceABI from "@/abi/MediationService.json";
import useWriteWaitContract from "@/hooks/useWriteWaitContract";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";
import { ChangeOrderFormInit } from "../ChangeOrderModal";
import deployment from "@/abi/deployment.json";
import { Address } from "viem";
import { DisputeFormatted } from "@/hooks/useMediationService";
import { ethers } from "ethers";
import { FormikHelpers } from "formik";
import { useAppSelector } from "@/redux/store";
import ChangeOrderModalNew from "@/components/escrow/changeOrders/ChangeOrderModalNew";

const MEDIATION_SERVICE_CONTRACT = deployment?.MEDIATION_SERVICE_CONTRACT as Address;
const mediationServiceABIAddress = {
  address: MEDIATION_SERVICE_CONTRACT,
  abi: mediationServiceABI,
};

interface EvidencePayload {
  evidenceDesc: string;
}

const PayMediationFeesAction = ({ disputeData }:{
  disputeData: DisputeFormatted
}) => {
  const queryClient = useQueryClient();
  const offerId = useAppSelector(state => state.contractInfo.offerId);
  const [isOpenMediationFeesModal, setIsOpenMediationFeesModal] = useState(false);
  const modalId = "evidenceModal";
  const { prepareEvidence } = OffersApi();
  const { address, isConnected } = useAccount();
  const { isExecuting, executeTransaction } = useWriteWaitContract();
  const { mutate, isLoading } = useMutation({
    mutationFn: (mutationData:EvidencePayload) => {
      return prepareEvidence(offerId, mutationData);
    },
    onSuccess: async (response) => {
        const { status, data } = response;
        if (status === 200) {
          try {
            const {evidenceMetaHash} = data
            const challengeProjectArgs = {
              ...mediationServiceABIAddress,
              fromAddress: address as Address,
              functionName: "payMediationFee",
              args: [
                disputeData?.disputeId,
                [evidenceMetaHash]
              ],
              value: ethers.BigNumber.from(disputeData?.mediationFeeRaw),
              eventNameToSearch: "MediationFeePaid",
            };

            const result = await executeTransaction(challengeProjectArgs);
            if (result?.status === "success") {
              toast.success(`TX: ${result?.txHash}`);
              if(disputeData?.disputeId){
                queryClient.invalidateQueries(["disputeData", disputeData?.disputeId?.toString()]);
              }
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
        }
    },
    onError: (error) => {
      toast.error("Something went wrong");
    },
  });

  if(!disputeData){
    return <></>
  }


  function showBtn() {
    if (
      disputeData?.claimant?.toLowerCase() === address?.toLowerCase() && !disputeData?.feePaidClaimant
    ) {
      return true;
    }else if(disputeData?.respondent?.toLowerCase() === address?.toLowerCase() && !disputeData?.feePaidRespondent){
      return true;
    }
    return false;
  }

  if(!showBtn()) {
    return null
  }

  const prepareEvidenceURIHandler = async (payload: EvidencePayload) => {
    try {
      mutate(
        payload
      );
    } catch (error: any) {
      console.log(error?.message);
    }
  };

  const evidenceSubmitHandler = async (values: ChangeOrderFormInit, {resetForm}: FormikHelpers<ChangeOrderFormInit>) => {
    if(!values?.changeOrderDesc) {
      toast.error("Please provide evidence description");
      return;
    };
    if (!isConnected) {
      toast.info("Please connect your wallet");
      return;
    }
    resetForm();
    setIsOpenMediationFeesModal(false);

    prepareEvidenceURIHandler({
      evidenceDesc: values?.changeOrderDesc
    });
  };

  return (
    <>
      <ChangeOrderModalNew
        isOpen={isOpenMediationFeesModal}
        onClose={() => {
          setIsOpenMediationFeesModal(false)
        }}
        modalTitle={"Evidence Description"}
        onSubmitHandler={evidenceSubmitHandler}
        modalId={modalId}
        formInitPayload={{
            changeOrderDesc: "",
            adjustedProjectFee: 0,
            talentStakeForfeit: 0
        }}
        validateFields={['changeOrderDesc']}
      />
      <button
        type="button"
        className={`theme-btn btn-style-one btn-small fw-bold w-100 mt-2`}
        onClick={() => {
          setIsOpenMediationFeesModal(true)
        }}
        disabled={isExecuting || isLoading}
      >
        {isExecuting || isLoading ? (
          <>
            Please Wait...{" "}
            <span
              className="spinner-border spinner-border-sm pl-4"
              role="status"
              aria-hidden="true"
            ></span>
          </>
        ) : (
          "Pay Mediation Fees"
        )}
      </button>
    </>
  );
};

export default PayMediationFeesAction;
