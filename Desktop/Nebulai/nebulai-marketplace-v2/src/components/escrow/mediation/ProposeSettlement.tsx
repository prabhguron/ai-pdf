"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import OffersApi from "@/neb-api/OffersApi";
import marketPlaceABI from "@/abi/Marketplace.json";
import useWriteWaitContract from "@/hooks/useWriteWaitContract";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";
import { ChangeOrderFormInit } from "../ChangeOrderModal";
import { ethers } from "ethers";
import { ESCROW_STATUS } from "@/utils/constants";
import {Address} from "viem";
import deployment from '@/abi/deployment.json';
import { useAppSelector } from "@/redux/store";
import { FormikHelpers } from "formik";
import { DisputeFormatted } from "@/hooks/useMediationService";
import ChangeOrderModalNew from "@/components/escrow/changeOrders/ChangeOrderModalNew";
const MARKETPLACE_CONTRACT = deployment?.MARKETPLACE_CONTRACT as Address;
const marketPlaceAddressABI = {
  address: MARKETPLACE_CONTRACT,
  abi: marketPlaceABI,
};

const ProposeSettlement = ({
  disputeData,
}: {
  disputeData: DisputeFormatted;
}) => {
  const queryClient = useQueryClient();
  const escrowData = useAppSelector(state => state.contractInfo.contractDetails);
  const offerId = useAppSelector(state => state.contractInfo.offerId);
  
  const [isOpenProposalModal, setIsOpenProposalModal] = useState(false);
  const modalId = "proposeSettlementModal";
  const { prepareChangeOrder } = OffersApi();
  const { address, isConnected } = useAccount();
  const { isExecuting, executeTransaction } = useWriteWaitContract();
  const projectId = escrowData?.projectId;
  const projectStatus = escrowData?.status;
  const status = (typeof projectStatus !== 'undefined') ? ESCROW_STATUS[projectStatus].toLowerCase() : '';

  const { mutate, isLoading } = useMutation({
    mutationFn: (mutationData: ChangeOrderFormInit) => {
      return prepareChangeOrder(offerId, mutationData);
    },
    onSuccess: async (response, variables) => {
        const { status, data } = response;
        if (status === 200) {
          try {
            const {changeOrderMetaHash} = data
            const challengeProjectArgs = {
              ...marketPlaceAddressABI,
              fromAddress: address as Address,
              functionName: "proposeSettlement",
              args: [
                projectId,
                ethers.utils.parseEther(variables?.adjustedProjectFee?.toString()).toString(),
                ethers.utils.parseEther(variables?.talentStakeForfeit?.toString()).toString(),
                changeOrderMetaHash
              ],
              value: 0,
              eventNameToSearch: "SettlementProposed",
            };

            const { status, txHash, errorMsg, revertErrorName } =
              await executeTransaction(challengeProjectArgs);
            if (status === "success") {
              if(disputeData?.disputeId){
                queryClient.invalidateQueries(["disputeData", disputeData?.disputeId?.toString()]);
              }
              toast.success(`TX: ${txHash}`);
            } else {
              const errorMessage = revertErrorName
                ? `Tx Failed With: ${revertErrorName}`
                : errorMsg;
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

  function showBtn() {
    if (!['disputed'].includes(status)) {
      return false;
    }

    if(disputeData?.phaseTxt?.toLowerCase() !== "disclosure") return false;

    return true;
  }

  if(!showBtn()) {
    return <></>
  }

  const prepareChangeOrderHandler = async (payload: ChangeOrderFormInit) => {
    try {
      mutate(
        payload
      );
    } catch (error: any) {
      console.log(error?.message);
    }
  };

  const challengeHandler = async (values: ChangeOrderFormInit, {resetForm}: FormikHelpers<ChangeOrderFormInit>) => {
    if (!isConnected) {
      toast.info("Please connect your wallet");
      return;
    }
    resetForm();
    setIsOpenProposalModal(false);
    prepareChangeOrderHandler(values);
  };


  return (
    <>
      <ChangeOrderModalNew
        isOpen={isOpenProposalModal}
        onClose={() => {
          setIsOpenProposalModal(false);
        }}
        modalTitle={"Propose Settlement"}
        onSubmitHandler={challengeHandler}
        modalId={modalId}
      />
      <button
        type="button"
        className={`theme-btn btn-style-one btn-small fw-bold w-100 mt-2`}
        onClick={() => {
          setIsOpenProposalModal(true);
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
          "Propose Settlement"
        )}
      </button>
    </>
  );
};

export default ProposeSettlement;
