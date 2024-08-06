"use client";
import { Form, Formik } from "formik";
import React, { RefObject } from "react";
import { TextField } from "@/components/form/TextField";
import SelectField from "@/components/form/SelectField";
import * as Yup from "yup";
import Modal from "@/components/common/Modal";

const currentYear = new Date().getFullYear();
const yearOptions: {
  value: number;
  label: string;
}[] = [];
for (let i = currentYear; i >= currentYear - 30; i--) {
  yearOptions.push({ value: i, label: i.toString() });
}

const validate = Yup.object().shape({
  courseName: Yup.string()
    .max(100, "Must be 100 characters or less")
    .required("Required"),
  college: Yup.string()
    .max(90, "Must be 90 characters or less")
    .required("Required"),
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

interface EducationModalProps {
  modalTitle: string;
  modalType?: string;
  modalRef: RefObject<HTMLDivElement> | null;
  modalId: string;
  onSubmitHandler: (values: TalentEducation, options: any) => Promise<any>;
}

const initValues:TalentEducation = {
  courseName: "",
  college: "",
  startYear: 2023,
  endYear: 2023,
}
const EducationModal = ({
  modalTitle,
  onSubmitHandler,
  modalRef,
  modalId,
}: EducationModalProps) => {


  return (
    <Modal modalTitle={modalTitle} modalRef={modalRef} modalId={modalId}>
      <Formik
        initialValues={initValues}
        validationSchema={validate}
        onSubmit={onSubmitHandler}
      >
        {(formik) => (
          <Form className="default-form">
            <div className="row">
              <div className="form-group col-lg-6">
                <TextField
                  label="College / University"
                  name="college"
                  type="text"
                />
              </div>

              <div className="form-group col-lg-6">
                <TextField label="Course Name" name="courseName" type="text" />
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

              <div className="form-group">
                <button
                  type="submit"
                  className="theme-btn btn-style-one btn-small"
                >
                  Add
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default EducationModal;
