"use client";
import React, { useEffect } from "react";
import AppRegisterForm from "@/components/auth/app/AppRegisterForm";
import NebulaiApi from "@/neb-api/NebulaiApi";

const AppRegister = () => {
  let storageAccessToken = localStorage.getItem("NEB_ACC");
  const { logoutUser } = NebulaiApi();

  useEffect(() => {
    if (storageAccessToken) {
      (async () => {
        await logoutUser();
      })();
    }
  }, [logoutUser]);

  return (
    <div className="login-section-custom">
      <AppRegisterForm />
    </div>
  );
};

export default AppRegister;
