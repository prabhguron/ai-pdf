//import AuthGuard from "@/components/auth/AuthGuard";
import AuthRoleGuard from "@/components/auth/AuthRoleGuard";
//import FetchProfile from "@/components/common/FetchProfile";
import DashboardPageLayout from "@/components/talent/DashboardPageLayout";
import React from "react";

const TalentLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <DashboardPageLayout>
       {/* <AuthGuard> */}
        {/* <FetchProfile /> */}
        <AuthRoleGuard allowedRoles={["talent"]}>{children}</AuthRoleGuard>
      {/* </AuthGuard> */}
    </DashboardPageLayout>
  );
};

export default TalentLayout;
