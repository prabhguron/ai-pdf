import JobDetails from '@/components/details/job/JobDetails'
import React from 'react'

import { Metadata } from "next";
import { metaDescription } from '@/utils/meta';

export const metadata: Metadata = {
  title: "Nebulai | Job",
  description: metaDescription,
};

const JobDetailsPage = ({
    params,
  }: {
    params: { jobId: string }
  }) => {
  return (
   <JobDetails jobId={params?.jobId}/>
  )
}

export default JobDetailsPage