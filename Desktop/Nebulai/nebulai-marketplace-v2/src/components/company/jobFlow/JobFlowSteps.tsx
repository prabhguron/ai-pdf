"use client";
import {
  goToStep,
  resetJobFlowStepSlice,
  setStepAllowed,
  setStepTitle,
} from "@/redux/jobFlowSteps/jobFlowStepsSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const JobFlowSteps = () => {
  const dispatch = useAppDispatch();
  const jobFlowSteps = useAppSelector((state) => state.jobFlowSteps.steps);
  const applicantCount = useAppSelector(
    (state) => state.jobFlowSteps.jobData?.applicantCount
  );

  useEffect(() => {
    if (!applicantCount) return;
    //const shortlistedCount = jobData?.shortlistedCount ?? 0;
    dispatch(setStepTitle({ step: 2, lbl: `Applicants(${applicantCount})` }));
    dispatch(
      setStepAllowed({ step: 2, allowed: applicantCount <= 0 ? false : true })
    );
    dispatch(
      setStepAllowed({ step: 3, allowed: applicantCount <= 0 ? false : true })
    );
  }, [dispatch, applicantCount]);


  const cancel = () => {
    dispatch(resetJobFlowStepSlice());
  };

  return (
    <div>
      <div className="row">
        <div className="col-11">
          <ul className="jobFlowNew">
            {jobFlowSteps.map((step) => {
              return (
                <li
                className={`${step.active ? "active cursor-pointer" : ""} ${
                  !step.allowed ? "cursor-not-allowed whiteSmoke" : ""
                }`}
                key={step.step}
                onClick={() => {
                  if(!step.allowed) return;
                  dispatch(goToStep(step.step));
                }}
              >
                <a className={`${!step.allowed ? "cursor-not-allowed whiteSmoke" :" whiteSmoke"}`}>
                  {!step?.smallTitle ? (
                    <>
                      <span>{step.title}</span>{" "}
                    </>
                  ) : (
                    <>
                      <span className="d-none d-sm-block">
                        {step.title}
                      </span>{" "}
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
          <FaTimes className="fs-4 cursor-pointer float-end mt-2" onClick={cancel} />
        </div>
      </div>

      {/* <div className="jobFlowStepsContainer d-flex justify-content-between mt-2">
        <div className="jobFlowWrapper">
          <div className="arrow-steps clearfix">
            {jobFlowSteps.map((step) => {
              return (
                <div
                  className={`jobFlowStep 
                    ${step.active && "current"}
                    ${!step.allowed ? "disabledDiv" : ""}
                    cursor-pointer
                    `}
                  key={step.step}
                  onClick={() => {
                    dispatch(goToStep(step.step));
                  }}
                >
                  {" "}
                  <span>{step.title}</span>{" "}
                </div>
              );
            })}
          </div>
        </div>
        <div className="">
          <FaTimes className="fs-4 cursor-pointer" onClick={cancel} />
        </div>
      </div> */}
    </div>
  );
};

export default JobFlowSteps;
