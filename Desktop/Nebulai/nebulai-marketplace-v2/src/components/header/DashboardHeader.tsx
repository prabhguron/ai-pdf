"use client";

import { useEffect, useState } from "react";
import NebConnectButton from "@/components/wallet/NebConnectButton";
import { disconnect } from "@wagmi/core";
import NebulaiApi from "@/neb-api/NebulaiApi";
import { capitalizeFirstLetter } from "@/utils/helper";
import Link from "next/link";
import { useAppSelector } from "@/redux/store";
import Image from "next/image";
import UserAvatar from "../common/Avatar/UserAvatar";

const DashboardHeader = () => {
  //const navigate = useNavigate();
  const {
    user,
    useWalletLinked,
    userProfile: userP,
  } = useAppSelector((state) => state.auth);
  const firstName = user?.firstName || "";
  const userName = user?.userName;
  const role: Role | "" = user?.role || "";
  let userProfile = null;
  if (role === "company") {
    userProfile = userP as CompanyUserProfile;
  } else if (role === "talent") {
    userProfile = userP as TalentUserProfile;
  }
  const profileImage = userProfile?.profileImage;

  const [navbar, setNavbar] = useState(false);
  const { logoutUser } = NebulaiApi();

  const changeBackground = () => {
    if (window.scrollY >= 0) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
  }, []);

  const logoutHandler = async () => {
    await logoutUser();
    await disconnect();
    //navigate('/login', {replace: true})
  };

  return (
    // <!-- Main Header-->
    <header
      className={`main-header header-shaddow  ${navbar ? "fixed-header " : ""}`}
    >
      <div className="container-fluid">
        {/* <!-- Main box --> */}
        <div className="main-box">
          {/* <!--Nav Outer --> */}
          <div className="nav-outer">
            <div className="logo-box">
              <div className="logo">
                <Link href="/">
                  <Image
                    alt="brand"
                    src="/img/logo1.png"
                    width={154}
                    height={50}
                  />
                </Link>
              </div>
            </div>
            {/* End .logo-box */}

            {/* <!-- Main Menu End--> */}
          </div>
          {/* End .nav-outer */}

          <div className="outer-box">
            {/* <button className="menu-btn">
              <span className="count">1</span>
              <span className="icon la la-heart-o"></span>
            </button> */}

            <button className="menu-btn">
              {useWalletLinked && (
                <NebConnectButton btnLbl={"Connect Wallet"} />
              )}
            </button>

            {/* <!-- Dashboard Option --> */}
            <div className="dropdown dashboard-option">
              <a
                className="dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {profileImage && (
                  <UserAvatar
                    imageURI={profileImage}
                    fallbackName={userName ?? ""}
                  />
                )}
                {/* <img
                  alt="avatar"
                  className="thumb"
                  src="/img/resource/company-6.png"
                  width={50}
                  height={50}
                /> */}
                {/* {user?.userName && <Avatar name={user?.userName} round={true} size={'50'}/>} */}
                <span className="name">{capitalizeFirstLetter(firstName)}</span>
              </a>

              <ul className="dropdown-menu">
                <li className={`active mb-1`}>
                  <Link href="#" onClick={logoutHandler}>
                    <i className={`la la-sign-out`}></i> SignOut
                  </Link>
                </li>
              </ul>
            </div>
            {/* End dropdown */}
          </div>
          {/* End outer-box */}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
