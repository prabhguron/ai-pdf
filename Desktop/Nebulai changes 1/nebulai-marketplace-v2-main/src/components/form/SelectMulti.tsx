"use client";
import React from "react";
import Select, { Props } from "react-select";

const SelectMulti: React.FC<Props> = (props) => {
  return (
    <>
      <Select
        styles={{
          menu: (provided) => ({ ...provided, zIndex: 9999 }),
          multiValueLabel: (styles, { data }) => ({
            ...styles,
            color: "hsl(0, 0%, 20%)",
            backgroundColor: "hsl(0, 0%, 90%)",
          }),
          multiValueRemove: (styles, { data }) => ({
            ...styles,
            color: "hsl(0, 0%, 20%)",
            backgroundColor: "hsl(0, 0%, 90%)",
          }),
        }}
        theme={(theme: any) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary25: "#f0f5f7",
            primary: "#ab31ff",
          },
        })}
        classNamePrefix="select"
        isSearchable={true}
        isMulti
        {...props}
      />
    </>
  );
};

export default SelectMulti;
