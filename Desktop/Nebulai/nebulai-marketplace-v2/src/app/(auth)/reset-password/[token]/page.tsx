import ResetPassword from "@/components/auth/ResetPassword";
import React from "react";
import { Metadata } from "next";
import { metaDescription } from "@/utils/meta";

export const metadata: Metadata = {
  title: "Nebulai | Reset Password",
  description: metaDescription,
};

const ResetPasswordPage = ({ params }: { params: { token: string } }) => {
  return <ResetPassword token={params?.token}/>;
};

export default ResetPasswordPage;
