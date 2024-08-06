/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import BreadCrumb from "@/components/common/BreadCrumb";
import DashBoardCardsCommon from "@/components/common/DashBoardCardsCommon";
import { RootState, useAppSelector } from "@/redux/store";
import DashboardOnBoardComplete from "@/components/common/Account/DashboardOnBoardComplete";
import GetStartedMain from "@/components/common/OnBoarding/GetStartedMain";

const TalentDashboard = () => {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const isOnboardingComplete = useAppSelector(
    (state) => state.getStartedSteps.profileStat?.isOnboardingComplete
  );
  return (
    <>
      {/* <CheckAuth/> */}
      {isOnboardingComplete && (
        <BreadCrumb title={`Welcome ${user?.firstName}`} />
      )}
      {/* breadCrumb */}

      {/* Collapsible sidebar button */}

      {isOnboardingComplete && (
        <div className="row">
          <DashBoardCardsCommon />
        </div>
      )}
      {/* End .row top card block */}

      <div className="row">
        <div className="col-lg-12">
          {/* <!-- applicants Widget --> */}
          <div className="applicants-widget ls-widget">
            {/* <div className="widget-title"></div> */}
            <div className="widget-content">
              <div className="row">
                {!isOnboardingComplete && <GetStartedMain />}
                {isOnboardingComplete && <DashboardOnBoardComplete />}
              </div>
            </div>
          </div>
        </div>
        {/* End .col */}
      </div>
      {/* End .row profile and notificatins */}
    </>
  );
};

export default TalentDashboard;
