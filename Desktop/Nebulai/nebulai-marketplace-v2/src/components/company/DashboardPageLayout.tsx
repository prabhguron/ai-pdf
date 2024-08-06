"use client";
import React from "react";
import CopyrightFooter from "@/components/footer/CopyrightFooter";
import DashboardHeader from "@/components/header/DashboardHeader";
import MobileMenu from "@/components/header/MobileMenu";
import DashboardCompanySidebar from "./dashboard/DashboardCompanySidebar";
import LoadingOverlay from "react-loading-overlay-ts";
import { useAppSelector, RootState } from "@/redux/store";
import { useDispatch } from "react-redux";
import { menuToggle } from "@/redux/toggle/toggleSlice";
/* 
  Company Dashboard Layout
*/
const DashboardPageLayout = ({ children }: { children: React.ReactNode }) => {
  const { menu } = useAppSelector((state: RootState) => state.toggle);
  const loadingOverlay = useAppSelector((state) => state.toggle.loadingOverlay);

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
        {/* Company Sidebar */}
        <DashboardCompanySidebar />
        <section className="user-dashboard">
          <div className="dashboard-outer pt-1">{children}</div>
        </section>
        <CopyrightFooter social={false} />
      </div>
    </LoadingOverlay>
  );
};

export default DashboardPageLayout;
