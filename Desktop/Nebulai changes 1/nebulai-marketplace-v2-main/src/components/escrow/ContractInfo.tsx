"use client";
import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useMarketplaceContract from "@/hooks/useMarketplaceContract";
import { ProjectFormatted } from "@/abi/contractTypes";
import LoaderCommon from "@/components/LoaderCommon";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  setChangeOrderAvailable,
  setChangeOrders,
  setChangeOrdersCount,
  setContractDetails,
} from "@/redux/contractInfo/contractInfoSlice";
import ContractTabs from "./ContractTabs";
import ContractDetails from "./ContractDetails";
import ContractTopInfo from "./ContractTopInfo";
import ContractActions from "./ContractActions";
import EscrowChangeOrderInfo from "./changeOrders/EscrowChangeOrderInfo";
import EscrowWithdraw from "./actions/EscrowWithdraw";
import { Address } from "viem";
import MediationMain from "./mediation/MediationMain";

const ContractInfo = () => {
  const dispatch = useAppDispatch();
  const contractId = useAppSelector((state) => state.contractInfo.contractId);
  const changeCount = useAppSelector((state) => state.contractInfo.changeOrdersCount);
  const escrowAddress = useAppSelector(state => state.contractInfo.contractDetails?.escrow) as Address
  const { getProjectData, activeChangeOrder, getChangeOrdersData } = useMarketplaceContract();

  let {
    data: escrowData,
    isLoading: escrowDataLoading,
    isError,
  } = useQuery({
    queryKey: ["escrowProjectData", contractId], // queryKey
    queryFn: () => getProjectData(contractId, true), // queryFn
    cacheTime: Infinity,
    onError: (error: any) => {
      console.error(error?.message);
    },
  });
  escrowData = escrowData as ProjectFormatted;

  const {
    data: changeOrderAvailable,
    isLoading: checkingForChangeOrder,
    isError: checkChangeOrderError,
  } = useQuery({
    queryKey: ["checkChangeOrder", contractId], // queryKey
    queryFn: () => activeChangeOrder(contractId), // queryFn
    cacheTime: Infinity,
    onError: (error: any) => {
      console.error(error?.message);
    },
  });

  const {
    data: changeOrders,
    isLoading: checkingForChangeOrders,
    isError: checkChangeOrdersError,
  } = useQuery({
    queryKey: ["changeOrders", contractId], // queryKey
    queryFn: () => getChangeOrdersData(contractId, true), // queryFn
    cacheTime: Infinity,
    onError: (error: any) => {
      console.error(error?.message);
    },
  });

  useEffect(() => {
    const changeOrdersCount = changeOrders?.length ?? 0;
    dispatch(setChangeOrdersCount(changeOrdersCount));
    dispatch(setChangeOrders(changeOrdersCount > 0 ? changeOrders : null));
  }, [dispatch, changeOrders]);

  useEffect(() => {
    dispatch(setContractDetails(escrowData ?? null));
  }, [dispatch, escrowData]);

  useEffect(() => {
    dispatch(setChangeOrderAvailable(changeOrderAvailable));
  }, [dispatch, changeOrderAvailable]);


  if (!escrowData && (escrowDataLoading || checkingForChangeOrder)) {
    return <LoaderCommon classCustom="ls-widget loading-container-h50" />;
  }

  return (
    <>
     
      <ContractTopInfo />
      {(contractId && escrowAddress)? (
        <div className="row mx-1">
          <div className="ls-widget col-lg-12 col-md-12 col-sm-12 mb-1 py-2 px-3 d-flex justify-content-center">
            <EscrowWithdraw escrowAddress={escrowAddress} />
          </div>
        </div>
      ):null}
      <div className="">{/* ls-widget */}
        <ContractTabs />
        <div className="tab-content" id="nav-tabContent">
          <div
            className="tab-pane fade active show p-3"
            id="contractInfo"
            role="tabpanel"
            aria-labelledby="jobs-tab"
          >
            <div className="row">
              <div className="col-12">
                {escrowData ? (
                  <ContractDetails />
                ) : (
                  <div className="text-center p-11rem fw-bolder">
                    No Contracts Found 📃
                  </div>
                )}
              </div>
            </div>

            <div className="row px-3">{contractId && <ContractActions />}</div>
          </div>

          {(changeCount > 0) && (
            <div
              className="tab-pane fade"
              id="change-order"
              role="tabpanel"
              aria-labelledby="change-order-tab"
            >
              {contractId && <EscrowChangeOrderInfo />}
            </div>
          )}
          <div
            className="tab-pane fade"
            id="mediation"
            role="tabpanel"
            aria-labelledby="mediation-tab"
          >
            {contractId && <MediationMain />}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContractInfo;
