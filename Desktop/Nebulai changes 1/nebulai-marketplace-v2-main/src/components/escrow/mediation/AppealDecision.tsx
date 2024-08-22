"use client";
import CommonButton from "@/components/common/CommonButton";
import useContractAction from "@/hooks/useContractAction";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { ESCROW_STATUS, ESCROW_STATUS_MAP } from "@/utils/constants";
import { DisputeFormatted } from "@/hooks/useMediationService";
import moment from "moment";
import React from "react";
import { setContractStatus } from "@/redux/contractInfo/contractInfoSlice";
import { useQueryClient } from "@tanstack/react-query";

const AppealDecision = ({
  disputeData,
}: {
  disputeData: DisputeFormatted;
}) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient()
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

  if (!projectId || !disputeData) return null;

  if (projectStatusKey !== "disputed") return null;
  if(disputeData?.phaseTxt?.toLowerCase() !== "decision") return null;

  const currentTime = moment().unix();
  const APPEAL_PERIOD = disputeData?.APPEAL_PERIOD;
  const appealPeriodOver =
    parseInt(disputeData?.decisionRenderedDateRaw) + APPEAL_PERIOD;
    
  if (currentTime >= appealPeriodOver) {
    return null;
  }

  
  const appealDecisionHandler = async () => {
    const txHash = await actionHandler("appealDecision", [projectId], "ProjectAppealed");
    if(txHash !== null){
      dispatch(setContractStatus(ESCROW_STATUS_MAP['Appealed']));
      if(disputeData?.disputeId){
        queryClient.invalidateQueries(["disputeData", disputeData?.disputeId?.toString()]);
      }
    }
  }

  return (
    <>
      <CommonButton
        loadingText={actionLoading ? loadingText : ""}
        btnLabel={"Appeal Decision"}
        customClasses={"btn-small w-100 mt-2"}
        onClick={appealDecisionHandler}
        isLoading={actionLoading}
      />
    </>
  );
};

export default AppealDecision;
