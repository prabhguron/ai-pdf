"use client"
import React from "react";
import ContractSteps from "./ContractSteps";
import ContractStepContent from "./ContractStepContent";

const OfferCardBody = () => {

  return (
    <div className="card-body">
      <ContractSteps/>
      <ContractStepContent/>  
    </div>
  );
};

export default OfferCardBody;
