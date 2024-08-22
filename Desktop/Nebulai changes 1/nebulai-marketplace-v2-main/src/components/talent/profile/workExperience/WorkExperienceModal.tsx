"use client"
import { Form, Formik } from "formik";
import React, { RefObject } from "react";
import { TextField } from "@/components/form/TextField";
import TextAreaField from "@/components/form/TextAreaField";
import SelectField from "@/components/form/SelectField";
import * as Yup from "yup";
import Modal from "@/components/common/Modal";


const currentYear = new Date().getFullYear();
const yearOptions:{
  value: number;
  label: string;
}[] = [];
for (let i = currentYear; i >= currentYear - 30; i--) {
  yearOptions.push({ value: i, label: i.toString() });
}

const validate = Yup.object().shape({
  jobTitle: Yup.string()
      .max(50, "Must be 50 characters or less")
      .required("Required"),
  companyName: Yup.string()
      .max(100, "Must be 100 characters or less")
      .required("Required"),
  description: Yup.string()
  .max(150, "Must be 150 characters or less")
  .required("Required"),
  startYear: Yup.number()
    .typeError('Please select a year')
    .min(1900, 'Year must be after 1900')
    .max(Yup.ref('endYear'), 'Start year cannot be after end year')
    .required('Start year is required'),
  endYear: Yup.number()
    .typeError('Please select a year')
    .min(1900, 'Year must be after 1900')
    .max(new Date().getFullYear(), 'Year cannot be after the current year')
    .required('End year is required')
});

interface WorkExpModalProps {
  modalTitle: string;
  modalType?: string;
  modalRef: RefObject<HTMLDivElement> | null;
  modalId: string;
  onSubmitHandler: (values: TalentWorkExp, options: any) => Promise<any>;
}

const workExpInit: TalentWorkExp = {
  jobTitle: "",
  companyName: "",
  startYear: 2023,
  endYear: 2023,
  description: ""
}

const WorkExperienceModal = ({ modalTitle, onSubmitHandler, modalRef, modalId }: WorkExpModalProps) => {
  return (
    <Modal modalTitle={modalTitle} modalRef={modalRef} modalId={modalId} >
       <Formik
              initialValues={workExpInit}
              validationSchema={validate}
              onSubmit={onSubmitHandler}
            >
              {(formik) => (
                <Form className="default-form">
                  <div className="row">
                    <div className="form-group col-lg-6">
                      <TextField
                        label="Job Title"
                        name="jobTitle"
                        type="text"
                      />
                    </div>

                    <div className="form-group col-lg-6">
                      <TextField
                        label="Company Name"
                        name="companyName"
                        type="text"
                      />
                    </div>
                   
                    <div className="form-group col-lg-6 col-md-12">
                      <SelectField label={'Start Year'} name='startYear' options={yearOptions}/>
                    </div>

                    <div className="form-group col-lg-6 col-md-12">
                      <SelectField label={'End Year'} name='endYear' options={yearOptions}/>
                    </div>

                    <div className="form-group col-lg-12 col-md-12">
                      <TextAreaField label="Description" name="description"/>
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

export default WorkExperienceModal;
