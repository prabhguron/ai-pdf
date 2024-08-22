"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import JobApplicationApi from "@/neb-api/JobApplicationApi";
import { useQuery } from "@tanstack/react-query";
import { JobSelect } from "./jobOfferTypes";
import { setSelectedTalentJobOffer } from "@/redux/jobOffer/jobOfferSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";

const JobOffersDropdown = () => {
  const dispatch = useAppDispatch();
  const { getJobNamesTalentOffer } = JobApplicationApi();
  const [currentJob, setCurrentJob] = useState<JobSelect | null>(null);
  const selectedTalentJobOffer = useAppSelector(state => state.jobOffer.selectedTalentJobOffer)


  const { data: jobOfferData, isLoading } = useQuery({
    queryFn: getJobNamesTalentOffer,
    queryKey: ["talentJobOffers"],
  });

  useEffect(() => {
    if(selectedTalentJobOffer !== null){
      setCurrentJob(selectedTalentJobOffer);
    }else{
      if (jobOfferData && jobOfferData.length && !currentJob) {
        setCurrentJob(jobOfferData[0]);
        dispatch(setSelectedTalentJobOffer(jobOfferData[0]));
      }
      if (jobOfferData && jobOfferData.length <= 0 && currentJob) {
        setCurrentJob(null);
        dispatch(setSelectedTalentJobOffer(null));
      }
    } 
  }, [jobOfferData, currentJob]);

  const getJobApplicantsHandler = async (selectData: JobSelect | null) => {
    setCurrentJob(selectData);
    dispatch(setSelectedTalentJobOffer(selectData));
  };

  return (
    <div className="search-box-one">
      <form method="post" action="#">
        <div className="form-group">
          <label htmlFor="allJobsDropdown">Jobs</label>
          <Select
            isDisabled={isLoading}
            isLoading={isLoading}
            className="short-listed-jobs"
            classNamePrefix="select"
            defaultValue={currentJob}
            value={currentJob}
            isSearchable={true}
            id="allJobsDropdown"
            name="allJobsDropdown"
            options={jobOfferData}
            onChange={getJobApplicantsHandler}
          />
        </div>
      </form>
    </div>
  );
};

export default JobOffersDropdown;
