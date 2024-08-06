"use client";
import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { TextField } from "@/components/form/TextField";
import { PasswordField } from "@/components/form/PasswordField";
import Image from "next/image";
import { FaCheckCircle } from "react-icons/fa";
import NebulaiApi from "@/neb-api/NebulaiApi";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/redux/store";
import { updateAccessToken } from "@/redux/auth/authSlice";
import useLoginActions from "@/hooks/useLoginActions";

const validate = Yup.object({
  role: Yup.string()
    .max(15, "Must be 15 characters or less")
    .required("Required")
    .default("company"),
  firstName: Yup.string().when("role", {
    is: (val: any) => val === "talent",
    then: (schema) => schema.required("Required"),
  }),
  lastName: Yup.string().when("role", {
    is: (val: any) => val === "talent",
    then: (schema) => schema.required("Required"),
  }),
  companyName: Yup.string().when("role", {
    is: (val: any) => val === "company",
    then: (
      schema // <---- notice here return function
    ) => schema.required("Required"),
  }),
  password: Yup.string()
    .required("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).{8,}$/,
      "Password is weak, must be at least 8 characters, must contain one number, uppercase, lowercase & special character"
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Password must match")
    .required("Confirm password is required"),
  acceptedTerms: Yup.bool().default(true),
});

interface CompleteRegistrationFormValues {
  role: Role;
  firstName: string;
  lastName: string;
  companyName: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
}

const initValues: CompleteRegistrationFormValues = {
  role: "company",
  firstName: "",
  lastName: "",
  companyName: "",
  password: "",
  confirmPassword: "",
  acceptedTerms: true,
};
const AppSignUpForm = () => {
  const dispatch = useAppDispatch();
  const { fetchUserAndProfile } = useLoginActions();
  const searchParams = useSearchParams();
  let token: string | undefined | null = searchParams?.get("t");
  let email: string | undefined | null = searchParams?.get("e");
  email = email && atob(email);
  const router = useRouter();
  const [role, setRole] = useState<Role>("company");
  const [isHovered, setIsHovered] = useState<Role | null>(null);
  const { registerUser } = NebulaiApi();

  const [isLoading, setIsLoading] = useState(false);

  const completeRegistrationHandler = async (
    values: CompleteRegistrationFormValues
  ) => {
    try {
      setIsLoading(true);
      const payload = {
        ...values,
        email,
        token,
      };
      const result = await registerUser(payload);
      if (result && result.status && result.data) {
        const statusCode = result.status;
        const status = result?.data?.status || "error";
        const accessToken = result?.data?.accessToken || null;
        const msg = result?.data?.message || "Something went wrong";
        if (statusCode === 400) {
          setIsLoading(false);
          toast.error("Missing Fields");
          return;
        }
        if (status === "success" && accessToken) {
          await dispatch(updateAccessToken(accessToken));
          const fetchedUserResult = await fetchUserAndProfile();
          if (fetchedUserResult !== null) {
            if (fetchedUserResult?.accessToken && fetchedUserResult?.userRole) {
              router.push(`/${fetchedUserResult?.userRole}/dashboard`);
              return;
            }
          }
        }
        setIsLoading(false);
        toast.error(msg);
        return;
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
    setIsLoading(false);
  };

  return (
    <Formik
      initialValues={initValues}
      validationSchema={validate}
      onSubmit={completeRegistrationHandler}
      enableReinitialize
    >
      {(formik) => (
        <Form className="login-form default-form">
          <div className="form-inner row">
            <h2 className="text-center fw-bold">
              Complete Your Registration ⚡️
            </h2>
            <h5 className="mt-4">Select Role</h5>
            <div className="form-group col-12 d-flex justify-content-evenly">
              <div
                className="cursor-pointer d-flex flex-column align-items-center orgAppSignUpCard"
                onMouseEnter={() => setIsHovered("company")}
                onMouseLeave={() => setIsHovered(null)}
                onClick={() => {
                  setRole("company");
                  formik.setFieldValue("role", "company");
                }}
              >
                <Image
                  className="pt-4"
                  src="/img/resource/registration/org.jpg"
                  width={140}
                  height={150}
                  alt="ORGANIZATION"
                  loading="lazy"
                />
                <span className="fw-bold mt-3 role-title fs-5">
                  Organization{" "}
                  {(isHovered == "company" || role === "company") && (
                    <FaCheckCircle className="text-success" />
                  )}
                </span>
              </div>
              <div
                className="cursor-pointer d-flex flex-column align-items-center"
                onMouseEnter={() => setIsHovered("talent")}
                onMouseLeave={() => setIsHovered(null)}
                onClick={() => {
                  setRole("talent");
                  formik.setFieldValue("role", "talent");
                }}
              >
                <Image
                  src="/img/resource/registration/talent.png"
                  width={180}
                  height={180}
                  alt="TALENT"
                  loading="lazy"
                />
                <span className="fw-bold role-title fs-5">
                  Talent{" "}
                  {(isHovered === "talent" || role === "talent") && (
                    <FaCheckCircle className="text-success" />
                  )}
                </span>
              </div>
            </div>

            <div className="form-group col-12">
              <span className="fw-bold fs-5">
                <em>{email}</em>
              </span>
            </div>
            {role === "talent" && (
              <>
                <div className="form-group col-sm-12 col-lg-6 col-md-6">
                  <TextField
                    label="First Name"
                    name="firstName"
                    type="text"
                    autoComplete="off"
                  />
                </div>
                <div className="form-group col-sm-12 col-lg-6 col-md-6">
                  <TextField
                    label="Last Name"
                    name="lastName"
                    type="text"
                    autoComplete="off"
                  />
                </div>
              </>
            )}

            {role === "company" && (
              <>
                <div className="form-group col-12">
                  <TextField
                    label="Company Name"
                    name="companyName"
                    type="text"
                    autoComplete="off"
                  />
                </div>
              </>
            )}

            <div className="form-group col-lg-12 col-md-12">
              <PasswordField label="Password" name="password" />
            </div>
            <div className="form-group col-lg-12 col-md-12">
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                customclasses="mt1rem"
              />
            </div>

            <div className="form-group">
              <button
                className="theme-btn btn-style-one fw-bold"
                type="submit"
                name="log-in"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    Please Wait...{" "}
                    <span
                      className="spinner-border spinner-border-sm pl-4"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  </>
                ) : (
                  "Complete Registration"
                )}
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AppSignUpForm;
