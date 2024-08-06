import TalentDetails from '@/components/userInfo/TalentDetails'
import React from 'react'
import { Metadata } from "next";
import { metaDescription } from '@/utils/meta';

export const metadata: Metadata = {
  title: "Nebulai | Talent Info",
  description:
    metaDescription,
};
const TalentDetailsPage = ({
    params,
  }: {
    params: { talentId: string }
  }) => {
  return (
   <TalentDetails talentId={params?.talentId}/>
  )
}

export default TalentDetailsPage