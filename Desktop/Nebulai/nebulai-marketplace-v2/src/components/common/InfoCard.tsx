"use client";
import React from "react";

interface InfoCardProps {
  uiClass: string;
  uiIcon: string;
  value: string;
  label: string;
}
const InfoCard = ({ uiClass, uiIcon, value, label }: InfoCardProps) => {
  return (
    <div className={`ui-item ${uiClass}`}>
      <div className="left">
        <i className={`icon la ${uiIcon}`}></i>
      </div>
      <div className="right">
        <h4 className="fw-bold">{value}</h4>
        <p className="fw-bold">{label}</p>
      </div>
    </div>
  );
};

export default InfoCard;
