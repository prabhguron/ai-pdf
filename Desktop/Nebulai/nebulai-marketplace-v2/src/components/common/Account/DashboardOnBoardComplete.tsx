/* eslint-disable react/no-unescaped-entities */
import { useAppSelector } from "@/redux/store";
import React from "react";
// import UserKYCRejectedMsg from "./UserKYCRejectedMsg";
// import UserKYCInProgressMsg from "./UserKYCInProgressMsg";
// import KYCRetry from "./KYCRetry";
import DashboardProfileCards from "../DashboardProfileCards";
import LinkWalletSection from "./LinkWalletSection";

const DashboardOnBoardComplete = () => {
  const { user } = useAppSelector((state) => state.auth);
  const role = user?.role;

  const isOnboardingComplete = useAppSelector(
    (state) => state.getStartedSteps.profileStat?.isOnboardingComplete
  );
  // const userKycCompleted = profileStat?.userKycCompleted;
  // const userKYCReviewStatus = profileStat?.userKYCReviewStatus ?? "notstarted";
  // const userKYCResult = profileStat?.userKYCResult;
  // const userKYCDecision = profileStat?.userKYCDecision;
  // const retryKYC = profileStat?.retryKYC;
  // const walletLinked = profileStat?.walletLinked;
  if (!role) return null;

  // if(userKYCResult === 'RED' && userKYCDecision ===  'FINAL'){
  //   return <UserKYCRejectedMsg/>
  // }

  // if (!userKycCompleted &&  ['init', 'pending'].includes(userKYCReviewStatus) && !userKYCDecision) {
  //   return <UserKYCInProgressMsg role={role}/>;
  // }

  // if(retryKYC && userKYCDecision === 'RETRY' && userKYCResult === 'RED') {
  //   // KYC Submission Form
  //   return <KYCRetry/>
  // }

  if(isOnboardingComplete){
  //if(userKycCompleted && userKYCResult === 'GREEN'){
    //If User Role is Talent. Dashboard will display company profile cards :else: talent profile cards
    return (
      <>
        {/* {!walletLinked && ( */}
        <LinkWalletSection/>
   
        <h3 className="mt-4">Recommended {role === 'company' ? 'Talents': 'Companies'}</h3>
        <DashboardProfileCards role={role === 'company' ? 'talent' : 'company'}/>
      </>
    )
  }

  return null;
};

export default DashboardOnBoardComplete;
