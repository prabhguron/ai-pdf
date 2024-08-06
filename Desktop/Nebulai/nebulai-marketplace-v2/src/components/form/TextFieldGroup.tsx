"use client"
import React from "react";
import { ErrorMessage, useField } from "formik";

interface TextFieldGroupProps {
  label: string;
  name: string;
  groupIcon: string | React.ReactNode;
  type: string
}

type Field = { [key: string]: any } ;

type OtherProps = TextFieldGroupProps & Field;

export const TextFieldGroup = ({ label, name, type, groupIcon, ...props }: OtherProps) => {
  const [field, meta] = useField(name);
  return (
    <div className="mb-2">
      <label htmlFor={field.name}>{label}</label>
      <div className="input-group flex-nowrap">
        <span className="input-group-text" id={field.name}>
          {groupIcon}
        </span>
        <input
          type={type}
          placeholder={label}
          aria-label={label}
          aria-describedby={field.name}
          autoComplete="off"
          className={`form-control ${
            meta.touched && meta.error && "is-invalid"
          }`}
          {...field}
          {...props}
        />
      </div>
      <ErrorMessage
        component="div"
        name={field.name}
        className="error text-danger"
      />
    </div>
  );
};
