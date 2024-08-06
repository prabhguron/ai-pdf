"use client";
import React, { useState } from "react";
import { Form, Formik } from "formik";
import { TextField } from "@/components/form/TextField";
import * as Yup from "yup";
import TextAreaField from "@/components/form/TextAreaField";
import { getLastSegment, responsiveShortUrl } from "@/utils/helper";
import ImgDropzone from "@/components/form/ImgDropzone";
import useWindowWidth from "@/hooks/useWindowWidth";

const validate = Yup.object().shape({
  clientName: Yup.string()
    .max(100, "Must be 100 characters or less")
    .required("Required"),
  description: Yup.string().max(1000, "Must be 1000 characters or less"),
  url: Yup.string()
    .matches(
      /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
      "Enter valid url!",
    )
    .required("Required"),
  caseStudiesImages: Yup.array()
    .max(3, "You can select up to 3 images only")
    .of(
      Yup.mixed()
        .test(
          "fileSize",
          "File size must be less than 20MB",
          (value: any) => value && value.size <= 20971520,
        )
        .test(
          "fileType",
          "Only JPEG, PNG are allowed",
          (value: any) =>
            value && ["image/jpeg", "image/png"].includes(value.type),
        ),
    ),
});

const initialFormValues: CaseStudy = {
  clientName: "",
  url: "",
  description: "",
  caseStudiesImages: [],
};

interface CaseStudyFormProps {
  info: CaseStudy[];
  newInfoHandler: (values: CaseStudy, options: any) => Promise<any>;
  deleteInfoHandler: (id: string) => void;
  editInfoHandler: ((values: CaseStudy, options: any) => void) | null;
  editModeCallBack: ((updatedProjectInfo: CaseStudy) => void) | null;
  defaultListIcon: React.ReactNode;
  submitLoader: boolean;
  caseStudyImgKey?: string;
}

const CaseStudyForm = ({
  info = [],
  newInfoHandler,
  deleteInfoHandler,
  editInfoHandler = null,
  editModeCallBack = null,
  defaultListIcon,
  submitLoader = false,
  caseStudyImgKey = "caseStudiesImages",
}: CaseStudyFormProps) => {
  const [initValues, setInitValues] = useState(initialFormValues);
  const windowWidth = useWindowWidth();

  const populateForm = (formData: CaseStudy) => {
    const images: File[] = [];
    if (formData && formData[caseStudyImgKey as keyof CaseStudy]) {
      const cImages = formData[caseStudyImgKey as keyof CaseStudy] as
        | string[]
        | File[];
      if (Array.isArray(cImages)) {
        images.forEach((imgName: any) => {
          images.push(
            new File([], getLastSegment(imgName), { type: "image/png" }),
          );
        });
      }
    }
    const updatedCaseStudyInfo = { ...formData, [caseStudyImgKey]: images };
    setInitValues(updatedCaseStudyInfo);
    if (editModeCallBack) {
      editModeCallBack(updatedCaseStudyInfo);
    }
  };

  const resetFormEdit = () => {
    setInitValues(initialFormValues);
    if (editModeCallBack) {
      editModeCallBack(initialFormValues);
    }
  };

  const editActionHandler = async (infoValues: CaseStudy, options: any) => {
    if (editInfoHandler !== null) {
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
              <div className="form-group col-lg-12 col-md-12">
                <div className="mb-2">
                  <label>Case Study Images (Optional)</label>
                  <ImgDropzone
                    /* setFieldValue={formik.setFieldValue} */ fieldName={
                      caseStudyImgKey
                    }
                    maxImg={3}
                  />
                </div>
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <TextField
                  label="Client Name"
                  name="clientName"
                  type="text"
                  autoComplete="off"
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <TextField
                  label="URL"
                  name="url"
                  type="text"
                  autoComplete="off"
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
        {info.map(
          ({ clientName, url, description, caseStudiesImages, _id }, idx) => (
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
                  <h4>{clientName}</h4>

                  <ul className="job-other-info cert-or-skill">
                    <li className={`time text-nowrap`}>
                      {responsiveShortUrl(url, windowWidth)}
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
                                clientName,
                                url,
                                description,
                                caseStudiesImages,
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
          ),
        )}
      </div>
    </>
  );
};

export default CaseStudyForm;