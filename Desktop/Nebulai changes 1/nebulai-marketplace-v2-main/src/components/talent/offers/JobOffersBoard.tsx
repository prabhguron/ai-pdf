"use client";
import React from "react";
import JobOffersDropdown from "./JobOffersDropdown";
import JobOfferCard from "./JobOfferCard";

const JobOffersBoard = () => {

  return (
    <div className="tabs-box">
      <div className="widget-title d-block">
          <JobOffersDropdown/>
      </div>
      <div className="widget-content">
        <JobOfferCard/>
      </div>
    </div>
  );
};

export default JobOffersBoard;
