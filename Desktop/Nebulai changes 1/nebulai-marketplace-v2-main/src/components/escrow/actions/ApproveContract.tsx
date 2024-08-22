"use client";
import CommonButton from "@/components/common/CommonButton";
import useContractAction from "@/hooks/useContractAction";
import { setContractStatus } from "@/redux/contractInfo/contractInfoSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { ESCROW_STATUS, ESCROW_STATUS_MAP } from "@/utils/constants";
import useWindowWidth from "@/hooks/useWindowWidth";
import { screenIsMobileSize } from "@/utils/helper";
import React from "react";
import { FaCheck } from "react-icons/fa";

const ApproveContract = () => {
  const dispatch = useAppDispatch();
  const userRole = useAppSelector((state) => state?.auth?.user?.role);
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

  if (!projectId || userRole !== 'company') return null;

  const approveProjectHandler = async () => {
    const txHash =  await actionHandler(
      "approveProject",
      [projectId],
      "ProjectApproved"
    );
    if(txHash !== null){
      dispatch(setContractStatus(ESCROW_STATUS_MAP['Approved']));
    }
  }

  return (
    <>
      {projectStatusKey === "completed" && (
        <CommonButton
          loadingText={actionLoading ? loadingText : ""}
          btnLabel={
            <>
              <FaCheck />
              Approve Submission
            </>
          }
          customClasses={`${screenIsMobileSize(windowWidth) ? "btn-style-success" : "btn-style-three success-variant"} theme-btn btn-small w-100 mb-2 fw-bold gap-1`}
          onClick={approveProjectHandler}
          isLoading={actionLoading}
        />
      )}
    </>
  );
};

export default ApproveContract;
