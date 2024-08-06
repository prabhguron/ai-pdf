"use client";
import CommonButton from "@/components/common/CommonButton";
import useContractAction from "@/hooks/useContractAction";
import { setContractStatus } from "@/redux/contractInfo/contractInfoSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { ESCROW_STATUS, ESCROW_STATUS_MAP } from "@/utils/constants";
import useWindowWidth from "@/hooks/useWindowWidth";
import { screenIsMobileSize } from "@/utils/helper";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { BsHandThumbsUp } from "react-icons/bs";

const ApproveChangeOrder = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const projectId = useAppSelector(
    (state) => state.contractInfo.contractDetails?.projectId
  );
  const projectStatus = useAppSelector(
    (state) => state.contractInfo.contractDetails?.status
  );
  const projectStatusKey =
    typeof projectStatus !== "undefined"
      ? ESCROW_STATUS[projectStatus].toLowerCase()
      : "";
  const { actionHandler, actionLoading, loadingText } = useContractAction();
  const windowWidth = useWindowWidth(9999);

  if (!projectId) return null;

  if (!["discontinued", "challenged", "disputed"].includes(projectStatusKey)) {
    return null;
  }

  const approveChangeOrderHandler = async () => {
    const txHash =  await actionHandler(
      "approveChangeOrder",
      [projectId],
      "ChangeOrderApproved"
    );
    if(txHash !== null){
      dispatch(setContractStatus(ESCROW_STATUS_MAP['Resolved_ChangeOrder']));
      if(projectId){
        queryClient.invalidateQueries(["checkChangeOrder", projectId]);
        queryClient.invalidateQueries(["changeOrders", projectId]);
      }
    }
  }

  return (
    <>
      <CommonButton
        loadingText={actionLoading ? loadingText : ""}
        btnLabel={
          <>
            <BsHandThumbsUp />
            Approve Change
          </>
        }
        customClasses={`${screenIsMobileSize(windowWidth) ? "btn-style-success" : "btn-style-three success-variant"} theme-btn btn-small w-100 mt-2 gap-1`}
        onClick={approveChangeOrderHandler}
        isLoading={actionLoading}
      />
    </>
  );
};

export default ApproveChangeOrder;
