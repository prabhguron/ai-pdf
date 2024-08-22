"use client";
import CommonButton from "@/components/common/CommonButton";
import useContractAction from "@/hooks/useContractAction";
import { setContractStatus } from "@/redux/contractInfo/contractInfoSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import useWindowWidth from "@/hooks/useWindowWidth";
import { screenIsMobileSize } from "@/utils/helper";
import { ESCROW_STATUS, ESCROW_STATUS_MAP } from "@/utils/constants";
import React from "react";
import { TiCancel } from "react-icons/ti";

const CancelContract = () => {
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


  const cancelProjectHandler = async () => {
    const txHash =  await actionHandler(
      "cancelProject",
      [projectId],
      "ProjectCancelled"
    );
    if(txHash !== null){
      dispatch(setContractStatus(ESCROW_STATUS_MAP['Cancelled']));
    }
  }

  return (
    <>
      {projectStatusKey === "created" && (
        <CommonButton
          loadingText={actionLoading ? loadingText : ""}
          btnLabel={
            <>
              <TiCancel className="fs-5" />
              Cancel Contract
            </>
          }
          customClasses={`${screenIsMobileSize(windowWidth) ? "btn-style-danger" : "btn-style-three danger-variant"} theme-btn btn-small w-100 mt-2 fw-bold gap-1`}
          onClick={cancelProjectHandler}
          isLoading={actionLoading}
        />
      )}
    </>
  );
};

export default CancelContract;
