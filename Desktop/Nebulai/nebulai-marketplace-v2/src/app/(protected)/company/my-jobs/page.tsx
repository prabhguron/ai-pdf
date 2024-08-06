import CompanyMyJobs from '@/components/company/CompanyMyJobs'
import React from 'react'
import { Metadata } from "next";
import { metaDescription } from '@/utils/meta';

export const metadata: Metadata = {
  title: "Nebulai | My Jobs",
  description:
    metaDescription,
};

const CompanyMyJobsPage = () => {
  return (
    <>
        <CompanyMyJobs/>
    </>
  )
}

export default CompanyMyJobsPage