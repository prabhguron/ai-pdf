"use client";
import React, { useEffect, useRef, useState } from "react";
import JobsApi from "@/neb-api/JobsApi";
import Select, { ActionMeta, OnChangeValue } from "react-select";
import { useQuery } from "@tanstack/react-query";
import { useAppDispatch } from "@/redux/store";
import { setContractID, setOfferID, setSelectedContractOption } from "@/redux/contractInfo/contractInfoSlice";

export interface ContractOption {
  applicationId: string;
  jobId: string;
  jobTitle: string;
  value: string;
  offerId: string;
  escrowProjectId: string;
  label: string;
  offerIdentifier: string;
}

const AllContractsDropdown = () => {
  const dispatch = useAppDispatch();
  const approvedOfferSelect = useRef(null);
  const { getAllApprovedOffers } = JobsApi();
  const [contractId, setContractId] = useState<string | null>(null);
  const [currentOption, setCurrentOption] = useState<null | ContractOption>(null);

  const { data: approvedOffers, isLoading } = useQuery({
    queryFn: getAllApprovedOffers,
    queryKey: ["AllApprovedOffers"],
  });

  useEffect(() => {
    if (approvedOffers && approvedOffers.length && !contractId) {
      dispatch(setContractID(approvedOffers?.[0]?.escrowProjectId ?? null));
      setCurrentOption(approvedOffers?.[0]);
      setContractId(approvedOffers?.[0]?.escrowProjectId);
      dispatch(setOfferID(approvedOffers?.[0]?.offerId));
      dispatch(setSelectedContractOption(approvedOffers?.[0]))
    }
  }, [dispatch, approvedOffers, contractId]);

  const contractDetailsHandler = (selectData: OnChangeValue<ContractOption, false>, actionMeta: ActionMeta<ContractOption>) => {
    if(!selectData?.escrowProjectId) return;
    dispatch(setContractID(selectData?.escrowProjectId ?? null));
    setContractId(selectData?.escrowProjectId);
    dispatch(setOfferID(selectData?.offerId));
    setCurrentOption(selectData);
    dispatch(setSelectedContractOption(selectData))
  };

  return (
    <div className="tabs-box">
      <div className="widget-title d-block px-2 py-3">
        <div className="search-box-one allContractsDropDown">
          <form method="post" action="#">
            <div className="form-group">
              <label htmlFor="approvedOffers">Select Contract</label>
              <Select
                ref={approvedOfferSelect}
                isDisabled={isLoading}
                isLoading={isLoading}
                className="short-listed-jobs"
                classNamePrefix="select"
                defaultValue={currentOption}
                value={currentOption}
                isSearchable={true}
                id="approvedOffers"
                name="approvedOffers"
                options={approvedOffers}
                onChange={contractDetailsHandler}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AllContractsDropdown;
