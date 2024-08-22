import type { Metadata } from "next";
import Login from "@/components/auth/Login";
import React from "react";
import { metaDescription } from '@/utils/meta';

export const metadata: Metadata = {
  title: "Nebulai | Login",
  description:
    metaDescription,
};

const LoginPage = () => {
  return <Login />;
};

export default LoginPage;
