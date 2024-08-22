import TalentAccountSettings from "@/components/talent/accountSettings/TalentAccountSettings"; 
import React from "react";
import { Metadata } from "next";
import { metaDescription } from '@/utils/meta';

export const metadata: Metadata = {
  title: "Nebulai | My Account",
  description:
    metaDescription,
};

const TalentAccountSettingsPage = () => {
  return (
    <>
      <TalentAccountSettings />
    </>
  );
};

export default TalentAccountSettingsPage;