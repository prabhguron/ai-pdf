import PageLayout from "@/components/PageLayout";
import React from "react";

const UserInfoLayout = ({ children }: { children: React.ReactNode }) => {
  return <PageLayout>{children}</PageLayout>;
};

export default UserInfoLayout;
