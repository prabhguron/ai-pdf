import React from 'react';
import { ErrorMessage, useField } from 'formik';

interface TextFieldProps {
  label: string;
  name: string;
}

type Field = { [key: string]: any } ;

type OtherProps = TextFieldProps & Field;

export const TextField: React.FC<OtherProps> = ({ label, name, ...props }) => {
  const [field, meta] = useField(name);
  return (
    <div className="">
      <label htmlFor={field.name}>{label}</label>
      <input
        className={`form-control ${props?.customclasses ?? ''} ${meta.touched && meta.error && 'is-invalid'}`}
        {...field} {...props}
        autoComplete="off"
      />
      <ErrorMessage component="div" name={field.name} className="error text-danger" />
    </div>
  )
}