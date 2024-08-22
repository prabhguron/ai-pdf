"use client";
import { useAppSelector } from "@/redux/store";
import JobData from "./JobData";
import JobFlowApplicants from "./JobFlowApplicants";
import JobFlowShortlist from "./JobFlowShortlist";

const JobFlowStepContent = () => {
  const currentStep = useAppSelector(
    (state) => state.jobFlowSteps.currentStep
  );

  let stepToRender = <h1>Something Went Wrong ☹️</h1>;
  switch (currentStep) {
    case 1:
      stepToRender = <JobData/>
      break;
    case 2:
      stepToRender = <JobFlowApplicants/>;
      break;
    case 3:
      stepToRender = <JobFlowShortlist />;
      break;
    case 4:
      stepToRender = <h1> Contract..</h1>;
      break;
    default:
      break;
  }

  return (
    <div className="row p-2 mt-3">
      <div className="col-12 tab-content short-list-tab-content">
        {stepToRender}
      </div>
    </div>
  );
};

export default JobFlowStepContent;
