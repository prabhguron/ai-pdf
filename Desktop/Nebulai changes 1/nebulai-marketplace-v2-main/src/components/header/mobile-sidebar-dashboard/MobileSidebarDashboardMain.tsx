"use client";
import {
    ProSidebarProvider,
    Sidebar,
    Menu,
    MenuItem,
    SubMenu,
} from "react-pro-sidebar";


import SidebarFooterDashboard from "./SidebarFooterDashboard";
import SidebarHeaderDashboard from "./SidebarHeaderDashboard";


const MobileSidebarDashboardMain = () => {

    const mobileMenuData:{
        id: string;
        label: string;
        items: {name: string}[];
    }[] = [];

    return (
        <div
            className="offcanvas offcanvas-start mobile_menu-contnet"
            tabIndex={-1}
            id="offcanvasMenu"
            data-bs-scroll="true"
        >
            <SidebarHeaderDashboard />
            {/* End pro-header */}

            <ProSidebarProvider>
                <Sidebar>
                    <Menu>
                        {mobileMenuData.map((item) => (
                            <SubMenu
                                label={item.label}
                                key={item.id}
                            >
                                {item?.items.map((menuItem, i) => (
                                    <MenuItem
                                        key={i}
                                        // routerLink={
                                        //     <Link href={'#'} />
                                        // }
                                    >
                                        {menuItem.name}
                                    </MenuItem>
                                ))}
                            </SubMenu>
                        ))}
                    </Menu>
                </Sidebar>
            </ProSidebarProvider>

            <SidebarFooterDashboard />
        </div>
    );
};

export default MobileSidebarDashboardMain;
