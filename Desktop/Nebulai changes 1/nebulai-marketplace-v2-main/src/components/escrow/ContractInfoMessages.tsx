"use client";
import React from "react";
import AlertInfoMessage from "@/components/common/AlertInfoMessage";
import { useAppSelector } from "@/redux/store";
import { ESCROW_STATUS } from "@/utils/constants";

const ContractInfoMessages = () => {
  const { user } = useAppSelector(
    (state) => state.auth
  );
  const escrowData = useAppSelector(state => state.contractInfo.contractDetails);
  const projectStatus = escrowData?.status;
  const projectStatusKey = (typeof projectStatus !== 'undefined') ? ESCROW_STATUS[projectStatus].toLowerCase() : ''
  const role: Role | "" = user?.role || "";

  if(projectStatusKey === "created"){
    if(role === "talent"){
        return (
            <AlertInfoMessage text="The contract has been successfully initiated by the company. Kindly activate the contract before commencing your work."/>
        )
    }

    if(role === "company"){
        return (
            <AlertInfoMessage text="Your contract initiation was successful. The next step is to wait for the talent to activate the contract. You still have the option to cancel the contract, which will terminate the contract and refund the contract fee."/>
        )
    }
  }

  return null;
};

export default ContractInfoMessages;
