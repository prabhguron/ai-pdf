import TalentProfile from '@/components/talent/profile/TalentProfile'
import React from 'react'
import { Metadata } from "next";
import { metaDescription } from '@/utils/meta';

export const metadata: Metadata = {
  title: "Nebulai | My Profile",
  description:
    metaDescription,
};

const TalentProfilePage = () => {
  return (
    <>
        <TalentProfile/>
    </>
  )
}

export default TalentProfilePage