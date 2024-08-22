//import AuthGuard from "@/components/auth/AuthGuard";
import AuthRoleGuard from "@/components/auth/AuthRoleGuard";
//import FetchProfile from "@/components/common/FetchProfile";
import DashboardPageLayout from "@/components/company/DashboardPageLayout";
import React from "react";

const CompanyLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <DashboardPageLayout>
      {/* <AuthGuard> */}
        {/* <FetchProfile /> */}
        <AuthRoleGuard allowedRoles={["company"]}>{children}</AuthRoleGuard>
      {/* </AuthGuard> */}
    </DashboardPageLayout>
  );
};

export default CompanyLayout;
