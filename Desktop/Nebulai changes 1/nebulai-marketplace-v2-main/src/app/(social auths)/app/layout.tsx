import React from 'react'
import PageLayout from '@/components/PageLayout';
import type { Metadata } from "next";
import { metaDescription } from '@/utils/meta';

export const metadata: Metadata = {
  title: "Nebulai | Auth",
  description:
    metaDescription,
};

const Layout = ({
    children,
  }: {
    children: React.ReactNode;
  }) => {
  return (
    <PageLayout noLogin={true}>
        {children}
    </PageLayout>
  )
}

export default Layout