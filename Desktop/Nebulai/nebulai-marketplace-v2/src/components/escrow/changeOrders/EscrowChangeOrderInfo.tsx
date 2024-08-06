/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import ChangeOrderAccordionItem from "./ChangeOrderAccordionItem";
import { ESCROW_STATUS } from "@/utils/constants";
import { setCanRaiseDispute } from "@/redux/contractInfo/contractInfoSlice";
import moment from "moment";

const EscrowChangeOrderInfo = () => {
  const dispatch = useAppDispatch();
  const changeOrders = useAppSelector((state) => state.contractInfo.changeOrders);
  const changeOrderAvailable = useAppSelector((state) => state.contractInfo.changeOrderAvailable);
  const projectStatus = useAppSelector(
    (state) => state.contractInfo.contractDetails?.status
  );
  const projectStatusKey =
    typeof projectStatus !== "undefined"
      ? ESCROW_STATUS[projectStatus].toLowerCase()
      : "";
  const projectChangeOrderPeriodInitiated = useAppSelector(
    (state) => state.contractInfo.contractDetails?.changeOrderPeriodInitiatedRaw
  );
  const projectChangeOrderPeriod = useAppSelector(
    (state) => state.contractInfo.contractDetails?.changeOrderPeriod
  );

  useEffect(() => {
    if(projectChangeOrderPeriodInitiated && projectChangeOrderPeriod){
      const currentTime = moment().unix();
      const changeOrderPeriodElapsed = parseInt(projectChangeOrderPeriodInitiated) + projectChangeOrderPeriod;
      let canDispute = false;
      if (["discontinued", "challenged"].includes(projectStatusKey)) {
        if(currentTime > changeOrderPeriodElapsed){
          canDispute = true;
        }
      }
      dispatch(setCanRaiseDispute(canDispute));
    }
  },[dispatch, changeOrderAvailable, projectChangeOrderPeriodInitiated, projectChangeOrderPeriod, projectStatusKey]);

  
  // const { getChangeOrdersData } = useMarketplaceContract();

  // let {
  //   data: changeOrders,
  //   isLoading: changeOrdersLoading,
  //   isError,
  // } = useQuery({
  //   queryKey: ["changeOrders", projectId],
  //   queryFn: () => {
  //     return getChangeOrdersData(projectId, true);
  //   },
  //   cacheTime: Infinity,
  //   onError: (error) => {
  //     console.error(error);
  //   },
  // });
  // changeOrders = changeOrders as ChangeOrderFormatted[];
  // console.log(changeOrders);
  // if (changeOrdersLoading) {
  //   return <LoaderCommon />;
  // }

  if (!changeOrders) {
    return <></>;
  }

  return (
    <div className="changeOrdersList">
      <div className="accordion accordion-flush" id="changeOrdersAccordion">
        {changeOrders?.map((order, idx) => (
          <ChangeOrderAccordionItem
            key={`changeOrd_${order?.projectId}_${idx}`}
            index={idx + 1}
            changeOrder={order}
          />
        ))}
      </div>
    </div>
  );
};

export default EscrowChangeOrderInfo;