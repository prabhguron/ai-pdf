import { useAppSelector } from "@/redux/store";
import { profileWelcomeContent } from "@/utils/constants";
import React from "react";
import GetStartedWelcome from "@/components/common/OnBoarding/GetStartedWelcome";
import GetStarted from "@/components/common/OnBoarding/GetStarted";

const GetStartedMain = () => {
  const { user } = useAppSelector((state) => state.auth);
  const role: Role | "" = user?.role || "";
  const isOnboardingComplete: boolean =
    useAppSelector(
      (state) => state.getStartedSteps.profileStat?.isOnboardingComplete
    ) ?? false;
  const isOnboardingStarted: boolean =
    useAppSelector(
      (state) => state.getStartedSteps.profileStat?.isOnboardingStarted
    ) ?? false;
  const stepsInfo: WelcomeData | null =
    role !== "" ? profileWelcomeContent[role] : null;

  if (!isOnboardingComplete && !isOnboardingStarted && stepsInfo) {
    //Display Get Started Welcome Screen
    return <GetStartedWelcome welcomeMsg={stepsInfo?.welcome} />;
  }

  return <>{isOnboardingStarted && <GetStarted />}</>;
};

export default GetStartedMain;
