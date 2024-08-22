import React from 'react'
import CompanyDashboard from '@/components/company/dashboard/CompanyDashboard'
import { Metadata } from "next";
import { metaDescription } from '@/utils/meta';

export const metadata: Metadata = {
  title: "Nebulai | Dashboard",
  description:
    metaDescription,
};
const DashboardPage = () => {
  return (
    <>
        <CompanyDashboard/>
    </>
  )
}

export default DashboardPage