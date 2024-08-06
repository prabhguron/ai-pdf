"use client";
import JobsApi from "@/neb-api/JobsApi";
import Select, { ActionMeta, OnChangeValue } from "react-select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setSelectedShortlistedJob } from "@/redux/jobOffer/jobOfferSlice";

interface ShortlistedJob {
  applicationId: string;
  jobId: string;
  value: string;
  label: string;
}

const ShortlistedJobsDropdown = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const selectedShortlistedJob = useAppSelector(state => state.jobOffer.selectedShortlistedJob)
  const jobDropdownRef = useRef(null);
  const { getShortListedJobs } = JobsApi();

  const [currentJob, setCurrentJob] = useState<ShortlistedJob | null>(null);

  const { data: jobData, isLoading } = useQuery({
    queryFn: getShortListedJobs,
    queryKey: ["shortListedJobs"],
  });

  useEffect(() => {
    if(selectedShortlistedJob !== null){
      setCurrentJob(selectedShortlistedJob);
    }else{
      if (jobData && jobData.length && !currentJob) {
        setCurrentJob(jobData[0]);
        dispatch(setSelectedShortlistedJob(jobData[0]));
      }
      if (jobData && jobData.length <= 0 && currentJob) {
        setCurrentJob(null);
        dispatch(setSelectedShortlistedJob(null));
      }
    } 
    
  }, [jobData, currentJob]);

  const getJobApplicantsHandler = async (selectData: OnChangeValue<ShortlistedJob, false>, actionMeta: ActionMeta<ShortlistedJob>) => {
    queryClient.removeQueries(["shortListedApplicants", selectData?.jobId]);
    setCurrentJob(selectData);
    dispatch(setSelectedShortlistedJob(selectData));
  };

  return (
    <div className="search-box-one">
      <form method="post" action="#">
        <div className="form-group">
          <label htmlFor="allJobsDropdown">Jobs</label>
          <Select
            ref={jobDropdownRef}
            isDisabled={isLoading}
            isLoading={isLoading}
            className="short-listed-jobs"
            classNamePrefix="select"
            defaultValue={currentJob}
            value={currentJob}
            isSearchable={true}
            id="allJobsDropdown"
            name="allJobsDropdown"
            options={jobData}
            onChange={getJobApplicantsHandler}
          />
        </div>
      </form>
    </div>
  );
};

export default ShortlistedJobsDropdown;
