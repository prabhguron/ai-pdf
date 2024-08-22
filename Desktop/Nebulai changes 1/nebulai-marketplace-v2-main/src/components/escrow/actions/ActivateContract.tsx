"use client";
import CommonButton from "@/components/common/CommonButton";
import useContractAction from "@/hooks/useContractAction";
import { setContractStatus } from "@/redux/contractInfo/contractInfoSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { ESCROW_STATUS, ESCROW_STATUS_MAP } from "@/utils/constants";
import React from "react";

const ActivateContract = () => {
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

  if (!projectId || userRole !== "talent") return null;

  const activateProjectHandler = async () => {
    const txHash = await actionHandler(
      "activateProject",
      [projectId],
      "ProjectActivated",
      true
    );
    if(txHash !== null){
      dispatch(setContractStatus(ESCROW_STATUS_MAP['Active']));
    }
  }

  return (
    <>
      {projectStatusKey === "created" && (
        <CommonButton
          loadingText={actionLoading ? loadingText : ""}
          btnLabel={"Activate Contract"}
          customClasses={"btn-small w-100 mt-2"}
          onClick={activateProjectHandler}
          isLoading={actionLoading}
        />
      )}
    </>
  );
};

export default ActivateContract;
