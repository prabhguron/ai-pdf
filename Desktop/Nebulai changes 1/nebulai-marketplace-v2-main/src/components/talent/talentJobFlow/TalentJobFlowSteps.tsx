"use client";
import {
  goToStep,
  resetTalentJobFlowStepSlice,
} from "@/redux/talentJobFlowSteps/talentJobFlowStepsSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import React from "react";
import { FaTimes } from "react-icons/fa";

const TalentJobFlowSteps = () => {
  const dispatch = useAppDispatch();
  const talentJobFlowSteps = useAppSelector(
    (state) => state.talentJobFlowSteps.steps
  );

  const cancel = () => {
    dispatch(resetTalentJobFlowStepSlice());
  };

  //   const applicantCount = useAppSelector((state) => state.jobFlowSteps.jobData?.applicantCount);

  //   useEffect(() => {
  //     if(!applicantCount) return;
  //     //const shortlistedCount = jobData?.shortlistedCount ?? 0;
  //     dispatch(setStepTitle({step:2, lbl: `Applicants(${applicantCount})`}));
  //     dispatch(setStepAllowed({step:2, allowed: (applicantCount <= 0) ? false : true}));
  //     dispatch(setStepAllowed({step:3, allowed: (applicantCount <= 0) ? false : true}));
  //   },[dispatch, applicantCount]);

  return (
    <div>
      <div className="row">
        <div className="col-11">
          <ul className="jobFlowNew">
            {talentJobFlowSteps.map((step) => {
              return (
                <li
                  className={`${step.active ? "active cursor-pointer" : ""} ${
                    !step.allowed ? "cursor-not-allowed whiteSmoke" : ""
                  }`}
                  key={step.step}
                  onClick={() => {
                    if (!step.allowed) return;
                    dispatch(goToStep(step.step));
                  }}
                >
                  <a
                    className={`${
                      !step.allowed
                        ? "cursor-not-allowed whiteSmoke"
                        : " whiteSmoke"
                    }`}
                  >
                    {!step?.smallTitle ? (
                      <>
                        <span>{step.title}</span>{" "}
                      </>
                    ) : (
                      <>
                        <span className="d-none d-sm-block">{step.title}</span>{" "}
                        <span className="d-sm-none">{step.smallTitle}</span>{" "}
                      </>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="col-1">

          <FaTimes
            className="fs-4 cursor-pointer float-end mt-2"
            onClick={cancel}
          />
        </div>
      </div>
    </div>
  );
};

export default TalentJobFlowSteps;
