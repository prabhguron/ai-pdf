"use client";
import Link from "next/link";
import NebConnectButton from "@/components/wallet/NebConnectButton";
import { disconnect } from "@wagmi/core";
import { menuToggle } from "@/redux/toggle/toggleSlice";
import { isActiveLink } from "@/utils/linkActiveChecker";
import { usePathname, useSearchParams } from "next/navigation";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { screenIsMobileSize } from "@/utils/helper";
import useWindowWidth from "@/hooks/useWindowWidth";
import { useEffect, useState } from "react";
import NebulaiApi from "@/neb-api/NebulaiApi";
import UserAvatar from "@/components/common/Avatar/UserAvatar";
// import { FaWallet } from "react-icons/fa";

const DashboardCompanySidebar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  let path: string = "";
  if (pathname && searchParams) {
    path = pathname + searchParams?.toString();
  }
  const { menu } = useAppSelector((state: RootState) => state.toggle);
  const {
    user,
    useWalletLinked,
    userProfile: userP,
  } = useAppSelector((state: RootState) => state.auth);
  const role: Role | "" = user?.role || "";
  let userProfile = null;
  if (role === "company") {
    userProfile = userP as CompanyUserProfile;
  } else if (role === "talent") {
    userProfile = userP as TalentUserProfile;
  }
  const profileImage = userProfile?.profileImage;
  const windowWidth = useWindowWidth();

  const mobileScreen_btnClasses =
    "float-none d-flex justify-content-center w-100";

  const dispatch = useAppDispatch();
  const { logoutUser } = NebulaiApi();

  // menu togggle handler
  const menuToggleHandler = () => {
    dispatch(menuToggle());
  };

  // logout handler
  const logoutHandler = async () => {
    menuToggleHandler();
    await logoutUser();
    await disconnect();
  };

  const employerMenuData = [
    {
      id: 1,
      name: "Dashboard",
      icon: "la-home",
      routePath: "/company/dashboard",
      active: "active",
    },
    {
      id: 2,
      name: "Marketplace",
      icon: "la-shopping-cart",
      routePath: "/company/marketplace",
      active: "active",
    },
    {
      id: 3,
      name: "Post a New Job",
      icon: "la-paper-plane",
      routePath: "/company/post-job",
      active: "active",
    },
    {
      id: 4,
      name: "My Jobs",
      icon: "la-briefcase",
      routePath: "/company/my-jobs",
      active: "active",
    },
    // {
    //   id: 5,
    //   name: "All Applicants",
    //   icon: "la-file-invoice",
    //   routePath: "/company/all-applicants",
    //   active: "active",
    // },
    // {
    //   id: 6,
    //   name: "Short List",
    //   icon: "la-list",
    //   routePath: "/company/short-list",
    //   active: "active",
    // },
    // {
    //   id: 5,
    //   name: "All Contracts",
    //   icon: "la-file-invoice",
    //   routePath: "/company/all-contracts",
    //   active: "active",
    // },
    {
      id: 5,
      name: "My Profile",
      icon: "la-user-tie",
      routePath: "/company/my-profile",
      active: "active",
    },
    {
      id: 6,
      name: "My Account",
      icon: "la-gear",
      routePath: "/company/my-account",
      active: "active",
    },
  ];

  return (
    <div className={`user-sidebar ${menu ? "sidebar_open" : ""}`}>
      {/* Start sidebar close icon */}
      <div className="pro-header text-end pb-0 mb-0 show-1023">
        <div className="fix-icon" onClick={menuToggleHandler}>
          <span className="flaticon-close"></span>
        </div>
      </div>
      {/* End sidebar close icon */}

      <nav className="sidebar-inner" aria-label="Main navigation">
        <ul className="navigation" role="menubar" aria-orientation="vertical">
          <li
            role="menuitem"
            className="toggle-expand"
            onClick={menuToggleHandler}
            aria-expanded={menu ? "true" : "false"}
            aria-label="Toggle sidebar expand"
          >
            <i className={`la la-angle-double-right`}></i>
          </li>
          {employerMenuData.map((item) => (
            <li
              className={`${isActiveLink(item.routePath, path) ? "active" : ""} mb-1`}
              key={item.id}
              onClick={() =>
                // only mobile nav should close when nav link is clicked
                screenIsMobileSize(windowWidth) && menuToggleHandler()
              }
              role="menuitem"
            >
              <Link href={item.routePath}>
                <i className={`la ${item.icon}`} aria-hidden="true"></i>
                <span className="routeName">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="my-4 px-0">
          {useWalletLinked && (
            <NebConnectButton
              btnLbl="Connect Wallet"
              btnCustomClass={
                screenIsMobileSize(windowWidth)
                  ? mobileScreen_btnClasses
                  : "d-none"
              }
            />
          )}
        </div>

        {user && (
          <div className="sidebar-signout mobile-only mt-3 pl-30px column-gap-3">
            {profileImage && <UserAvatar imageURI={profileImage} />}
            <Link href="#" onClick={logoutHandler}>
              <i className={`la la-sign-out`}></i> SignOut
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
};

export default DashboardCompanySidebar;