"use client";

import MainProfile from "@/components/talent/profile/MainProfile";
import SkillsBox from "@/components/talent/profile/skills/SkillsBox";
import WorkExperiences from "@/components/talent/profile/workExperience/WorkExperiences";
//import { nextStep } from "@/redux/getStartedSteps/getStartedStepsSlice";
import { useAppSelector } from "@/redux/store";
import React from "react";
import RequiredLabel from "../RequiredLabel";

const TalentCompleteProfile = () => {
  //const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const steps = useAppSelector((state) => state.getStartedSteps.steps);
  const role = user?.role;
  if (!role) return null;
  const currentStepInfo = steps.talent.completeProfile;

  if (!currentStepInfo?.active && !currentStepInfo?.allowed) return null;

  // const nextGetStartedStep = () => {
  //   dispatch(nextStep(role));
  // };
  return (
    <>
      <div className="fw-bold fs-3 mb-4">Complete Profile</div>
      <div className="border-top mt-1 mb-4"></div>
      <MainProfile />

      <div className="border-top mt-1 mb-4"></div>

        <div className="tabs-box">
          <div className="widget-title">
            <h3>Skills</h3>
            <RequiredLabel />
          </div>
          <div className="widget-content">
            <SkillsBox />
          </div>
        </div>

        <div className="border-top mt-1 mb-4"></div>

        <div className="tabs-box">
          <div className="widget-title p-2 justify-content-end">
            <RequiredLabel />
          </div>
          <div className="widget-content">
            <WorkExperiences />
          </div>
        </div>
   
      {/* <div className="d-flex justify-content-end step-actions mt-4 d-none">
        <button
          type="button"
          className={`theme-btn btn-style-one btn-small ${
            !currentStepInfo?.completed && "bg-secondary cursor-not-allowed"
          }`}
          onClick={nextGetStartedStep}
          disabled={!currentStepInfo?.completed}
        >
          NEXT
        </button>
      </div> */}
    </>
  );
};

export default TalentCompleteProfile;
