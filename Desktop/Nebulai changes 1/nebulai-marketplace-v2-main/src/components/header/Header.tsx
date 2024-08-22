
'use client';

import { RootState, useAppSelector } from "@/redux/store";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Header = ({ autoContainer = false, noLogin = false }) => {
  const authState = useAppSelector((state: RootState) => state.auth);
  const user = authState?.user ?? null;
  const role: Role | "" = user?.role || "";

  const [navbar, setNavbar] = useState(false);

  const changeBackground = () => {
    if (window.scrollY >= 10) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
  }, []);

  return (
    // <!-- Main Header-->
    <header
      // className={`main-header alternate -type-14  ${
      //   navbar ? "fixed-header animated slideInDown" : ""
      // }`}
      className={`main-header  ${
        navbar ? "fixed-header animated slideInDown" : ""
      }`}
    >
      <div className={`${autoContainer && "auto-container"}`}>
        {/* <!-- Main box --> */}
        <div className="main-box">
          {/* <!--Nav Outer --> */}
          <div className="nav-outer">
            <div className="logo-box">
              <div className="logo">
                <Link href="/">
                  <Image
                    src="/img/logo1.png"
                    width={200}
                    height={200}
                    alt="brand"
                    loading="lazy"
                  />
                </Link>
              </div>
            </div>
            {/* End .logo-box */}
          </div>
          {/* End .nav-outer */}

          <div className="outer-box">
            <div className="btn-box">
              {(user && role) ? (
                <Link
                  href={`/${role}/dashboard`}
                  className="theme-btn btn-style-three call-modal"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  {!noLogin && (
                    <Link
                      href="/login"
                      className="theme-btn btn-style-three call-modal"
                    >
                      Login
                    </Link>
                  )}

                  <Link href="/register" className="theme-btn btn-style-one">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
