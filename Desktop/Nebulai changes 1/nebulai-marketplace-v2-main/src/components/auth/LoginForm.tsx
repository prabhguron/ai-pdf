"use client";
import React from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { TextField } from "../form/TextField";
import Link from "next/link";
import SignInWithWalletBtn from "@/components/auth/SignInWithWalletBtn";
import useLoginActions from "@/hooks/useLoginActions";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { setLoading } from "@/redux/auth/authSlice";
import LoginSuccessBtn from "./LoginSuccessBtn";
import GitHubBtn from "@/components/auth/GitHubBtn";

const validate = Yup.object().shape({
  email: Yup.string().email("Email is invalid").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

interface LoginFormValues {
  email: string;
  password: string;
}

const initValues: LoginFormValues = {
  email: "",
  password: "",
};
const LoginForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isLoading = useAppSelector((state) => state.auth.loading);
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const { loginAction, fetchUserAndProfile } = useLoginActions();
  const loginSubmitHandler = async (data: LoginFormValues) => {
    try {
      const authResult = await loginAction(data);
      if (authResult?.status === "error") {
        dispatch(setLoading(false));
        toast?.error(authResult?.msg);
        return;
      }
      //Successfully logged in
      const result = await fetchUserAndProfile();
      if (result !== null) {
        dispatch(setLoading(false));
        if (result?.accessToken && result?.userRole) {
          router.push(`/${result?.userRole}/dashboard`);
          return;
        }
      }
    } catch (error) {}
    dispatch(setLoading(false));
    toast.error("Something went wrong");
  };

  return (
    <Formik
      initialValues={initValues}
      validationSchema={validate}
      onSubmit={loginSubmitHandler}
      enableReinitialize
    >
      {(formik) => (
        <Form className="login-form default-form">
          <div className="form-inner">
            <h3>LOGIN</h3>
            <div className="form-group col-lg-12 col-md-12">
              <TextField
                label="EMAIL"
                name="email"
                type="email"
                autoComplete="off"
              />
            </div>
            <div className="form-group col-lg-12 col-md-12">
              <TextField
                label="PASSWORD"
                name="password"
                type="password"
                autoComplete="off"
              />
            </div>
            <div className="form-group">
              <Link href="/forgot-password">FORGOT PASSWORD?</Link>
            </div>

            {!accessToken ? (
              <>
                <div className="form-group">
                  <button
                    className="theme-btn btn-style-one"
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
                      "SIGN IN"
                    )}
                  </button>
                </div>

                <p className="text-center">
                  Not a member?{" "}
                  <Link className="fw-bold" href="/register">
                    Register
                  </Link>
                </p>

                <div className="bottom-box">
                  <div className="divider">
                    <span>or</span>
                  </div>
                  <div className="d-flex flex-column flex-sm-row justify-content-evenly">
                    <GitHubBtn />
                    <SignInWithWalletBtn />
                  </div>
                </div>
              </>
            ) : (
              <>
                <LoginSuccessBtn/>
              </>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
