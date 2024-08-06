"use client"
import { useAppDispatch, useAppSelector } from "@/redux/store";
import React, { ComponentType } from "react";
import { FaCheck, FaUserAlt, FaUserShield, FaWallet } from "react-icons/fa";
import GetStartedStepContent from "@/components/common/Account/GetStartedStepContent";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { StepKeyOptions, goToStep } from "@/redux/getStartedSteps/getStartedStepsSlice";

const iconMap: Record<string, ComponentType<any>> = {
  FaUserAlt,
  FaUserShield,
  FaWallet,
};

const GetStarted = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const getStartedSteps = useAppSelector((state) => state.getStartedSteps);

  const role = user?.role;
  if (!role) return null;

  const steps = getStartedSteps.steps[role];
  const stepKeys = Object.keys(steps) as StepKeyOptions[];

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-md-12">
          <div className="container-fluid get-started-steps p-2 d-none">
            <div className="d-flex gap-4 justify-content-evenly">
              {stepKeys.map((stepKey, idx) => {
                const step = steps[stepKey];
                const IconComponent = iconMap[step.icon];
                const toolTipId = `step-${step.stepKey}`;

                return (
                  <React.Fragment key={`${idx}-${step.step}`}>
                    <ReactTooltip
                        id={toolTipId}
                        place="top"
                        className="getStartedStep"
                        >
                        {step.title}
                    </ReactTooltip>
                    <button
                      data-tooltip-id={toolTipId}
                      data-for={toolTipId}
                      className={`btn ${
                        step.allowed ? "bg-success" : "bg-secondary"
                      } text-white btn-sm rounded-pill get-started-step fs-4 ${
                        !step.allowed && "cursor-not-allowed"
                      }`}
                      onClick={() => {
                        if(!step.allowed) return;
                        dispatch(goToStep({role, step: step.step}))
                      }}
                    >
                    {step.completed ? (
                        <FaCheck className="mb-2"/>
                    ): <IconComponent className="mb-2" />}
                    </button>

                    {!(stepKeys.length - 1 === idx) ? (
                      <span
                        className={`${
                          step.allowed ? "bg-success" : "bg-secondary"
                        } w-50 rounded mt-auto mb-auto me-1 ms-1`}
                        style={{ height: "0.2rem" }}
                      ></span>
                    ) : (
                      ""
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>


          <div className="get-started-content p-4">
            <GetStartedStepContent/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
