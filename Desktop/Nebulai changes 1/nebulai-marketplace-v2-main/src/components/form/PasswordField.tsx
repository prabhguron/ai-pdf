import React, { useEffect, useState } from "react";
import { ErrorMessage, useField } from "formik";
import zxcvbn from "zxcvbn";
import "./passwordField.css";

interface PasswordFieldProps {
  label: string;
  name: string;
  minStrength?: number;
  thresholdLength?: number;
  value?: string;
}

type Field = { [key: string]: any };

type OtherProps = PasswordFieldProps & Field;

export const PasswordField: React.FC<OtherProps> = ({
  label,
  name,
  minStrength = 3,
  thresholdLength = 7,
  value,
  ...props
}) => {
  const [field, meta, helpers] = useField(name);
  const [password, setPassword] = useState(value ? value : "");
  const [strength, setStrength] = useState(0);
  const [inputType, setInputType] = useState("password");

  useEffect(() => {
    if (value) {
      setStrength(zxcvbn(value).score);
    }
  }, []);

  const passwordLength = password?.length || 0;
  const passwordStrong = strength >= minStrength;
  const passwordLong = passwordLength > thresholdLength;

  const counterClass = [
    "badge badge-pill",
    passwordLong
      ? passwordStrong
        ? "badge-success"
        : "badge-warning"
      : "badge-danger",
  ]
    .join(" ")
    .trim();

  const strengthClass = [
    "strength-meter mt-2",
    passwordLength > 0 ? "visible" : "invisible",
  ]
    .join(" ")
    .trim();

  const stateChanged = (e: any) => {
    helpers.setValue(e.target.value);
    setPassword(e.target.value);
    setStrength(zxcvbn(e.target.value).score);
    validatePasswordStrong(e.target.value);
  };

  const validatePasswordStrong = (value: any) => {
    try {
      if (value.length <= thresholdLength)
        throw new Error("Password must be more than 7 characters.");
      if (zxcvbn(value).score < minStrength)
        throw new Error(
          "Password is weak, must contain one number, uppercase, lowercase & special characters.",
        );
    } catch (error: any) {
      helpers.setError(error?.message);
    }
  };

  const showHidePassword = () => {
    setInputType(inputType === "password" ? "text" : "password");
  };

  return (
    <div className="mb-2">
      <label htmlFor={field.name}>{label}</label>
      <div className="position-absolute password-count mx-3">
        <span className={counterClass}>
          {passwordLength
            ? passwordLong
              ? `${thresholdLength}+`
              : passwordLength
            : ""}
        </span>
      </div>
      <div className={strengthClass}>
        <div className="strength-meter-fill" data-strength={strength}></div>
      </div>

      <div className="input-group flex-nowrap">
        <input
          className={`form-control ${meta.touched && meta.error && ""}`}
          {...field}
          {...props}
          autoComplete="off"
          onChange={stateChanged}
          value={value ? value : password}
          type={inputType}
        />
        <span
          className="input-group-text togglePassword border-0 cursor-pointer"
          onClick={showHidePassword}
        >
          <span
            className={`fa fa-eye${inputType !== "password" ? "-slash" : ""}`}
          ></span>
        </span>
      </div>
      <ErrorMessage
        component="div"
        name={field.name}
        className="error text-danger"
        render={(errorMessages: string[] | string) => {
          let errMsgs = errorMessages;
          if (typeof errorMessages === "object") {
            errMsgs = errorMessages?.map((e: any) => e.value).join(", ");
          }
          return <div className="error text-danger">{errMsgs}</div>;
        }}
      />
    </div>
  );
};
