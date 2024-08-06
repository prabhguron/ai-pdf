"use client";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import { FaEnvelope } from "react-icons/fa";
import { toast } from 'react-toastify';
import { TextField } from "@/components/form/TextField";
import { updateUser } from "@/redux/auth/authSlice";
import NebulaiApi from "@/neb-api/NebulaiApi";
import { useAppDispatch, useAppSelector } from "@/redux/store";

const validate = Yup.object({
  companyName: Yup.string()
    .max(50, "Must be 50 characters or less")
    .required("Required")
});

interface SettingsFormInit{
  companyName: string;
}

const SettingsForm = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [edit, setEdit] = useState(false);
  const { updateUserPersonalInfo } = NebulaiApi();


  const initFormValues: SettingsFormInit = {
    companyName: user?.companyName || ""
  }

  const updateAccountInfoHandler = async (values: SettingsFormInit) => {
    try {
      const res = await updateUserPersonalInfo(values);
      if (res?.data) {
        const {status, message} = res.data;
        if(status === "success") {
          await dispatch(updateUser(values));
        }
        toast(message,{type: status});
      }
    } catch (error: any) {
      console.log(error.message);
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="widget-content">
      <Formik
        initialValues={initFormValues}
        validationSchema={validate}
        onSubmit={updateAccountInfoHandler}
        enableReinitialize
      >
        {(formik) => (
          <div>
            <Form className="default-form">
              <div className="row">
                <div className="form-group col-lg-12 col-md-12">
                  {/* <Avatar
                    name={`${user?.companyName}`}
                    round={true}
                  /> */}
                </div>
                <div className="form-group col-lg-12 col-md-12">
                  <FaEnvelope />{" "}
                  <span className="fw-bold">
                    <em>{user?.email}</em>
                  </span>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="input-group checkboxes square d-flex justify-content-end">
                    <input
                      type="checkbox"
                      name="edit-account-info"
                      id="edit-account-info"
                      onChange={() => {
                        formik.resetForm();
                        setEdit(!edit);
                      }}
                    />
                    <label
                      htmlFor="edit-account-info"
                      className="edit-account-info fw-bold"
                    >
                      <span className="custom-checkbox"></span> EDIT
                    </label>
                  </div>
                </div>
                <div className="form-group col-lg-12 col-md-12">
                  <TextField
                    label="Company Name"
                    name="companyName"
                    type="text"
                    disabled={!edit}
                  />
                </div>
                <div className="form-group col-lg-6 col-md-12">
                  {edit && (
                    <button
                      type="submit"
                      className="theme-btn btn-style-one btn-small"
                    >
                      Update
                    </button>
                  )}
                </div>
              </div>
            </Form>
          </div>
        )}
      </Formik>
    </div>
  );
};

export default SettingsForm;
