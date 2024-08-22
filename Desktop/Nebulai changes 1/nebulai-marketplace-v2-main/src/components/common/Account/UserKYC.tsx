import KYCForm from "@/components/KYC/KYCForm";
import { goToStep } from "@/redux/getStartedSteps/getStartedStepsSlice";

import { useAppDispatch, useAppSelector } from "@/redux/store";
import React from "react";

const UserKYC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const steps = useAppSelector((state) => state.getStartedSteps.steps);
  const role = user?.role;
  if (!role) return null;
  const currentStepInfo = steps[role].userKyc;
  if (!currentStepInfo?.active && !currentStepInfo?.allowed) return null;
  return (
    <>
      <div className="fw-bold fs-3 mb-4">User KYC</div>
      <div className="border-top mt-1 mb-4"></div>
      <div className="mb3rem">
        <KYCForm path="onboarding"/>
      </div>
      <div className="d-flex justify-content-between step-actions">
        <button
          type="button"
          className={`theme-btn btn-style-one btn-small`}
          onClick={() => {
            dispatch(goToStep({ role, step: currentStepInfo.step - 1 }));
          }}
        >
          PREV
        </button>
      </div>
    </>
  );
};

export default UserKYC;
