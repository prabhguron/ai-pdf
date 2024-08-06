/* eslint-disable react/no-unescaped-entities */
"use client";

import { setOnBoardingStarted } from "@/redux/getStartedSteps/getStartedStepsSlice";
import { useAppDispatch } from "@/redux/store";
import Image from "next/image";
import React from "react";

const GetStartedWelcome = ({ welcomeMsg }: { welcomeMsg: string }) => {
  const dispatch = useAppDispatch();
  return (
    <div className="get-started-welcome p-4">
      <h3 className="text-center mb-4 fw-bold">
        <span>🚀 Let's get you set up with </span>
        <span>Nebulai</span>
      </h3>
      <div className="d-flex justify-content-center mb-3 p-4">
        <Image
          src="/img/welcome.png"
          alt="Nebulai Get Started"
          width={250}
          height={250}
        />
      </div>
      <div className="text-center">
        <p className="fs-4">{welcomeMsg}</p>
        <button
          className="theme-btn btn-style-one w-full mb-4 fw-bold"
          type="button"
          onClick={() => {dispatch(setOnBoardingStarted(true))}}
        >
          GET STARTED
        </button>
      </div>
    </div>
  );
};

export default GetStartedWelcome;
