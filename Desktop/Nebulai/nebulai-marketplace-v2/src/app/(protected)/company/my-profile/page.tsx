import CompanyProfile from '@/components/company/profile/CompanyProfile'
import React from 'react'
import { Metadata } from "next";
import { metaDescription } from '@/utils/meta';

export const metadata: Metadata = {
  title: "Nebulai | My Profile",
  description:
    metaDescription,
};
const CompanyProfilePage = () => {
  return (
    <>
        <CompanyProfile/>
    </>
  )
}

export default CompanyProfilePage