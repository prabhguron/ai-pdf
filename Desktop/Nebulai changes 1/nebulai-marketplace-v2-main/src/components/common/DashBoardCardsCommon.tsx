"use client"
import { useQuery } from "@tanstack/react-query";
import NebulaiApi from "@/neb-api/NebulaiApi";
import React from "react";
import CompanyDashboardStats from "../company/dashboard/CompanyDashboardStats";
import TalentDashboardStats from "../talent/dashboard/TalentDashboardStats";
import { RootState, useAppSelector } from "@/redux/store";

const DashBoardCardsCommon = () => {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const role = user?.role || "";
  const { getUserStats } = NebulaiApi();
  const { data, isLoading } = useQuery({
    queryKey: ["userStats", role],
    cacheTime: Infinity,
    queryFn: getUserStats,
  });

  let dashboardStats = null;
  switch (role) {
    case "talent":
        dashboardStats = <TalentDashboardStats {...data}/>
      break;
    case "company":
        dashboardStats = <CompanyDashboardStats {...data}/>
      break;
    default:
      break;
  }

  return <>{dashboardStats}</>;
};

export default DashBoardCardsCommon;
