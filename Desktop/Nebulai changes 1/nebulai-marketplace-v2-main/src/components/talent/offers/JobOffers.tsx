"use client";
import BreadCrumb from "@/components/common/BreadCrumb";
import React from "react";
import CompleteOnBoarding from "@/components/common/CompleteOnBoarding";
import JobOffersBoard from "./JobOffersBoard";

const JobOffers = () => {
  return (
    <>
      <BreadCrumb title="My Job Offers" />
      <div className="row">
        <div className="col-lg-12">
          <div className="ls-widget">
            <CompleteOnBoarding>
              <JobOffersBoard />
            </CompleteOnBoarding>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobOffers;
