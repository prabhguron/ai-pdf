"use client";
import JobData from "@/components/company/jobFlow/JobData";
import { useAppSelector } from "@/redux/store";
import TalentReviewOffer from "./TalentReviewOffer";
import TalentContract from "./TalentContract";

// import JobFlowApplicants from "./JobFlowApplicants";
// import JobFlowShortlist from "./JobFlowShortlist";

const TalentJobFlowStepContent = () => {
  const currentStep = useAppSelector(
    (state) => state.talentJobFlowSteps.currentStep
  );

  let stepToRender = <h1>Something Went Wrong ☹️</h1>;
  switch (currentStep) {
    case 1:
      stepToRender = <JobData dataFor="talent"/>
      break;
    case 2:
      stepToRender = <TalentReviewOffer/>;
      break;
    case 3:
      stepToRender = <TalentContract/>;
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

export default TalentJobFlowStepContent;
