// import { useAppDispatch, useAppSelector } from "@/redux/store";
// import { resetTalentJobFlowStepSlice, setApplicationListingHidden } from "@/redux/talentJobFlowSteps/talentJobFlowStepsSlice";
import React from "react";
import TalentJobFlowSteps from "./TalentJobFlowSteps";
import TalentJobFlowStepContent from "./TalentJobFlowStepContent";

const TalentJobFlowMain = () => {
  // const dispatch = useAppDispatch();
  // const applicationListingHidden = useAppSelector(
  //   (state) => state.talentJobFlowSteps.applicationListingHidden
  // );

  // const showHideListing = () => {
  //   dispatch(setApplicationListingHidden(!applicationListingHidden));
  // };
  // const cancel = () => {
  //   dispatch(resetTalentJobFlowStepSlice());
  // };
  return (
    <>
      {/* <div className="row mb-3">
        <div className="col-12">
          <div className="d-flex pull-right cursor-pointer">
            <div className="mr-5">
              <button
                className="theme-btn btn-style-one btn-xs-round"
                onClick={cancel}
              >
                Cancel
              </button>
            </div>
            <button
              className="theme-btn btn-style-one btn-xs-round"
              onClick={showHideListing}
            >
              {applicationListingHidden ? "Show" : "Hide"} Application Listing
            </button>
          </div>
        </div>
      </div> */}
      <div className="row">
        <div className="col-12">
          <TalentJobFlowSteps />
          <TalentJobFlowStepContent/>
        </div>
      </div>
    </>
  );
};

export default TalentJobFlowMain;
