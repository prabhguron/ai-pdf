"use client";
import {
  ProSidebarProvider,
  Sidebar,
  Menu
} from "react-pro-sidebar";

import SidebarFooter from "./SidebarFooter";
import SidebarHeader from "./SidebarHeader";
import Link from "next/link";

const MobileSidebar = () => {
  const mobileMenuData:any = [];
  return (
    <div
      className="offcanvas offcanvas-start mobile_menu-contnet"
      tabIndex={-1}
      id="offcanvasMenu"
      data-bs-scroll="true"
    >
      <SidebarHeader />
      {/* End pro-header */}

      <ProSidebarProvider>
        <Sidebar>
          {mobileMenuData.map((item: any) => (
            <Link key={item.id} href={item.routePath} className={item.classStyle}>
              <Menu>{item.label}</Menu>
            </Link>
          ))}
        </Sidebar>      
      </ProSidebarProvider>

      <SidebarFooter />
    </div>
  );
};

export default MobileSidebar;
