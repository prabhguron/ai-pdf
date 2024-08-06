"use client";
import React from "react";
import EscrowChallengeAction from "./EscrowChallengeAction";
import { ESCROW_STATUS } from "@/utils/constants";
import { useAppSelector } from "@/redux/store";
import moment from "moment";

const EscrowChallengeActionBtn = () => {
  const userRole = useAppSelector((state) => state?.auth?.user?.role);
  const projectStatus = useAppSelector(
    (state) => state.contractInfo.contractDetails?.status
  );
  const dateCompleted = useAppSelector(
    (state) => state.contractInfo.contractDetails?.dateCompleted
  );
  const dueDateRaw = useAppSelector(
    (state) => state.contractInfo.contractDetails?.dueDateRaw
  );
  const reviewPeriodLengthRawSeconds = useAppSelector(
    (state) => state.contractInfo.contractDetails?.reviewPeriodLengthRaw
  );
  const status =
    typeof projectStatus !== "undefined"
      ? ESCROW_STATUS[projectStatus].toLowerCase()
      : "";

  if (!dateCompleted || !reviewPeriodLengthRawSeconds || !dueDateRaw)
    return null;

  const currentTime = moment().unix();
  const reviewPeriodElapsed =
    parseInt(dateCompleted) + parseInt(reviewPeriodLengthRawSeconds);
  const dueDate = parseInt(dueDateRaw);

  function showChallengeActionBtn() {
    if(userRole !== 'company') return false;
    if (!["active", "completed"].includes(status)) {
      return false;
    }

    if (status === "active" && currentTime < dueDate) {
      return false;
    }

    if (status === "completed" && currentTime > reviewPeriodElapsed) {
      return false;
    }

    return true;
  }

  let renderActions = showChallengeActionBtn();

  return (
    renderActions && (
      <>
        <EscrowChallengeAction />
      </>
    )
  );
};

export default EscrowChallengeActionBtn;
