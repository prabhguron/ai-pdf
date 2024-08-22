/* eslint-disable react/no-unescaped-entities */
/* eslint-disable default-case */
import React, { useState } from "react";
import OrgForm from "./OrgForm";
import TalentForm from "./TalentForm";
import {
  FormikProps,
  FormikErrors,
  FormikValues,
  useFormikContext,
} from "formik";
import OrgInstructions from "./OrgInstructions";
import TalentInstructions from "./TalentInstructions";
import {
  adjustedStep,
  talentFieldNames,
  orgStepFieldNames,
} from "@/utils/registrationConstants";

interface Info {
  step: number;
  nextStep?: () => void;
  prevStep?: () => void;
  resetRegInfo: () => void;
  role: Role;
  formRef: React.RefObject<
    FormikProps<TalentRegistrationFormInit | CompanyRegistrationFormInit>
  >;
  saveRegistrationInfo: (key: string, value: string | boolean) => void;
  createAccountHandler: () => Promise<void>;
}

export interface UpdateRegistrationInfoParams {
  type?: string;
  name?: string;
  value?: string | boolean;
  action?: string;
}

const InfoNew = ({
  step,
  nextStep,
  prevStep,
  resetRegInfo,
  role,
  formRef,
  saveRegistrationInfo,
  createAccountHandler,
}: Info) => {
  const [savingRegistrationInfo, setSavingRegistrationInfo] = useState(false);
  const { validateForm, setTouched } = useFormikContext();

  const updateRegistrationInfo = (e: any, a: UpdateRegistrationInfoParams) => {
    let fieldType: string = e?.target?.type || "";
    if (!fieldType.length) {
      fieldType = a?.action || "";
    }
    let fieldName = e?.target?.name || "";
    if (!fieldName.length) {
      fieldName = a?.name || "";
    }

    let fieldVal: string = e?.target?.value || "";
    if (!fieldVal.length) {
      fieldVal = a?.value ? a?.value : e ? e : "";
    }

    switch (fieldType) {
      case "text":
      case "email":
      case "password":
      case "tel":
        saveRegistrationInfo(fieldName, fieldVal);
        break;
      case "textarea":
        saveRegistrationInfo(fieldName, fieldVal);
        break;
      case "select-option":
        saveRegistrationInfo(fieldName, fieldVal);
        break;
      case "checkbox":
        saveRegistrationInfo(fieldName, e.target.checked);
        break;
      default:
        break;
    }
  };

  const handleSaveRegistrationInfo = async () => {
    setSavingRegistrationInfo(true);
    await createAccountHandler();
    setSavingRegistrationInfo(false);
  };

  const handleCreateAccount = async () => {
    const formIsValid = await checkFormValidation();

    if (formIsValid) {
      if (formRef.current === null) return;
      // formRef.current?.handleSubmit(); // previous trigger
      handleSaveRegistrationInfo(); // new trigger
    }
  };

  const handleNextClicked = async () => {
    const formIsValid = await checkFormValidation();

    if (formIsValid) {
      nextStep?.();
    }
  };

  const handlePrevClicked = () => {
    if (step === 2) {
      resetRegInfo();
    }
    prevStep?.();
  };

  const formFieldsAreValid = (errors: FormikErrors<FormikValues>) => {
    let result;
    if (role === "company") {
      result = orgStepFieldNames[adjustedStep(step)].map(
        (field: string) => !errors[field],
      );
    } else {
      result = talentFieldNames.map((field: string) => !errors[field]);
    }
    return result.includes(false) ? false : true;
  };

  const setFormFieldsTouched = async () => {
    let touchedFields: { [key: string]: boolean } = {};
    if (role === "company") {
      orgStepFieldNames[adjustedStep(step)].forEach(
        (field: string) => (touchedFields[field] = true),
      );
    } else {
      talentFieldNames.forEach(
        (field: string) => (touchedFields[field] = true),
      );
    }
    await setTouched(touchedFields);
  };

  const checkFormValidation = async () => {
    try {
      const errors: FormikErrors<FormikValues> = await validateForm();
      // console.log("errors: ", errors);

      setFormFieldsTouched();

      if (formFieldsAreValid(errors)) {
        return true;
      }
      return false;
    } catch (err) {
      console.error("Form validation error", err);
    }
  };

  const renderForm = () => {
    switch (role) {
      case "talent":
        return <TalentForm updateRegistrationInfo={updateRegistrationInfo} />;
      case "company":
        return (
          <OrgForm
            updateRegistrationInfo={updateRegistrationInfo}
            step={step}
          />
        );
      default:
        console.log("Unknown role");
    }
  };

  const renderInstructions = () => {
    switch (role) {
      case "talent":
        return (
          <TalentInstructions
            handlePrevClicked={handlePrevClicked}
            handleCreateAccount={handleCreateAccount}
            savingRegistrationInfo={savingRegistrationInfo}
          />
        );
      case "company":
        return (
          <OrgInstructions
            step={step}
            handlePrevClicked={handlePrevClicked}
            handleNextClicked={handleNextClicked}
            handleCreateAccount={handleCreateAccount}
            savingRegistrationInfo={savingRegistrationInfo}
          />
        );
      default:
        console.log("Unknown role");
    }
  };

  return (
    <section className="banner-section -type-14">
      <div className="auto-container">
        <div className="row pb-5 min-h-500px">
          <div
            className={`content-column ${role === "company" ? "col-lg-5" : "col-lg-4"} col-md-12 col-sm-12`}
          >
            {renderInstructions()}
          </div>

          <div
            className={`${role === "company" ? "col-lg-7" : "col-lg-8"} col-lg-7 col-md-12 mt10rem py-4 bg-white resp-mg resp-h rounded d-flex flex-column justify-content-center align-items-center`}
          >
            <div className="container">{renderForm()}</div>

            {/* mobile & sm screen size form control buttons */}
            <div className="row d-lg-none">
              <div className="col-md-3 col-3 d-flex justify-content-center">
                <button
                  className="theme-btn btn-style-three mt-4"
                  type="button"
                  onClick={handlePrevClicked}
                >
                  Prev
                </button>
              </div>
              <div className="col-lg-9 col-md-9 col-9 d-flex justify-content-center">
                {step === 4 ? (
                  <button
                    className="theme-btn btn-style-one mt-4"
                    type="button"
                    onClick={handleCreateAccount}
                  >
                    {savingRegistrationInfo ? (
                      <>
                        Saving...{" "}
                        <span
                          className="spinner-border spinner-border-sm pl-4"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                ) : (
                  <button
                    className="theme-btn btn-style-one mt-4"
                    type="button"
                    onClick={handleNextClicked}
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoNew;
