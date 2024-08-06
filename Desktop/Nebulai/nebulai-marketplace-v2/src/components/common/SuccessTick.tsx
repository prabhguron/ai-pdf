"use client"
import React from "react";

const SuccessTick = ({width="90", height="90"}) => {
  return (
    <div className="svg-container success-tick">
      <svg
        className="ft-green-tick"
        xmlns="http://www.w3.org/2000/svg"
        height={height}
        width={width}
        viewBox="0 0 48 48"
        aria-hidden="true"
      >
        <circle className="circle" fill="#5bb543" cx="24" cy="24" r="22" />
        <path
          className="tick"
          fill="none"
          stroke="#FFF"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          d="M14 27l5.917 4.917L34 17"
        />
      </svg>
    </div>
  );
};

export default SuccessTick;
