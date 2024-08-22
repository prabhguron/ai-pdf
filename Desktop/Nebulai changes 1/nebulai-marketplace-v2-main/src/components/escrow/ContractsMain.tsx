"use client";
import React from "react";
import BreadCrumb from "@/components/common/BreadCrumb";
import CompleteOnBoarding from "@/components/common/CompleteOnBoarding";
import AllContractsDropdown from "./AllContractsDropdown";
import ContractInfo from "./ContractInfo";

const ContractsMain = () => {
  return (
    <>
      <BreadCrumb title={"All Contracts"} />
      <div className="row">
        <CompleteOnBoarding>
          <div className="col-lg-12">
            <div className="ls-widget mb-2">
              <AllContractsDropdown />
            </div>
              <ContractInfo />
          </div>
        </CompleteOnBoarding>
      </div>
    </>
  );
};

export default ContractsMain;
