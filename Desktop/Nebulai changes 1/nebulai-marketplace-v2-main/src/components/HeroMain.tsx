"use client";
import React, { useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import JobHowItWorks from "@/components/jobs/JobHowItWorks";
import JobsAbout from "@/components/jobs/JobsAbout";
import JobsVideo from "@/components/jobs/JobsVideo";
import JobsNebulaiMVP from "@/components/jobs/JobsNebulaiMVP";
import { RootState, useAppSelector } from "@/redux/store";
import { redirect } from "next/navigation";

const HeroMain = () => {
  const authState = useAppSelector((state: RootState) => state.auth);
  const user = authState?.user ?? null;
  const role: Role | "" = user?.role || "";

  useEffect(() => {
    if (user && role) {
      redirect(`/${role}/dashboard`);
    }
  }, [user, role]);

  return (
    <PageLayout>
      <JobsNebulaiMVP />
      <JobHowItWorks />
      <JobsAbout />
      <JobsVideo />
    </PageLayout>
  );
};

export default HeroMain;

