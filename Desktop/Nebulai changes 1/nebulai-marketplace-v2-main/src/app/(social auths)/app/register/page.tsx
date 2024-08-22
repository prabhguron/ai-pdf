import AppRegister from "@/components/auth/app/AppRegister";
import { redirect } from "next/navigation";
import React from "react";
import type { Metadata } from "next";
import { metaDescription } from '@/utils/meta';

export const metadata: Metadata = {
  title: "Nebulai | Complete Registration",
  description:
    metaDescription,
};

const AppRegisterPage = ({
  searchParams,
}: {
  searchParams?: { [key: string]: any };
}) => {
  const token: string = searchParams?.t ?? "";
  const e: string = searchParams?.e ?? "";

  if (!token.length || !e?.length) {
    redirect("/login");
  }

  return (
    <>
      <AppRegister />
    </>
  );
};

export default AppRegisterPage;
