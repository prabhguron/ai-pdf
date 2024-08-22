"use client";
import React from "react";
//import ShortListBoard from "../shortlists/ShortListBoard";
import { useAppSelector } from "@/redux/store";
import ShortlistedJobApplicantsNew from "../shortlists/ShortlistedJobApplicantsNew";

const JobFlowShortlist = () => {
  const stepActive = useAppSelector(
    (state) => state.jobFlowSteps.steps[2]?.active
  );

  if (!stepActive) return null;
  return (
    <>
      <ShortlistedJobApplicantsNew />
    </>
  );
};

export default JobFlowShortlist;
