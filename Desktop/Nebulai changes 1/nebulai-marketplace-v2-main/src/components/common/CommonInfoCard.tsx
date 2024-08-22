"use client";
import React, { useState } from "react";
import { Form, Formik } from "formik";
import { TextField } from "@/components/form/TextField";
import * as Yup from "yup";
import SelectField from "@/components/form/SelectField";
import TextAreaField from "@/components/form/TextAreaField";

const validate = Yup.object().shape({
  name: Yup.string()
    .max(100, "Must be 100 characters or less")
    .required("Required"),
  description: Yup.string().max(1000, "Must be 1000 characters or less"),
  startYear: Yup.number()
    .typeError("Please select a year")
    .min(1900, "Year must be after 1900")
    .max(Yup.ref("endYear"), "Start year cannot be after end year")
    .required("Start year is required"),
  endYear: Yup.number()
    .typeError("Please select a year")
    .min(1900, "Year must be after 1900")
    .max(new Date().getFullYear(), "Year cannot be after the current year")
    .required("End year is required"),
});

const currentYear = new Date().getFullYear();
const yearOptions: {
  value: number | string;
  label: string;
}[] = [{ value: "", label: "Select" }];
for (let i = currentYear; i >= currentYear - 30; i--) {
  yearOptions.push({ value: i, label: i.toString() });
}

interface CommonInit {
  name: string;
  startYear: number | string;
  endYear: number | string;
  description: string;
  _id?: string;
}

const initialInfoValues: CommonInit = {
  name: "",
  startYear: "",
  endYear: "",
  description: "",
};

interface CommonInfoCardProps {
  info: any[];
  newInfoHandler: (values: any, options: any) => Promise<any>;
  deleteInfoHandler: (id: string) => void;
  editInfoHandler: ((values: any, options: any) => void) | null;
  editModeCallBack: ((updatedProjectInfo: any) => void) | null;
  defaultListIcon: React.ReactNode;
  submitLoader: boolean;
}

const CommonInfoCard = ({
  info = [],
  newInfoHandler,
  editInfoHandler = null,
  editModeCallBack = null,
  deleteInfoHandler,
  defaultListIcon,
  submitLoader = false,
}: CommonInfoCardProps) => {
  const [initValues, setInitValues] = useState(initialInfoValues);

  const populateForm = (formData: any) => {
    const updatedInfo = formData;
    setInitValues(updatedInfo);
    if (editModeCallBack) {
      editModeCallBack(updatedInfo);
    }
  };

  const resetFormEdit = () => {
    setInitValues(initialInfoValues);
    if (editModeCallBack) {
      editModeCallBack(initialInfoValues);
    }
  };

  const editActionHandler = async (infoValues: any, options: any) => {
    if (editInfoHandler === null) return;
    await editInfoHandler(infoValues, options);
    setInitValues(initialInfoValues);
  };

  return (
    <>
      <Formik
        initialValues={initValues}
        validationSchema={validate}
        onSubmit={initValues?._id ? editActionHandler : newInfoHandler}
        enableReinitialize
      >
        {(formik) => (
          <Form className="default-form">
            <div className="row">
              <div className="form-group col-lg-12 col-md-12">
                <TextField
                  label="Name"
                  name="name"
                  type="text"
                  autoComplete="off"
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <SelectField
                  label={"Start Year"}
                  name="startYear"
                  options={yearOptions}
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <SelectField
                  label={"End Year"}
                  name="endYear"
                  options={yearOptions}
                />
              </div>

              <div className="form-group col-lg-12 col-md-12">
                <TextAreaField
                  label="Description (Optional)"
                  name="description"
                />
              </div>
            </div>

            <div className="form-group col-lg-6 col-md-12">
              <button
                type="submit"
                className="theme-btn btn-style-one btn-small"
                disabled={submitLoader}
              >
                {submitLoader ? (
                  <>
                    Saving...{" "}
                    <span
                      className="spinner-border spinner-border-sm pl-4"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  </>
                ) : initValues?._id ? (
                  "SAVE CHANGES"
                ) : (
                  "ADD"
                )}
              </button>

              {formik.values?._id && (
                <button
                  type="button"
                  className="btn btn-small ml-5"
                  onClick={resetFormEdit}
                >
                  CANCEL
                </button>
              )}
            </div>
          </Form>
        )}
      </Formik>

      <div className="row">
        {info.map(({ name, startYear, endYear, description, _id }, idx) => (
          <div className="job-block col-lg-5 col-md-6 col-sm-12" key={idx}>
            <div className="inner-box">
              <div className="content">
                <span className="company-logo">
                  {defaultListIcon}
                  {/* <img
                    src={imgPreview}
                    width="200"
                    height={"200"}
                    alt="skill"
                    className="rounded"
                  /> */}
                </span>
                <h4>{name}</h4>

                <ul className="job-other-info cert-or-skill">
                  <li className={`time text-nowrap`}>
                    {startYear}-{endYear}
                  </li>
                </ul>
                <div className="row">
                  <div className="col-6 col-lg-4 offset-4 offset-md-4 offset-lg-5 offset-xl-6">
                    <button
                      type="button"
                      data-text="remove"
                      onClick={() => {
                        if (_id) {
                          deleteInfoHandler(_id);
                        }
                      }}
                      className="cursor-pointer float-end"
                    >
                      <span className="la la-trash"></span>
                    </button>
                  </div>
                  {editInfoHandler && (
                    <div className="col-2 col-sm-2 col-lg-2">
                      <button
                        type="button"
                        data-text="edit"
                        className="cursor-pointer text-center"
                        onClick={() => {
                          if (_id) {
                            populateForm({
                              name,
                              startYear,
                              endYear,
                              description,
                              _id,
                            });
                          }
                        }}
                      >
                        <span className="la la-edit"></span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CommonInfoCard;
