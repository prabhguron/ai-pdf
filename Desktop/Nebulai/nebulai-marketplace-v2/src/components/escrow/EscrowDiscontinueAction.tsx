"use client";
import { useMutation } from "@tanstack/react-query";
import OffersApi from "@/neb-api/OffersApi";
import marketPlaceABI from "@/abi/Marketplace.json";
import useWriteWaitContract from "@/hooks/useWriteWaitContract";
import useWindowWidth from "@/hooks/useWindowWidth";
import { screenIsMobileSize } from "@/utils/helper";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";
import { ChangeOrderFormInit } from "./ChangeOrderModal";
import { ethers } from "ethers";
import { ESCROW_STATUS, ESCROW_STATUS_MAP } from "@/utils/constants";
import { Address } from "viem";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { FormikHelpers } from "formik";
import deployment from "@/abi/deployment.json";
import { setContractStatus } from "@/redux/contractInfo/contractInfoSlice";
import useStateUtil from "@/hooks/useStateUtil";
import ChangeOrderModalNew from "./changeOrders/ChangeOrderModalNew";
import { TiCancel } from "react-icons/ti";

const MARKETPLACE_CONTRACT = deployment?.MARKETPLACE_CONTRACT as Address;
const marketPlaceAddressABI = {
  address: MARKETPLACE_CONTRACT,
  abi: marketPlaceABI,
};

const EscrowDiscontinueAction = () => {
  const dispatch = useAppDispatch();
  const escrowData = useAppSelector(
    (state) => state.contractInfo.contractDetails,
  );
  const offerId = useAppSelector((state) => state.contractInfo.offerId);
  const [isOpenDiscontinueModal, setIsOpenDiscontinueModal] = useState(false);
  const modalId = "discontinueChangeModal";
  const { prepareChangeOrder } = OffersApi();
  const { address, isConnected } = useAccount();
  const { refetchContractChangeOrderInfo } = useStateUtil();
  const { loadingText, isExecuting, executeTransaction } =
    useWriteWaitContract();
  const projectId = escrowData?.projectId;
  const projectStatus = escrowData?.status;
  const status =
    typeof projectStatus !== "undefined"
      ? ESCROW_STATUS[projectStatus].toLowerCase()
      : "";
  const windowWidth = useWindowWidth(9999);

  const { mutate, isLoading } = useMutation({
    mutationFn: (mutationData: ChangeOrderFormInit) => {
      return prepareChangeOrder(offerId, mutationData);
    },
    onSuccess: async (response, variables) => {
      const { status, data } = response;
      if (status === 200) {
        try {
          const { changeOrderMetaHash } = data;
          const discontinueProjectArgs = {
            ...marketPlaceAddressABI,
            fromAddress: address as Address,
            functionName: "discontinueProject",
            args: [
              projectId,
              ethers.utils
                .parseEther(variables?.adjustedProjectFee?.toString())
                .toString(),
              ethers.utils
                .parseEther(variables?.talentStakeForfeit?.toString())
                .toString(),
              changeOrderMetaHash,
            ],
            value: 0,
            eventNameToSearch: "ProjectDiscontinued",
          };

          const { status, txHash, eventArgData, errorMsg, revertErrorName } =
            await executeTransaction(discontinueProjectArgs);
          if (status === "success") {
            dispatch(setContractStatus(ESCROW_STATUS_MAP["Discontinued"]));
            if (projectId) {
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

  function showBtn() {
    if (!["active"].includes(status)) {
      return false;
    }
    return true;
  }

  if (!showBtn()) {
    return null;
  }

  const prepareChangeOrderHandler = async (payload: ChangeOrderFormInit) => {
    try {
      mutate(payload);
    } catch (error: any) {
      console.log(error?.message);
    }
  };

  const discontinueHandler = async (
    values: ChangeOrderFormInit,
    { resetForm }: FormikHelpers<ChangeOrderFormInit>,
  ) => {
    if (!isConnected) {
      toast.info("Please connect your wallet");
      return;
    }
    resetForm();
    setIsOpenDiscontinueModal(false);
    prepareChangeOrderHandler(values);
  };

  return (
    <>
      <ChangeOrderModalNew
        isOpen={isOpenDiscontinueModal}
        onClose={() => {
          setIsOpenDiscontinueModal(false);
        }}
        modalTitle={"Discontinue Contract"}
        onSubmitHandler={discontinueHandler}
        modalId={modalId}
      />
      <button
        type="button"
        className={`${screenIsMobileSize(windowWidth) ? "btn-style-danger" : "btn-style-three danger-variant"} theme-btn btn-small w-100 mt-2 fw-bold gap-1`}
        onClick={() => {
          setIsOpenDiscontinueModal(true);
        }}
        disabled={isExecuting || isLoading}
      >
        {isExecuting || isLoading ? (
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
            <TiCancel className="fs-5" />
            Discontinue Contract
          </>
        )}
      </button>
    </>
  );
};

export default EscrowDiscontinueAction;
