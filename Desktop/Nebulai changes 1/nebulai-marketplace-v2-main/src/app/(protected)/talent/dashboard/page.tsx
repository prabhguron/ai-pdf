import React from 'react'
import TalentDashboard from '@/components/talent/dashboard/TalentDashboard'
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
        <TalentDashboard/>
    </>
  )
}

export default DashboardPage