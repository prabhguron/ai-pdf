export const registerFormModel = {
  formField: {
    firstName: {
      name: "firstName",
      label: "First Name",
      requiredErrorMsg: "Required",
      invalidErrorMsg: "Must be 15 characters or less",
    },
    lastName: {
      name: "lastName",
      label: "Last Name",
      requiredErrorMsg: "Required",
      invalidErrorMsg: "Must be 20 characters or less",
    },
    companyName: {
      name: "companyName",
      label: "Company Name",
      requiredErrorMsg: "Company name is required",
      invalidErrorMsg: "Must be 60 characters or less",
    },
    telegramUsername: {
      name: "",
      label: "",
      requiredErrorMsg: "",
      invalidErrorMsg: "",
    },
    talentEmail: {
      // two email objects due to difference in label - form state should only have one `email` field
      name: "email",
      label: "Enter your email address",
      requiredErrorMsg: "Email is required",
      invalidErrorMsg: "Email is invalid",
    },
    orgEmail: {
      // two email objects due to difference in label - form state should only have one `email` field
      name: "email",
      label: "Enter your work email address",
      requiredErrorMsg: "Email is required",
      invalidErrorMsg: "Email is invalid",
    },
    password: {
      name: "password",
      label: "Create a password",
      requiredErrorMsg: "Password is required",
      invalidErrorMsg:
        "Password is weak, must be at least 8 characters, must contain one number, uppercase, lowercase & special character",
      regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).{8,}$/,
    },
    confirmPassword: {
      name: "confirmPassword",
      label: "Confirm your password",
      requiredErrorMsg: "Confirm password is required",
      invalidErrorMsg: "Password must match",
    },
    acceptedTerms: {
      name: "acceptedTerms",
      label: "I accept Terms of Service & Privacy Policy",
      requiredErrorMsg: "You need to accept the terms and conditions",
      // invalidErrorMsg: "",
    },
    industry: {
      name: "industry",
      label: "Select your industry from the list",
      requiredErrorMsg: "Industry is required",
      // invalidErrorMsg: "",
    },
    size: {
      name: "size",
      label: "Choose the number of employees",
      requiredErrorMsg: "Company size is required",
      // invalidErrorMsg: "",
    },
    location: {
      name: "location",
      label: "Where is your company based?",
      requiredErrorMsg: "Location is required",
      // invalidErrorMsg: "",
    },
    primaryContactName: {
      name: "primaryContactName",
      label: "Full Name",
      requiredErrorMsg: "Contact name is required",
      invalidErrorMsg: "Must be 35 characters or less",
    },
    roleInCompany: {
      name: "roleInCompany",
      label: "Position or role",
      requiredErrorMsg: "Contact role is required",
      // invalidErrorMsg: "",
    },
    roleInCompanyOther: {
      name: "roleInCompanyOther",
      label: "Enter your position or role",
      requiredErrorMsg: "A position or role is required",
      invalidErrorMsg: "Must be 35 characters or less",
    },
    contactPhone: {
      name: "contactPhone",
      label: "Contact phone number",
      requiredErrorMsg: "Contact phone number is required",
      invalidErrorMsg: "Must be a valid phone number",
      invalidLengthErrorMsg: "Must be 16 characters or less",
      regex:
        /(?:([+]\d{1,4})[-.\s]?)?(?:[(](\d{1,3})[)][-.\s]?)?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})/g,
    },
    contactEmail: {
      name: "contactEmail",
      label: "Contact email address",
      requiredErrorMsg: "Contact email is required",
      invalidErrorMsg: "Email is invalid",
    },
  },
};

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

export const talentFieldNames = [
  firstName.name,
  lastName.name,
  talentEmail.name,
  password.name,
  confirmPassword.name,
  acceptedTerms.name,
];

export const orgStepFieldNames = [
  [orgEmail.name, password.name, confirmPassword.name, acceptedTerms.name],
  [companyName.name, size.name, industry.name, location.name],
  [
    primaryContactName.name,
    roleInCompany.name,
    roleInCompanyOther.name,
    contactPhone.name,
    contactEmail.name,
  ],
];

export const initialValues = {
  firstName: "",
  lastName: "",
  companyName: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptedTerms: false,
  industry: "",
  size: "",
  location: "",
  primaryContactName: "",
  roleInCompany: "",
  roleInCompanyOther: "",
  contactPhone: "",
  contactEmail: "",
};

export const initialRegisterState = {
  logo: "",
  telegramUsername: "",
  ...initialValues,
};

// offset needed because `step` initializes at 1
// but form inputs are not used until step 2
// and the array of Yup validation schemas start at index 0
const orgStepOffset = 2;

export const adjustedStep = (step: number) => step - orgStepOffset;
