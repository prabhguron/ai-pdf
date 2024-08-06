/* eslint-disable react/no-unescaped-entities */
"use client";
import React from "react";
import BreadCrumb from "@/components/common/BreadCrumb";
import DashBoardCardsCommon from "@/components/common/DashBoardCardsCommon";
import { useAppSelector } from "@/redux/store";
import DashboardOnBoardComplete from "@/components/common/Account/DashboardOnBoardComplete";
import GetStartedMain from "@/components/common/OnBoarding/GetStartedMain";

const CompanyDashboard = () => {
  const profileStat = useAppSelector(
    (state) => state.getStartedSteps.profileStat
  );
  const completedAllSteps = profileStat?.isOnboardingComplete;
  return (
    <>
      {/* <CheckAuth/> */}
      <BreadCrumb title={`${completedAllSteps ? "Dashboard Home!" : ""}`} />
      {/* breadCrumb */}

      {completedAllSteps && (
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
                {/* <!-- Candidate block three --> */}
                {!completedAllSteps && <GetStartedMain />}
                {completedAllSteps && <DashboardOnBoardComplete />}
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

export default CompanyDashboard;
