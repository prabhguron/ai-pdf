import React from "react";
import { ErrorMessage, useField } from "formik";

interface CheckBoxProps {
  label: string;
  name: string;
  value?: boolean;
}

type Field = { [key: string]: any };

type OtherProps = CheckBoxProps & Field;

const CheckBoxField: React.FC<OtherProps> = ({
  label,
  name,
  value,
  ...props
}) => {
  const [field, meta] = useField(name);
  return (
    <div className="input-group checkboxes square mb-2">
      <input
        className={`form-control ${meta.touched && meta.error && "is-invalid"}`}
        {...field}
        {...props}
        type="checkbox"
        name={field.name}
        id={field.name}
        checked={value ? true : false}
      />
      <label htmlFor={field.name} className={field.name}>
        <span className="custom-checkbox"></span> {label}
      </label>
      <ErrorMessage
        component="div"
        name={field.name}
        className="error text-danger mt-2 mb-2"
      />
    </div>
  );
};

export default CheckBoxField;
