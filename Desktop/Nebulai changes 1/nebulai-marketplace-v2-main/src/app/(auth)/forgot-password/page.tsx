import ForgotPassword from '@/components/auth/ForgotPassword'
import React from 'react'
import { Metadata } from "next";
import { metaDescription } from '@/utils/meta';

export const metadata: Metadata = {
  title: "Nebulai | Forgot Password",
  description: metaDescription,
};
const page = () => {
  return (
    <ForgotPassword/>
  )
}

export default page