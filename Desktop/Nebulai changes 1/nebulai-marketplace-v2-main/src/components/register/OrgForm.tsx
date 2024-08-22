"use client";
import { Form, FormikValues, useFormikContext } from "formik";
import React, { useEffect, useState } from "react";
import CheckBoxField from "@/components/form/CheckBoxField";
import { TextField } from "@/components/form/TextField";
import { PasswordField } from "@/components/form/PasswordField";
import SelectField from "../form/SelectField";
import {
  COMPANY_INDUSTRY_OPTIONS,
  COMPANY_LOCATION_OPTIONS,
  COMPANY_SIZE_OPTIONS,
  ROLE_IN_COMPANY_OPTIONS,
} from "@/utils/formConstants";
import { registerFormModel } from "@/utils/registrationConstants";
const {
  formField: {
    orgEmail,
    password,
    confirmPassword,
    acceptedTerms,
    companyName,
    industry,
    size,
    location,
    primaryContactName,
    roleInCompany,
    roleInCompanyOther,
    contactPhone,
    contactEmail,
  },
} = registerFormModel;
import { UpdateRegistrationInfoParams } from "./InfoNew";

type CompanyFormProps = {
  updateRegistrationInfo: any;
  step: number;
};

const OrgForm = ({ updateRegistrationInfo, step }: CompanyFormProps) => {
  const [otherRoleHasAnimated, setOtherRoleHasAnimated] = useState(false);
  const [timer, setTimer] = useState(0);
  const { values, setFieldValue } = useFormikContext<FormikValues>();

  useEffect(() => {
    window.clearTimeout(timer);
    if (values.roleInCompany === "other") {
      const tId = window.setTimeout(() => {
        setOtherRoleHasAnimated(true);
      }, 750);
      setTimer(tId);
    } else {
      setOtherRoleHasAnimated(false);
      setFieldValue(roleInCompanyOther.name, "");
    }
  }, [values.roleInCompany]);

  const regFormSelectOptionCallback = (
    valueMeta: { value: string; label: string },
    options: UpdateRegistrationInfoParams,
  ) => {
    const { value } = valueMeta;
    updateRegistrationInfo(null, {
      ...options,
      value: value,
      action: "select-option",
    });
  };

  const renderForm = () => {
    switch (step) {
      case 2:
        return (
          <div className="row row-gap-3" key="step-two">
            <div className="form-group mb2px col-lg-12 col-md-12">
              <TextField
                label={orgEmail.label}
                name={orgEmail.name}
                type="email"
              />
            </div>
            <div className="form-group mb2px col-lg-6 col-md-6">
              <PasswordField
                label={password.label}
                name={password.name}
                value={values.password}
              />
            </div>
            <div className="form-group mb2px col-lg-6 col-md-6">
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
        );
      case 3:
        return (
          <div className="row row-gap-3" key="step-three">
            <div className="form-group mb2px col-lg-6 col-md-6">
              <TextField
                label={companyName.label}
                name={companyName.name}
                type="text"
              />
            </div>
            <div className="form-group mb2px col-lg-6 col-md-6">
              <SelectField
                label={industry.label}
                name={industry.name}
                options={COMPANY_INDUSTRY_OPTIONS}
                onChangeCallback={(valueMeta) =>
                  regFormSelectOptionCallback(valueMeta, {
                    name: industry.name,
                  })
                }
              />
            </div>
            <div className="form-group mb2px col-lg-6 col-md-6">
              <SelectField
                label={size.label}
                name={size.name}
                options={COMPANY_SIZE_OPTIONS}
                onChangeCallback={(valueMeta) =>
                  regFormSelectOptionCallback(valueMeta, {
                    name: size.name,
                  })
                }
              />
            </div>
            <div className="form-group mb2px col-lg-6 col-md-6">
              <SelectField
                label={location.label}
                name={location.name}
                options={COMPANY_LOCATION_OPTIONS}
                onChangeCallback={(valueMeta) =>
                  regFormSelectOptionCallback(valueMeta, {
                    name: location.name,
                  })
                }
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="row row-gap-3" key="step-four">
            <div className="form-group mb2px col-lg-6 col-md-6">
              <TextField
                label={primaryContactName.label}
                name={primaryContactName.name}
                type="text"
              />
            </div>
            <div className="form-group mb2px col-lg-6 col-md-6">
              <SelectField
                label={roleInCompany.label}
                name={roleInCompany.name}
                options={ROLE_IN_COMPANY_OPTIONS}
                onChangeCallback={(valueMeta) =>
                  regFormSelectOptionCallback(valueMeta, {
                    name: roleInCompany.name,
                  })
                }
              />
            </div>
            {/* Custom position or role input for mobile & sm screen size */}
            {values.roleInCompany === "other" ? (
              <div
                key="role-in-company-other-mobile"
                className="form-group mb2px d-md-none col-lg-6 col-md-6"
                data-aos={otherRoleHasAnimated ? "" : "fade-left"}
                data-aos-duration="700"
              >
                <TextField
                  label={roleInCompanyOther.label}
                  name={roleInCompanyOther.name}
                  type="text"
                />
              </div>
            ) : null}
            <div className="form-group mb2px col-lg-6 col-md-6">
              <TextField
                label={contactPhone.label}
                name={contactPhone.name}
                type="text"
              />
            </div>
            {/* Custom position or role input for md & lg screen size */}
            {values.roleInCompany === "other" ? (
              <div
                key="role-in-company-other-desktop"
                className="form-group mb2px d-none d-md-block col-lg-6 col-md-6"
                data-aos={otherRoleHasAnimated ? "" : "fade-left"}
                data-aos-duration="700"
              >
                <TextField
                  label={roleInCompanyOther.label}
                  name={roleInCompanyOther.name}
                  type="text"
                />
              </div>
            ) : null}
            <div className="form-group mb2px col-lg-6 col-md-6">
              <TextField
                label={contactEmail.label}
                name={contactEmail.name}
                type="email"
              />
            </div>
          </div>
        );
      default:
        return <div>Something went wrong...</div>;
    }
  };

  return (
    <div>
      <Form className="default-form" onChange={updateRegistrationInfo}>
        {renderForm()}
      </Form>
    </div>
  );
};

export default OrgForm;
