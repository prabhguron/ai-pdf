import CompanyDetails from '@/components/userInfo/CompanyDetails'
import React from 'react'
import { Metadata } from "next";
import { metaDescription } from '@/utils/meta';

export const metadata: Metadata = {
  title: "Nebulai | Company Info",
  description: metaDescription,
};

const CompanyDetailsPage = ({
    params,
  }: {
    params: { companyId: string }
  }) => {
  return (
   <CompanyDetails companyId={params?.companyId}/>
  )
}

export default CompanyDetailsPage