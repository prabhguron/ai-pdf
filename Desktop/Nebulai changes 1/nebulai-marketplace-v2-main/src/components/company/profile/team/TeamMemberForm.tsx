"use client";
import React, { useState } from "react";
import { Form, Formik } from "formik";
import { TextField } from "@/components/form/TextField";
import * as Yup from "yup";
import TextAreaField from "@/components/form/TextAreaField";

const validate = Yup.object().shape({
  name: Yup.string()
    .max(100, "Must be 100 characters or less")
    .required("Required"),
  jobTitle: Yup.string()
    .max(30, "Must be 30 characters or less")
    .required("Required"),
  bio: Yup.string().max(1000, "Must be 1000 characters or less"),
});

const initialFormValues: TeamMember = {
  name: "",
  jobTitle: "",
  bio: "",
};

interface TeamMemberFormProps {
  info: TeamMember[];
  newInfoHandler: (values: TeamMember, options: any) => Promise<any>;
  deleteInfoHandler: (id: string) => void;
  editInfoHandler: ((values: TeamMember, options: any) => void) | null;
  editModeCallBack: ((updatedProjectInfo: TeamMember) => void) | null;
  defaultListIcon: React.ReactNode;
  submitLoader: boolean;
  caseStudyImgKey?: string;
}

const TeamMemberForm = ({
  info = [],
  newInfoHandler,
  deleteInfoHandler,
  editInfoHandler = null,
  editModeCallBack = null,
  defaultListIcon,
  submitLoader = false,
}: TeamMemberFormProps) => {
  const [initValues, setInitValues] = useState(initialFormValues);

  const populateForm = (formData: TeamMember) => {
    const updatedTeamMemberInfo = formData;
    setInitValues(updatedTeamMemberInfo);
    if (editModeCallBack) {
      editModeCallBack(updatedTeamMemberInfo);
    }
  };

  const resetFormEdit = () => {
    setInitValues(initialFormValues);
    if (editModeCallBack) {
      editModeCallBack(initialFormValues);
    }
  };

  const editActionHandler = async (infoValues: TeamMember, options: any) => {
   if(editInfoHandler){
    await editInfoHandler(infoValues, options);
    setInitValues(initialFormValues);
   }
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
              <div className="form-group col-lg-6 col-md-12">
                <TextField
                  label="Name"
                  name="name"
                  type="text"
                  autoComplete="off"
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <TextField
                  label="Job Title"
                  name="jobTitle"
                  type="text"
                  autoComplete="off"
                />
              </div>

              <div className="form-group col-lg-12 col-md-12">
                <TextAreaField label="Bio (Optional)" name="bio" />
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
        {info.map(({ name, jobTitle, bio, _id }, idx) => (
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
                  <li className={`time`}>{jobTitle}</li>
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
                            populateForm({ name, jobTitle, bio, _id });
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

export default TeamMemberForm;
