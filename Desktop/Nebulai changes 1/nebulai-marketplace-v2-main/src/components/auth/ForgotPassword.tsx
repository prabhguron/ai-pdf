"use client";

import { Form, Formik, FormikValues } from "formik";
import React, { useRef, useState } from "react";
import { TextField } from "@/components/form/TextField";
import * as Yup from "yup";
import NebulaiApi from "@/neb-api/NebulaiApi";
import { toast } from "react-toastify";

const validate = Yup.object({
  email: Yup.string().email("Email is invalid").required("Email is required"),
});
const ForgotPassword = () => {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [forgotPasswordLinkSent, setForgotPasswordLinkSent] = useState(null);
  const { forgotPassword } = NebulaiApi();

  const recoverPasswordHandler = async (values: FormikValues) => {
    const { email } = values;
    if (!email) return;
    try {
      const payload = { email };
      setLoading(true);
      const result = await forgotPassword(payload);
      if (result && result.status && result.data) {
        const statusCode = result.status;
        const status = result?.data?.status || "error";
        const msg = result?.data?.message || "Something went wrong";
        setLoading(false);
        if (statusCode == 400) {
          toast.error("Email field not passed");
          return;
        }
        if (status === "success") {
          toast.success(`A reset link has been re-sent to ${email}`);
          setForgotPasswordLinkSent(email);
          return;
        }
        toast.error(msg);
        return;
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="login-section-custom">
      <div className="">
        <div className="login-form default-form">
          <Formik
            innerRef={formRef}
            initialValues={{
              email: "",
            }}
            validationSchema={validate}
            onSubmit={recoverPasswordHandler}
          >
            {(formik) => (
              <div className="form-inner">
                <h3>Recover Password</h3>
                {!forgotPasswordLinkSent ? (
                  <Form className="default-form">
                    <div>
                      <div className="form-group">
                        <TextField label="Email" name="email" type="email" />
                      </div>

                      <div className="form-group">
                        <button
                          className="theme-btn btn-style-one"
                          type="submit"
                          name="recover-password"
                        >
                          {loading ? (
                            <>
                              Please Wait...{" "}
                              <span
                                className="spinner-border spinner-border-sm pl-4"
                                role="status"
                                aria-hidden="true"
                              ></span>
                            </>
                          ) : (
                            "Recover Password"
                          )}
                        </button>
                      </div>
                    </div>
                  </Form>
                ) : (
                  <div className="">
                    <div className="card-body d-flex justify-content-center align-items-center">
                      <h3 className="card-title">
                        We have sent an email to{" "}
                        <span className="fw-bold">
                          {forgotPasswordLinkSent}
                        </span>{" "}
                        Please check your email to reset password.
                      </h3>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
