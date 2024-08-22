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

const ResolveByMediation = ({
  disputeData,
}: {
  disputeData: DisputeFormatted;
}) => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
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
  if(disputeData?.phaseTxt?.toLowerCase() !== "decision" && disputeData?.phaseTxt?.toLowerCase() !== "defaultdecision") return null;

  if(!disputeData?.isAppeal){
    const currentTime = moment().unix();
    const APPEAL_PERIOD = disputeData?.APPEAL_PERIOD;
    const appealPeriodOver =
      parseInt(disputeData?.decisionRenderedDateRaw) + APPEAL_PERIOD;
    if (currentTime < appealPeriodOver) {
      return null;
    }
  }

  const resolveByMediationHandler = async () => {
    const txHash = await actionHandler("resolveByMediation", [projectId], "Resolved_Mediation");
    if(txHash !== null){
      dispatch(setContractStatus(ESCROW_STATUS_MAP['Resolved_Mediation']));
      if(disputeData?.disputeId){
        queryClient.invalidateQueries(["disputeData", disputeData?.disputeId?.toString()]);
      }
    }
  }

  return (
    <>
      <CommonButton
        loadingText={actionLoading ? loadingText : ""}
        btnLabel={"Resolve By Mediation"}
        customClasses={"btn-small w-100 mt-2"}
        onClick={resolveByMediationHandler}
        isLoading={actionLoading}
      />
    </>
  );
};

export default ResolveByMediation;
