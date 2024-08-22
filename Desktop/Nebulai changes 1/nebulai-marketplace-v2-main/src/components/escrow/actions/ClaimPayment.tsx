"use client";
import CommonButton from "@/components/common/CommonButton";
import useContractAction from "@/hooks/useContractAction";
import { setContractStatus } from "@/redux/contractInfo/contractInfoSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { ESCROW_STATUS, ESCROW_STATUS_MAP } from "@/utils/constants";
import moment from "moment";
import React from "react";

const ClaimPayment = () => {
  const dispatch = useAppDispatch();
  const userRole = useAppSelector((state) => state?.auth?.user?.role);
  const projectId = useAppSelector(
    (state) => state.contractInfo.contractDetails?.projectId
  );
  const projectStatus = useAppSelector(
    (state) => state.contractInfo.contractDetails?.status
  );
  const dateCompleted = useAppSelector(
    (state) => state.contractInfo.contractDetails?.dateCompleted
  );
  const reviewPeriodLengthRawSeconds = useAppSelector(
    (state) => state.contractInfo.contractDetails?.reviewPeriodLengthRaw
  );

  const projectStatusKey =
    typeof projectStatus !== "undefined"
      ? ESCROW_STATUS[projectStatus].toLowerCase()
      : "";
  const { actionHandler, actionLoading, loadingText } = useContractAction();

  if (
    !projectId ||
    userRole !== "talent" ||
    !dateCompleted ||
    !reviewPeriodLengthRawSeconds
  )
    return null;

  const currentTime = moment().unix();
  const reviewPeriodElapsed =
    parseInt(dateCompleted) + parseInt(reviewPeriodLengthRawSeconds);

  if (projectStatusKey !== "completed" || currentTime < reviewPeriodElapsed) {
    return null;
  }

  const reviewOverdueHandler = async () => {
    const txHash = await actionHandler(
      "reviewOverdue",
      [projectId],
      "ReviewOverdue"
    );
    if (txHash !== null) {
      dispatch(
        setContractStatus(ESCROW_STATUS_MAP["Resolved_ReviewOverdue"])
      );
    }
  };

  return (
    <>
      <CommonButton
        loadingText={actionLoading ? loadingText : ""}
        btnLabel={"Claim Payment"}
        customClasses={"btn-small btn-style-success w-100 mt-2"}
        onClick={reviewOverdueHandler}
        isLoading={actionLoading}
      />
    </>
  );
};

export default ClaimPayment;