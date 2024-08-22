"use client"
import React from "react";
import OfferDetails from "./OfferDetails";
import JobOfferActions from "./JobOfferActions";

const JobOfferCardBody = () => {
  return (
    <div className="mt-4">
      <div className="row">
        <div className="col-12">
          <OfferDetails fetchJobInfo={true}/>
        </div>
      </div>
      <JobOfferActions />
    </div>
  );
};

export default JobOfferCardBody;
