import * as Yup from "yup";

import {
  COMPANY_INDUSTRY_OPTIONS,
  COMPANY_LOCATION_OPTIONS,
  COMPANY_SIZE_OPTIONS,
  ROLE_IN_COMPANY_OPTIONS,
} from "@/utils/formConstants";
import { registerFormModel } from "@/utils/registrationConstants";
const {
  formField: {
    firstName,
    lastName,
    talentEmail,
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

export const talentValidate = Yup.object({
  firstName: Yup.string()
    .max(15, firstName.invalidErrorMsg)
    .required(firstName.requiredErrorMsg),
  lastName: Yup.string()
    .max(20, lastName.invalidErrorMsg)
    .required(lastName.requiredErrorMsg),
  email: Yup.string()
    .email(talentEmail.invalidErrorMsg)
    .required(talentEmail.requiredErrorMsg),
  password: Yup.string()
    .required(password.requiredErrorMsg)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).{8,}$/,
      password.invalidErrorMsg,
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), undefined], confirmPassword.invalidErrorMsg)
    .required(confirmPassword.requiredErrorMsg),
  acceptedTerms: Yup.bool().oneOf([true], acceptedTerms.requiredErrorMsg),
});

export const orgValidate = [
  Yup.object({
    email: Yup.string()
      .email(orgEmail.invalidErrorMsg)
      .required(orgEmail.requiredErrorMsg),
    password: Yup.string()
      .required(password.requiredErrorMsg)
      .matches(password.regex, password.invalidErrorMsg),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), undefined], confirmPassword.invalidErrorMsg)
      .required(confirmPassword.requiredErrorMsg),
    acceptedTerms: Yup.bool().oneOf([true], acceptedTerms.requiredErrorMsg),
  }),

  Yup.object({
    companyName: Yup.string()
      .max(60, companyName.invalidErrorMsg)
      .required(companyName.requiredErrorMsg),
    industry: Yup.string()
      .oneOf(COMPANY_INDUSTRY_OPTIONS.map((option) => option.value))
      .required(industry.requiredErrorMsg),
    size: Yup.number()
      .oneOf(COMPANY_SIZE_OPTIONS.map((option) => option.value))
      .required(size.requiredErrorMsg),
    location: Yup.string()
      .oneOf(COMPANY_LOCATION_OPTIONS.map((option) => option.value))
      .required(location.requiredErrorMsg),
  }),

  Yup.object({
    primaryContactName: Yup.string()
      .max(35, primaryContactName.invalidErrorMsg)
      .required(primaryContactName.requiredErrorMsg),
    roleInCompany: Yup.string()
      .oneOf(ROLE_IN_COMPANY_OPTIONS.map((option) => option.value))
      .required(roleInCompany.requiredErrorMsg),
    roleInCompanyOther: Yup.string()
      .max(35, primaryContactName.invalidErrorMsg)
      .when(roleInCompany.name, {
        is: (value: string) => value === "other",
        then: (schema) => schema.required(roleInCompanyOther.requiredErrorMsg),
      }),
    contactPhone: Yup.string()
      .matches(contactPhone.regex, contactPhone.invalidErrorMsg)
      .max(24, contactPhone.invalidLengthErrorMsg)
      .required(contactPhone.requiredErrorMsg),
    contactEmail: Yup.string()
      .email(contactEmail.invalidErrorMsg)
      .required(contactEmail.requiredErrorMsg),
  }),
];
