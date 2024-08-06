import AppLogin from '@/components/auth/app/AppLogin'
import React from 'react'
import type { Metadata } from "next";
import { metaDescription } from '@/utils/meta';

export const metadata: Metadata = {
  title: "Nebulai | Sign In",
  description:
    metaDescription,
}; 

const AppSignInPage = () => {
  return (
    <AppLogin/>
  )
}

export default AppSignInPage