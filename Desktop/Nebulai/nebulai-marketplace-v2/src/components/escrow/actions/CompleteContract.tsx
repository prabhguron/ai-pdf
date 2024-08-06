"use client";
import CommonButton from "@/components/common/CommonButton";
import useContractAction from "@/hooks/useContractAction";
import useStateUtil from "@/hooks/useStateUtil";
import { setContractStatus } from "@/redux/contractInfo/contractInfoSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { ESCROW_STATUS, ESCROW_STATUS_MAP } from "@/utils/constants";
import useWindowWidth from "@/hooks/useWindowWidth";
import { screenIsMobileSize } from "@/utils/helper";
import React from "react";
import { AiOutlineFileDone } from "react-icons/ai";

const CompleteContract = () => {
  const dispatch = useAppDispatch();
  const userRole = useAppSelector((state) => state?.auth?.user?.role);
  const projectId = useAppSelector(
    (state) => state.contractInfo.contractDetails?.projectId,
  );
  const projectStatus = useAppSelector(
    (state) => state.contractInfo.contractDetails?.status,
  );
  const { refetchContractInfo } = useStateUtil();
  const projectStatusKey =
    typeof projectStatus !== "undefined"
      ? ESCROW_STATUS[projectStatus].toLowerCase()
      : "";
  const { actionHandler, actionLoading, loadingText } = useContractAction();
  const windowWidth = useWindowWidth(9999);

  if (!projectId || userRole !== "talent") return null;

  const completeProjectHandler = async () => {
    const txHash = await actionHandler(
      "completeProject",
      [projectId],
      "ProjectCompleted",
    );
    if (txHash !== null) {
      if (projectId) {
        await refetchContractInfo(projectId);
      }
      dispatch(setContractStatus(ESCROW_STATUS_MAP["Completed"]));
    }
  };

  return (
    <>
      {projectStatusKey === "active" && (
        <CommonButton
          loadingText={actionLoading ? loadingText : ""}
          btnLabel={
            <>
              <AiOutlineFileDone className="fs-5" />
              Complete Contract
            </>
          }
          customClasses={`${screenIsMobileSize(windowWidth) ? "btn-style-success" : "btn-style-three success-variant"} theme-btn btn-small w-100 mt-2 gap-1`}
          onClick={completeProjectHandler}
          isLoading={actionLoading}
        />
      )}
    </>
  );
};

export default CompleteContract;
