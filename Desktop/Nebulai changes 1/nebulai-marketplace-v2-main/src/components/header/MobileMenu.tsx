"use client";

import Link from "next/link";
import MobileSidebar from "./mobile-sidebar/MobileSidebar";
import NebConnectButton from "@/components/wallet/NebConnectButton";
import { useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import { menuToggle } from "@/redux/toggle/toggleSlice";
import Image from "next/image";
import UserAvatar from "../common/Avatar/UserAvatar";

const MobileMenu = () => {
  const {
    user,
    useWalletLinked,
    userProfile: userP,
  } = useAppSelector((state) => state.auth);
  const role: Role | "" = user?.role || "";
  let userProfile = null;
  if (role === "company") {
    userProfile = userP as CompanyUserProfile;
  } else if (role === "talent") {
    userProfile = userP as TalentUserProfile;
  }
  const profileImage = userProfile?.profileImage;

  const dispatch = useDispatch();
  // menu togggle handler
  const menuToggleHandler = () => {
    dispatch(menuToggle());
  };

  return (
    // <!-- Main Header-->
    <header className="main-header main-header-mobile">
      <div className="auto-container">
        {/* <!-- Main box --> */}
        <div className="inner-box">
          <div className="nav-outer">
            <div className="logo-box">
              <div className="my-2">
                <Link href="/">
                  <Image
                    src="/img/logo1.png"
                    width={200}
                    height={200}
                    alt="brand"
                  />
                </Link>
              </div>
            </div>
            {/* End .logo-box */}

            <MobileSidebar />
            {/* <!-- Main Menu End--> */}
          </div>
          {/* End .nav-outer */}

          <div className="outer-box">
            {useWalletLinked && (
              <button
                className="menu-btn hideNebBtn"
                aria-label="Connect Wallet"
              >
                <NebConnectButton btnLbl={"Connect Wallet"} />
              </button>
            )}

            {user ? (
              <a
                href="#"
                className="mobile-nav-toggler"
                onClick={menuToggleHandler}
                role="button"
                aria-label="Toggle sidebar"
              >
                <span
                  className="flaticon-menu-1"
                  aria-label="Toggle sidebar"
                ></span>
              </a>
            ) : (
              <a
                href="#"
                className="mobile-nav-toggler"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasMenu"
                role="button"
                aria-label="Toggle sidebar"
              >
                <span className="flaticon-menu-1"></span>
              </a>
            )}
            {/* user ? toggle <TalentDashboardSidebar /> || <CompanyDashboardSidebar /> : toggle <MobileSidebar /> */}
            {/* right humberger menu */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default MobileMenu;
