"use client"
import useMarketplaceContract from "@/hooks/useMarketplaceContract";
import { setDisputeID } from "@/redux/contractInfo/contractInfoSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import EscrowMediation from "./EscrowMediation";

const MediationMain = () => {
  const dispatch = useAppDispatch();
  const projectId = useAppSelector((state) => state.contractInfo.contractId);
  const { getDisputeId } = useMarketplaceContract();
  const {
    data: disputeId,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["projectDisputeId", projectId?.toString()], // queryKey
    queryFn: () => {
      return getDisputeId(projectId?.toString() || null);
    }, // queryFn
    cacheTime: Infinity,
    onError: (error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    let dId = disputeId ? disputeId?.toString() : null;
    dispatch(setDisputeID(dId));
  }, [dispatch, disputeId]);

  return (
    <>
      <EscrowMediation />
    </>
  );
};

export default MediationMain;
