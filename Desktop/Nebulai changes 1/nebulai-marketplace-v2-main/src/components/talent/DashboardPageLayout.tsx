"use client";
import React from "react";
import CopyrightFooter from "@/components/footer/CopyrightFooter";
import DashboardHeader from "@/components/header/DashboardHeader";
import MobileMenu from "@/components/header/MobileMenu";
import TalentDashboardSidebar from "./dashboard/TalentDashboardSidebar";
import { useAppSelector, RootState } from "@/redux/store";
import { useDispatch } from "react-redux";
import { menuToggle } from "@/redux/toggle/toggleSlice";
import LoadingOverlay from "react-loading-overlay-ts";
/* 
  Talent Dashboard Layout
*/
const DashboardPageLayout = ({ children }: { children: React.ReactNode }) => {
  const loadingOverlay = useAppSelector((state) => state.toggle.loadingOverlay);
  const { menu } = useAppSelector((state: RootState) => state.toggle);

  const dispatch = useDispatch();
  // menu togggle handler
  const menuToggleHandler = () => {
    dispatch(menuToggle());
  };

  return (
    <LoadingOverlay active={loadingOverlay} spinner text="Please Wait...">
      <div className={`page-wrapper dashboard ${menu ? "sidebar_open" : ""}`}>
        <div onClick={menuToggleHandler} className="sidebar-backdrop"></div>
        <span className="header-span"></span>
        <DashboardHeader />
        <MobileMenu />
        {/* Talent Sidebar */}
        <TalentDashboardSidebar />
        <section className="user-dashboard">
          <div className="dashboard-outer">{children}</div>
        </section>
        <CopyrightFooter social={false} />
      </div>
    </LoadingOverlay>
  );
};

export default DashboardPageLayout;
