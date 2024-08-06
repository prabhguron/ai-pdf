"use client";
import React from "react";
interface CommonButtonProps {
  isLoading?: boolean;
  loadingText?: string;
  btnLabel: string | React.ReactNode;
  customClasses?: string;
}

type Field = { [key: string]: any };

type OtherProps = CommonButtonProps & Field;

const CommonButton: React.FC<OtherProps> = ({
  isLoading,
  loadingText = "Please Wait...",
  btnLabel = "",
  customClasses = "",
  ...props
}: CommonButtonProps) => {
  return (
    <button
      type="button"
      className={`theme-btn btn-style-one ${customClasses} fw-bold`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          {loadingText}{" "}
          <span
            className="spinner-border spinner-border-sm pl-4"
            role="status"
            aria-hidden="true"
          ></span>
        </>
      ) : (
        btnLabel
      )}
    </button>
  );
};

export default CommonButton;
