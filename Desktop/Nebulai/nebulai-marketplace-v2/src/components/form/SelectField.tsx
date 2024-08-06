"use client"
import React, { useEffect } from 'react'
import { ErrorMessage, Field, useField } from 'formik';
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

interface SelectFieldProps {
  label: string;
  name: string;
  onChangeCallback?: (value: any) => void;
}

type Field = { [key: string]: any } ;

type OtherProps = SelectFieldProps & Field;

const SelectField = ({label, onChangeCallback, defaultValue, ...props}: OtherProps) => {
  const [field, meta, helpers] = useField(props);
  const { setValue } = helpers;

  useEffect(() => {
    if(defaultValue) {
      setValue(defaultValue)
    }
  },[defaultValue])

  return (
    <>
        <label>{label}</label>
        <Field
            {...field} {...props}
            component={props?.inputType === 'creatable' ? CreatableSelect : Select}
            options={props?.options || []}
            className={`${meta.touched && meta.error && 'is-invalid'}`}
            onChange={(valueMeta:{value: string}) => {
                if(valueMeta?.value) {
                  const {value} = valueMeta
                  setValue(value)
                }else{
                  setValue(valueMeta)
                }
                onChangeCallback?.(valueMeta);
            }}
            value={props?.isMulti ? field.value : props?.options?.find((option:{value: string}) => option.value === field.value)}
            theme={(theme: any) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary25: '#f0f5f7',
                  primary: '#ab31ff',
                },
            })}
        />
        <ErrorMessage component="div" name={field.name} className="error text-danger" render={(errorMessages: string[] | string) => {
          let errMsgs = errorMessages;
          if(typeof errorMessages === 'object'){
            errMsgs = errorMessages?.map((e:any) => e.value).join(', ')
          }
          return <div className='error text-danger'>{errMsgs}</div>
        }} />
    </>
  )
}

export default SelectField