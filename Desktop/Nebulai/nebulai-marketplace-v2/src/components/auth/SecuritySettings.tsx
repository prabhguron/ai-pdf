"use client";
import { Formik, Form, FormikProps } from "formik";
import React, { useRef } from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateAccessToken } from "@/redux/auth/authSlice";
import useApiController from "@/hooks/useApiController";
import { TextField } from "@/components/form/TextField";
import { PasswordField } from "@/components/form/PasswordField";

const validate = Yup.object({
  currentPassword: Yup.string()
    .min(6, "Password must be at least 6 charaters")
    .required("Password is required"),
  newPassword: Yup.string()
    .required("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{8,}$/,
      "Password is weak, must be at least 8 characters, must contain one number, uppercase, lowercase & special character"
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), undefined], "Password must match")
    .required("Confirm password is required"),
});

interface SettingsForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
const settingFormInitFields: SettingsForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const SecuritySettings = () => {
  const securityForm = useRef<FormikProps<SettingsForm>>(null);
  const dispatch = useDispatch();
  const { updatePassword } = useApiController();

  const updatePasswordHandler = async (values: SettingsForm) => {
    const { status, message, token } = await updatePassword(values);
    if (status === "success" && token) {
      await dispatch(updateAccessToken(token));
      securityForm.current?.resetForm();
    }
    toast(message, { type: status as any });
  };

  return (
    <div className="widget-content">
      <Formik
        innerRef={securityForm}
        initialValues={settingFormInitFields}
        validationSchema={validate}
        onSubmit={updatePasswordHandler}
      >
        {(formik) => (
          <div>
            <Form className="default-form">
              <div className="row">
                {/* <!-- Input --> */}
                <div className="form-group col-lg-7 col-md-12">
                  <TextField
                    label="Old Password"
                    name="currentPassword"
                    type="password"
                  />
                </div>

                {/* <!-- Input --> */}
                <div className="form-group col-lg-7 col-md-12">
                  <PasswordField label="New Password" name="newPassword" />
                </div>

                {/* <!-- Input --> */}
                <div className="form-group col-lg-7 col-md-12">
                  <TextField
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                  />
                </div>

                {/* <!-- Input --> */}
                <div className="form-group col-lg-6 col-md-12">
                  <button
                    type="submit"
                    className="theme-btn btn-style-one btn-small"
                  >
                    Update
                  </button>
                </div>
              </div>
            </Form>
          </div>
        )}
      </Formik>
    </div>
  );
};

export default SecuritySettings;
