"use client"
import React from "react";
import JobDetailsTop from "@/components/details/job/JobDetailsTop";
//import { setStepAllowed, setStepTitle } from "@/redux/jobFlowSteps/jobFlowStepsSlice";
import { useAppSelector } from "@/redux/store";
import { getJobData } from "@/utils/helper";
import Link from "next/link";
import { applicationStatusBgColorMap } from "@/utils/constants";

const JobData = ({dataFor='company'}:{
  dataFor ?: Role
}) => {
  const jobData = useAppSelector((state) => {
    if(dataFor == 'company'){
      return state.jobFlowSteps.jobData
    }else{
      return state.talentJobFlowSteps.jobData;
    }
  });
  const applicationStatus = useAppSelector(state => state.talentJobFlowSteps.jobApplicationStatus);

  // useEffect(() => {
  //   //const shortlistedCount = jobData?.shortlistedCount ?? 0;
  //   const applicantCount = jobData?.applicantCount ?? 0;
  //   dispatch(setStepTitle({step:2, lbl: `Applicants(${applicantCount})`}));
  //   dispatch(setStepAllowed({step:2, allowed: (applicantCount <= 0) ? false : true}));
  //   dispatch(setStepAllowed({step:3, allowed: (applicantCount <= 0) ? false : true}));
  // },[dispatch, jobData?.applicantCount]);

  if (!jobData) return null;

  const {
    companyName,
    companyImage,
    jobTitle,
    location,
    postedOnRaw,
    compensation,
    currencyType,
    contractType,
    experienceLevel,
    jobDescriptionFormatted,
  } = getJobData(jobData);


  return (
    <>
      <div className="row">
        <div className="col-12 mb-4">
          {applicationStatus && (
            <span
              className={`bg-${applicationStatusBgColorMap[applicationStatus] ?? ""} text-white px-2 py-1 rounded fw-bold mb-2`}
            >
            Application Status: {applicationStatus?.toUpperCase()}
            </span>
          )}
          <div className="pull-right cursor-pointer fs-5 fw-bold">
            <Link
              href={`/job/${jobData?._id}`}
              data-text="View Job Details"
              target="_blank"
            >
              View Job<span className="la la-external-link"></span>
            </Link>
          </div>
        </div>
      </div>
      <JobDetailsTop
        data={{
          companyName,
          companyImage,
          jobTitle,
          location,
          compensation,
          postedOnRaw,
          currencyType,
          contractType,
          experienceLevel,
          jobDescriptionFormatted,
        }}
      />
    </>
  );
};

export default JobData;
