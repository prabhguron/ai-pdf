import CompanyAccountSettings from "@/components/company/accountSettings/CompanyAccountSettings";
import React from "react";
import { Metadata } from "next";
import { metaDescription } from '@/utils/meta';

export const metadata: Metadata = {
  title: "Nebulai | My Account",
  description:
    metaDescription,
};
const CompanyAccountSettingsPage = () => {
  return (
    <>
      <CompanyAccountSettings />
    </>
  );
};

export default CompanyAccountSettingsPage;
