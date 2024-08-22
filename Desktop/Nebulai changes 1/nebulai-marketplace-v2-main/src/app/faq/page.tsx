import React from 'react'
import Faq from '@/components/faq/Faq'
import { Metadata } from "next";
import { metaDescription } from '@/utils/meta';

export const metadata: Metadata = {
  title: "Nebulai | FAQ",
  description:
    metaDescription,
};

const FaqPage = () => {
  return (
    <Faq/>
  )
}

export default FaqPage