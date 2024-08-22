"use client";
import { Form, FormikValues, useFormikContext } from "formik";
import React from "react";
import CheckBoxField from "@/components/form/CheckBoxField";
import { TextField } from "@/components/form/TextField";
import { PasswordField } from "@/components/form/PasswordField";
import { registerFormModel } from "@/utils/registrationConstants";

const {
  formField: {
    firstName,
    lastName,
    talentEmail,
    password,
    confirmPassword,
    acceptedTerms,
  },
} = registerFormModel;

type TalentFormProps = {
  updateRegistrationInfo: any;
};

const TalentForm = ({ updateRegistrationInfo }: TalentFormProps) => {
  const { values } = useFormikContext<FormikValues>();

  return (
    <div>
      <Form className="default-form" onChange={updateRegistrationInfo}>
        <div key="talent-form" className="row">
          <div className="form-group mb2px col-lg-4 col-md-4">
            <TextField
              label={firstName.label}
              name={firstName.name}
              type="text"
            />
          </div>
          <div className="form-group mb2px col-lg-4 col-md-4">
            <TextField
              label={lastName.label}
              name={lastName.name}
              type="text"
            />
          </div>
          <div className="form-group mb2px col-lg-4 col-md-4">
            <TextField
              label={talentEmail.label}
              name={talentEmail.name}
              type="email"
            />
          </div>
          <div className="form-group mb2px col-lg-6 col-md-4">
            <PasswordField label={password.label} name={password.name} />
          </div>
          <div className="form-group mb2px col-lg-6 col-md-4">
            <TextField
              label={confirmPassword.label}
              name={confirmPassword.name}
              type="password"
              customclasses="mt1rem"
            />
          </div>
          <div className="form-group mb2px col-lg-6 col-md-6">
            <CheckBoxField
              label={acceptedTerms.label}
              name={acceptedTerms.name}
              value={values.acceptedTerms}
            />
          </div>
        </div>
      </Form>
    </div>
  );
};

export default TalentForm;
