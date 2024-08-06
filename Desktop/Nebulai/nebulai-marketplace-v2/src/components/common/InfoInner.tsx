import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import { Tooltip as ReactTooltip } from "react-tooltip";
interface InfoInnerProps {
  iconSpanElement: React.ReactNode;
  value: any;
  label: any;
  toolTip?: boolean;
  toolTipText?: string | React.ReactNode;
}
const InfoInner = ({
  iconSpanElement,
  label,
  value,
  toolTip,
  toolTipText,
}: InfoInnerProps) => {
  return (
    <>
      <div className="inner-box py-2">
        <div className="content text-break">
          <span className="icon">{iconSpanElement}</span>
          <h4 className="fw-bold">
            {label}
            {toolTip && (
              <>
                {"   "}
                <FaInfoCircle
                  className="cursor-pointer"
                  data-tooltip-id={`tooltip-${label}`}
                  data-for={`tooltip-${label}`}
                />
              </>
            )}
          </h4>
          <p className="fw-bold">
            {typeof value === "string" ? (
              <a href="#" className="fw-bold">
                {value}
              </a>
            ) : (
              value
            )}
          </p>
        </div>
      </div>
      {toolTip && (
        <ReactTooltip
          id={`tooltip-${label}`}
          place="top"
          className="alertBackdropZIndex"
        >
          {toolTipText}
        </ReactTooltip>
      )}
    </>
  );
};

export default InfoInner;
