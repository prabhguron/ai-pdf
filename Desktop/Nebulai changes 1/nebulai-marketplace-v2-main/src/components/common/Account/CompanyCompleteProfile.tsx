"use client";
import MainProfile from "@/components/company/profile/MainProfile";
//import { nextStep } from "@/redux/getStartedSteps/getStartedStepsSlice";
import { useAppSelector } from "@/redux/store";
import React from "react";

const CompanyCompleteProfile = () => {
  //const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const steps = useAppSelector((state) => state.getStartedSteps.steps);
  const role = user?.role;
  if (!role) return null;
  const currentStepInfo = steps.company.completeProfile;
  
  if (!currentStepInfo?.active && !currentStepInfo?.allowed) return null;

  // const nextGetStartedStep = () => {
  //   dispatch(nextStep(role));
  // }
  return (
    <>
      <div className="fw-bold fs-3 mb-4">Complete Your Profile 👩‍💻</div>
      <div className="border-top mt-1 mb-4"></div>
      <MainProfile />
      {/* <div className="d-flex justify-content-end step-actions d-none">
        <button
          type="button"
          className={`theme-btn btn-style-one btn-small ${(!currentStepInfo?.completed) && 'bg-secondary cursor-not-allowed'}`}
          onClick={nextGetStartedStep}
          disabled={!currentStepInfo?.completed}
        >
          NEXT
        </button>
      </div> */}
    </>
  );
};

export default CompanyCompleteProfile;
