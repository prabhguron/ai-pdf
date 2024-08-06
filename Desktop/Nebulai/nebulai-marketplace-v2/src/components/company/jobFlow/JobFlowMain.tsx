import React from "react";
import JobFlowSteps from "./JobFlowSteps";
import JobFlowStepContent from "./JobFlowStepContent";
// import { useAppDispatch, useAppSelector } from "@/redux/store";
// import { resetJobFlowStepSlice, setJobListingHidden } from "@/redux/jobFlowSteps/jobFlowStepsSlice";

const JobFlowMain = () => {
  //const dispatch = useAppDispatch();
  // const jobListingHidden = useAppSelector((state) => state.jobFlowSteps.jobListingHidden);
  
  // const showHideListing = () => {
  //   dispatch(setJobListingHidden(!jobListingHidden));
  // }
  // const cancel = () => {
  //   dispatch(resetJobFlowStepSlice());
  // }
  return (
    <>
      {/* <div className="row mb-3">
        <div className="col-12">
          <div className="d-flex pull-right cursor-pointer">
              <div className="mr-5">
                <button className="theme-btn btn-style-one btn-xs-round" onClick={cancel}>
                  Cancel
                </button>
              </div>
              <button className="theme-btn btn-style-one btn-xs-round" onClick={showHideListing}>
                {(jobListingHidden)? 'Show' : 'Hide'} Job Listing
              </button>
          </div>
        </div>
      </div> */}
      <div className="row">
        <div className="col-12">
          <JobFlowSteps />
          <JobFlowStepContent />
        </div>
      </div>
    </>
  );
};

export default JobFlowMain;