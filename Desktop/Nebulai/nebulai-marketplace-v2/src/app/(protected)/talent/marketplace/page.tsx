import MarketPlaceMain from '@/components/marketplace/MarketPlaceMain'
import React from 'react'
import { Metadata } from "next";
import { metaDescription } from '@/utils/meta';

export const metadata: Metadata = {
  title: "Nebulai | Marketplace",
  description:
    metaDescription,
};
const TalentMarketPlacePage = () => {
  return (
    <>
        <MarketPlaceMain/>
    </>
  )
}

export default TalentMarketPlacePage