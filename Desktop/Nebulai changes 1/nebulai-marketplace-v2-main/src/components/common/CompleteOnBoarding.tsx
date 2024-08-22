"use client";
import { useAppSelector } from "@/redux/store";
import Link from "next/link";
import React from "react";

const CompleteOnBoarding = ({ children }: { children: React.ReactNode }) => {
  const { loadingUserProfile, user } = useAppSelector((state) => state.auth);
  const profileStat = useAppSelector(
    (state) => state.getStartedSteps.profileStat
  );
  if (profileStat?.isOnboardingComplete) {
    return <>{children}</>;
  }

  if (loadingUserProfile) {
    return <></>;
  }

  return (
    <div className="text-center p-11rem fw-bolder">
      Please Complete Your Onboarding Steps <br />
      <Link href={`/${user?.role}/dashboard`}>Go To Dashboard</Link>
    </div>
  );
};

export default CompleteOnBoarding;
