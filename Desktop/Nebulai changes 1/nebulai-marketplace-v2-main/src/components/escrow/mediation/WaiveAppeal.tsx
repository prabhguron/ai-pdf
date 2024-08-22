"use client";
import CommonButton from "@/components/common/CommonButton";
import useContractAction from "@/hooks/useContractAction";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { ESCROW_STATUS, ESCROW_STATUS_MAP } from "@/utils/constants";
import { DisputeFormatted } from "@/hooks/useMediationService";
import React from "react";
import { setContractStatus } from "@/redux/contractInfo/contractInfoSlice";
import { useAccount } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";

const WaiveAppeal = ({
  disputeData,
}: {
  disputeData: DisputeFormatted;
}) => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const {address, isConnected} = useAccount();
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
  if(!address || !isConnected) return null;

  if(disputeData?.granted){
    if(address?.toLowerCase() !== disputeData?.respondent?.toLowerCase()) return null;
  }else{
    if(address?.toLowerCase() !== disputeData?.claimant?.toLowerCase()) return null;
  }

  const waiveAppealHandler = async () => {
    const txHash = await actionHandler("waiveAppeal", [projectId], "ResolvedByMediation");
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
        btnLabel={"Waive Appeal"}
        customClasses={"btn-small w-100 mt-2"}
        onClick={waiveAppealHandler}
        isLoading={actionLoading}
      />
    </>
  );
};

export default WaiveAppeal;
