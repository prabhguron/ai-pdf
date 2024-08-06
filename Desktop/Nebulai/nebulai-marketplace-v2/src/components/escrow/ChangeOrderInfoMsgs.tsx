"use client";
import { ChangeOrderFormatted } from "@/abi/contractTypes";
import { useAppSelector } from "@/redux/store";
import React from "react";
import AlertInfoMessage from "../common/AlertInfoMessage";

const ChangeOrderInfoMsgs = ({changeOrderData}:{changeOrderData: ChangeOrderFormatted}) => {
  const changeOrderAvailable = useAppSelector(
    (state) => state.contractInfo.changeOrderAvailable
  );
  const { user } = useAppSelector(
    (state) => state.auth
  );

  const role: Role | "" = user?.role || "";
  if(!changeOrderAvailable) return;

  if(role === 'company'){
    if(changeOrderData?.buyerApproval && !changeOrderData?.providerApproval){
        return <AlertInfoMessage text="A change order has been proposed and is currently awaiting approval from the talent."/>
    }

    if(!changeOrderData?.buyerApproval){
        return <AlertInfoMessage text="A change order has been requested by the talent. Kindly review and approve the change order."/>
    }
  }

  if(role === 'talent'){
    if(changeOrderData?.providerApproval && !changeOrderData?.buyerApproval){
        return <AlertInfoMessage text="A change order has been proposed and is currently awaiting approval from the company."/>
    }

    if(!changeOrderData?.providerApproval){
        return <AlertInfoMessage text="A change order has been requested by the company. Kindly review and approve the change order."/>
    }
  }


  return <></>;
};

export default ChangeOrderInfoMsgs;
