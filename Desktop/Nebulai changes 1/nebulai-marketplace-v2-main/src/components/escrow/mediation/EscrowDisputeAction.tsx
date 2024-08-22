"use client"
import marketPlaceABI from "@/abi/Marketplace.json";
import useWriteWaitContract from "@/hooks/useWriteWaitContract";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";
import  { ChangeOrderFormInit } from "../ChangeOrderModal";
import { ethers } from "ethers";
import { ESCROW_STATUS, ESCROW_STATUS_MAP } from "@/utils/constants";
import {Address} from "viem";
import deployment from "@/abi/deployment.json";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { FormikHelpers } from "formik";
import { setContractStatus } from "@/redux/contractInfo/contractInfoSlice";
import useStateUtil from "@/hooks/useStateUtil";
import { useQueryClient } from "@tanstack/react-query";
import ChangeOrderModalNew from "@/components/escrow/changeOrders/ChangeOrderModalNew";
import { FaExclamation } from "react-icons/fa";
import useWindowWidth from "@/hooks/useWindowWidth";
import { screenIsMobileSize } from "@/utils/helper";

const MARKETPLACE_CONTRACT = deployment?.MARKETPLACE_CONTRACT as Address;
const marketPlaceAddressABI = {
  address: MARKETPLACE_CONTRACT,
  abi: marketPlaceABI,
};

const EscrowDisputeAction = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const escrowData = useAppSelector(state => state.contractInfo.contractDetails);
  const [isOpenRaiseMediationModal, setIsOpenRaiseMediationModal] = useState(false);
  const modalId = "raiseMediationModal";
  const { address, isConnected } = useAccount();
  const {refetchContractDisputeId} = useStateUtil();
  const { loadingText, isExecuting, executeTransaction } = useWriteWaitContract();
  const projectId = escrowData?.projectId;
  const projectStatus = escrowData?.status;
  const status = (typeof projectStatus !== 'undefined') ? ESCROW_STATUS[projectStatus].toLowerCase() : '';
  const windowWidth = useWindowWidth(9999);

  if(status === 'disputed'){
    return null
  }

  if(status != 'challenged' && status != 'discontinued'){
    return null
  } 

  const disputeHandler = async (adjustedFee: string, talentForfeitStake: string) => {
    if(!adjustedFee) return;
    try {
        const disputeProjectArgs = {
          ...marketPlaceAddressABI,
          fromAddress: address as Address,
          functionName: "disputeProject",
          args: [
            projectId,
            adjustedFee,
            talentForfeitStake,
          ],
          value: 0,
          eventNameToSearch: "ProjectDisputed",
        };

        const { status, txHash, errorMsg, revertErrorName } =
          await executeTransaction(disputeProjectArgs);
        if (status === "success") {
          dispatch(setContractStatus(ESCROW_STATUS_MAP['Disputed']))
          if(projectId){
            await refetchContractDisputeId(projectId);
            queryClient.invalidateQueries(["checkChangeOrder", projectId]);
            queryClient.invalidateQueries(["changeOrders", projectId]);
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


  const disputeModalSubmit = async (values: ChangeOrderFormInit, {resetForm}: FormikHelpers<ChangeOrderFormInit>) => {
    if (!isConnected) {
      toast.info("Please connect your wallet");
      return;
    }
    resetForm();
    setIsOpenRaiseMediationModal(false);
    disputeHandler(
      ethers.utils.parseEther(values?.adjustedProjectFee?.toString()).toString(),
      ethers.utils.parseEther(values?.talentStakeForfeit?.toString()).toString(),
    );
  };

  return (
    <>
      <ChangeOrderModalNew
        isOpen={isOpenRaiseMediationModal}
        onClose={() => {
          setIsOpenRaiseMediationModal(false);
        }}
        modalTitle={"Raise Dispute"}
        onSubmitHandler={disputeModalSubmit}
        modalId={modalId}
        formInitPayload={{
            changeOrderDesc: "",
            adjustedProjectFee: 0,
            talentStakeForfeit: 0
        }}
        validateFields={['adjustedProjectFee', 'talentStakeForfeit']}
      />
      <button
        type="button"
        className={`${screenIsMobileSize(windowWidth) ? "btn-style-danger" : "btn-style-three danger-variant"} theme-btn fw-bold btn-small w-100 mt-2 gap-1`}
        onClick={() => {
          setIsOpenRaiseMediationModal(true);
        }}
        disabled={isExecuting}
      >
        {isExecuting ? (
          <>
            {loadingText}{" "}
            <span
              className="spinner-border spinner-border-sm pl-4"
              role="status"
              aria-hidden="true"
            ></span>
          </>
        ) : (
          <>
            <FaExclamation />
            Raise Dispute
          </>
        )}
      </button>
    </>
  );
};

export default EscrowDisputeAction;
