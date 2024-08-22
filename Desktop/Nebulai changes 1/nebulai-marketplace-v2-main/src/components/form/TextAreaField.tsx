"use client";
import { ErrorMessage, useField } from 'formik';
import React from 'react'

interface TextAreaProps {
    label: string;
    name: string;
}
  
type Field = { [key: string]: any } ;

type OtherProps = TextAreaProps & Field;

const TextAreaField : React.FC<OtherProps> = ({ label, name, ...props }) => {
    const [field, meta] = useField(name);
    return (
        <>
            <label htmlFor={props.id || props.name}>{label}</label>
            <textarea style={{ overflow: "auto" }} className={`textAreaCustom ${meta.touched && meta.error && 'is-invalid'}`} {...field} {...props} />
            <ErrorMessage component="div" name={field.name} className="error text-danger" />
        </>
    );
  };

export default TextAreaField