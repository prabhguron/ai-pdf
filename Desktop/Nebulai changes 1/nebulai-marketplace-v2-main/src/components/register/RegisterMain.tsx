"use client";

import React, { useRef, useState } from "react";
import NebulaiApi from "@/neb-api/NebulaiApi";
import { toast } from "react-toastify";
import InfoNew from "@/components/register/InfoNew";
import RoleSelect from "@/components/register/RoleSelect";
import { useRouter } from "next/navigation";
import { Formik, FormikProps } from "formik";
import {
  adjustedStep,
  initialRegisterState,
  initialValues,
} from "@/utils/registrationConstants";

import { talentValidate, orgValidate } from "@/utils/registrationYupSchemas";

interface RegisterState {
  logo: string;
  firstName: string;
  lastName: string;
  companyName: string;
  telegramUsername: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
  [key: string]: string | boolean;
  industry: string;
  size: string;
  location: string;
  primaryContactName: string;
  roleInCompany: string;
  roleInCompanyOther: string;
  contactPhone: string;
  contactEmail: string;
}

const RegisterMain = () => {
  const router = useRouter();
  const { registerUser } = NebulaiApi();
  const [step, setStep] = useState<number>(1);
  const [role, setRole] = useState<Role>("company");
  const [registerInfo, setRegisterInfo] =
    useState<RegisterState>(initialRegisterState);

  const formRef =
    useRef<
      FormikProps<TalentRegistrationFormInit | CompanyRegistrationFormInit>
    >(null);

  const getValidationSchema = () => {
    return role === "company"
      ? orgValidate[adjustedStep(step)]
      : talentValidate;
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    // bring viewport back to top of page
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    setStep(step - 1);
  };

  const updateRole = (r: Role) => {
    setRole(r);
  };

  const saveRegistrationInfo = (key: string, value: string | boolean) => {
    if (typeof registerInfo[key] === "undefined") return;
    setRegisterInfo((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  const resetRegInfo = () => {
    setRegisterInfo(initialRegisterState);
  };

  const createAccountHandler = async () => {
    try {
      const payload = {
        role,
        ...registerInfo,
      };
      const result = await registerUser(payload);
      if (result && result.status && result.data) {
        const statusCode = result.status;
        const status = result?.data?.status || "error";
        const msg = result?.data?.message || "Something went wrong";
        if (statusCode === 400) {
          toast.error("Missing Fields");
          return;
        }
        if (status === "success") {
          router.push(`/register/success?e=${btoa(registerInfo?.email)}`);
          //   router.push({
          //     pathname: "/register/success",
          //     query: { email: registerInfo.email },
          //   });
          return;
        }
        toast.error(msg);
        return;
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  switch (step) {
    case 1:
      return (
        <RoleSelect
          role={role}
          step={step}
          nextStep={nextStep}
          updateRole={updateRole}
        />
      );
    case 2:
    case 3:
    case 4:
      return (
        <Formik
          innerRef={formRef}
          initialValues={initialValues}
          validationSchema={getValidationSchema()}
          onSubmit={createAccountHandler}
        >
          <InfoNew
            step={step}
            role={role}
            nextStep={nextStep}
            prevStep={prevStep}
            resetRegInfo={resetRegInfo}
            formRef={formRef}
            saveRegistrationInfo={saveRegistrationInfo}
            createAccountHandler={createAccountHandler}
          />
        </Formik>
      );
    default:
      break;
    // case 3:
    //     return <Security prevStep={prevStep}/>
  }

  return <></>;
};

export default RegisterMain;
