"use client";
import { useAppSelector } from "@/redux/store";
import React from "react";
import CompanyCompleteProfile from "./CompanyCompleteProfile";
//import UserKYC from "./UserKYC";
import TalentCompleteProfile from "./TalentCompleteProfile";
//import LinkWalletStep from "./LinkWalletStep";

const GetStartedStepContent = () => {
  const { user } = useAppSelector((state) => state.auth);
  const currentStep = useAppSelector(
    (state) => state.getStartedSteps.currentStep
  );
  const role = user?.role;
  if (!role) return null;

  let stepToRender = <h1>Something Went Wrong ☹️</h1>;
  switch (currentStep) {
    case 1:
      if (role === "company") {
        stepToRender = <CompanyCompleteProfile />;
      } else if (role === "talent") {
        stepToRender = <TalentCompleteProfile />;
      }
      break;
    // case 2:
    //   stepToRender = <LinkWalletStep />;
    //   break;
    // case 2:
    //   stepToRender = <UserKYC />;
    //   break;
    default:
      break;
  }
  return <>{stepToRender}</>;
};

export default GetStartedStepContent;
