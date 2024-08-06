"use client"
import { useMutation } from "@tanstack/react-query";
import OffersApi from "@/neb-api/OffersApi";
import marketPlaceABI from "@/abi/Marketplace.json";
import useWriteWaitContract from "@/hooks/useWriteWaitContract";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";
import { ChangeOrderFormInit } from "../ChangeOrderModal";
import { ethers } from "ethers";
import { Address } from "viem";
import deployment from "@/abi/deployment.json";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { FormikHelpers } from "formik";
import { setContractStatus } from "@/redux/contractInfo/contractInfoSlice";
import { ESCROW_STATUS_MAP } from "@/utils/constants";
import useStateUtil from "@/hooks/useStateUtil";
import ChangeOrderModalNew from "@/components/escrow/changeOrders/ChangeOrderModalNew";
import useWindowWidth from "@/hooks/useWindowWidth";
import { screenIsMobileSize } from "@/utils/helper";
import { CgClose } from "react-icons/cg";

const MARKETPLACE_CONTRACT = deployment?.MARKETPLACE_CONTRACT as Address;
const marketPlaceAddressABI = {
  address: MARKETPLACE_CONTRACT,
  abi: marketPlaceABI,
};

const EscrowChallengeAction = () => {
  const dispatch = useAppDispatch();
  const escrowData = useAppSelector(state => state.contractInfo.contractDetails);
  const offerId = useAppSelector(state => state.contractInfo.offerId);
  const [isOpenChallengeModal, setIsOpenChallengeModal] = useState(false);
  const modalId = "challengeChangeModal";
  const { prepareChangeOrder } = OffersApi();
  const { address, isConnected } = useAccount();
  const {refetchContractChangeOrderInfo} = useStateUtil();
  const { isExecuting, executeTransaction } = useWriteWaitContract();
  const projectId = escrowData?.projectId;
  const windowWidth = useWindowWidth(9999);

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
              functionName: "challengeProject",
              args: [
                projectId,
                ethers.utils.parseEther(variables?.adjustedProjectFee?.toString()).toString(),
                ethers.utils.parseEther(variables?.talentStakeForfeit?.toString()).toString(),
                changeOrderMetaHash
              ],
              value: 0,
              eventNameToSearch: "ProjectChallenged",
            };

            const { status, txHash, eventArgData, errorMsg, revertErrorName } =
              await executeTransaction(challengeProjectArgs);
            if (status === "success") {
              dispatch(setContractStatus(ESCROW_STATUS_MAP['Challenged']));
              if(projectId){
                await refetchContractChangeOrderInfo(projectId);
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
    setIsOpenChallengeModal(false);
    prepareChangeOrderHandler(values);
  };

  return (
    <>
      <ChangeOrderModalNew
        isOpen={isOpenChallengeModal}
        onClose={() => {
          setIsOpenChallengeModal(false);
        }}
        modalTitle={"Challenge Contract"}
        onSubmitHandler={challengeHandler}
        modalId={modalId}
      />
      <button
        type="button"
        className={`${screenIsMobileSize(windowWidth) ? "btn-style-danger" : "btn-style-three danger-variant"} theme-btn btn-small w-100 fw-bold gap-1`}
        onClick={() => {
          setIsOpenChallengeModal(true);
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
          <>
            <CgClose className="fs-5" />
            Challenge Contract
          </>
        )}
      </button>
    </>
  );
};

export default EscrowChallengeAction;