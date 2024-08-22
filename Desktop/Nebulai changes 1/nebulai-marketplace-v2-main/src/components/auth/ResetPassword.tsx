'use client';

import { Form, Formik, FormikValues } from "formik";
import React, { useRef, useState } from "react";
import { TextField } from "@/components/form/TextField";
import * as Yup from "yup";
import { toast } from "react-toastify";
import NebulaiApi from "@/neb-api/NebulaiApi";
import { useRouter } from "next/navigation";


const validate = Yup.object({
  password: Yup.string()
    .min(6, "Password must be at least 6 charaters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Password must match")
    .required("Confirm password is required"),
});
const ResetPassword = ({token}:{token: string}) => {
  const formRef = useRef(null);
  const { resetPassword } = NebulaiApi();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const resetPasswordHandler = async (values: FormikValues) => {
    const { password } = values;
    if (!password || !token) return;
    try {
      const payload = { password };
      setLoading(true);
      const result = await resetPassword(payload, token);
      if (result && result.status && result.data) {
        const statusCode = result.status;
        const status = result?.data?.status || "error";
        const msg = result?.data?.message || "Something went wrong";
        setLoading(false);
        if (statusCode == 400) {
          toast.error(msg);
          return;
        }
        if (status === "success") {
          toast.success(msg);
          router.push("/login");
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
                password: "",
                confirmPassword: "",
              }}
              validationSchema={validate}
              onSubmit={resetPasswordHandler}
            >
              {(formik) => (
                <div className="form-inner">
                  <h3>Reset Password</h3>
                  <Form className="default-form">
                    <div>
                      <div className="form-group">
                        <TextField
                          label="Password"
                          name="password"
                          type="password"
                        />
                      </div>

                      <div className="form-group">
                        <TextField
                          label="Confirm Password"
                          name="confirmPassword"
                          type="password"
                        />
                      </div>
                      <div className="form-group">
                        <button
                          className="theme-btn btn-style-one"
                          type="submit"
                          name="reset-password"
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
                            "Reset Password"
                          )}
                        </button>
                      </div>
                    </div>
                  </Form>
                </div>
              )}
            </Formik>
          </div>
        </div>
      </div>
  );
};

export default ResetPassword;
