import Link from "next/link";
import React from "react";
import type { Metadata } from "next";
import { metaDescription } from '@/utils/meta';

export const metadata: Metadata = {
  title: "Nebulai | Auth Error",
  description:
    metaDescription,
};

const AppAuthErrorPage = () => {
  return (
    <div
      className="error-page-wrapper "
      style={{
        backgroundImage: `url(/img/404.jpg)`,
      }}
      data-aos="fade"
    >
      <div className="content">
        <h1>Oops!</h1>
        <p>Looks like there was an issue. Please try again later</p>

        <Link
          className="theme-btn btn-style-three call-modal btn-small"
          href="/login"
        >
          LOGIN
        </Link>
      </div>
      {/* End .content */}
    </div>
  );
};

export default AppAuthErrorPage;
