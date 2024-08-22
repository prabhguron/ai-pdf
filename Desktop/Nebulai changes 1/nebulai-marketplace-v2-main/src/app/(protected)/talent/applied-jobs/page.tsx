import AppliedJobs from '@/components/talent/AppliedJobs'
import React from 'react'
import { Metadata } from "next";
import { metaDescription } from '@/utils/meta';

export const metadata: Metadata = {
  title: "Nebulai | Applied Jobs",
  description:
    metaDescription,
};
const AppliedJobsPage = () => {
  return (
    <>
        <AppliedJobs/>
    </>
  )
}

export default AppliedJobsPage