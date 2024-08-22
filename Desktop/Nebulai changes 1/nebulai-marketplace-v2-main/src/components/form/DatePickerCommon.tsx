"use client"
import React from "react";
import { ErrorMessage, Field, useField } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

interface DateFieldProps {
  label?: string;
  name: string;
}

type Field = { [key: string]: any } ;

type OtherProps = DateFieldProps & Field;

const DatePickerCommon = ({ label, ...props }: OtherProps) => {
  const [field, meta, helpers] = useField(props);
  const { setValue } = helpers;
  return (
    <>
      <label htmlFor={field.name}>{label}</label>
      <Field
        {...field}
        {...props}
        component={DatePicker}
        id={field.name}
        className={`${meta.touched && meta.error && "is-invalid"}`}
        onChange={(val: string) => {
          var dateVal = moment(val);
          setValue(dateVal?.format("MM-DD-YYYY"));
        }}
        value={field.value}
        autoComplete="off"
        minDate={moment().add(1,'days').toDate()}
        dateFormat="MM-DD-YYYY"
      />
      <ErrorMessage
        component="div"
        name={field.name}
        className="error text-danger"
      />
    </>
  );
};

export default DatePickerCommon;
