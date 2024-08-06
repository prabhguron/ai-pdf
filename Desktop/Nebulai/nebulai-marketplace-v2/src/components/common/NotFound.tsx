import Image from "next/image";
import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <div
      className="error-page-wrapper "
      style={{
        backgroundImage: `url(/img/404.jpg)`,
      }}
      data-aos="fade"
    >
      <div className="content">
        <div className="logo">
          <Link href="/">
            <Image
              src="/img/logo1.png"
              alt="Nebuali"
              width={210}
              height={210}
            />
          </Link>
        </div>
        {/* End logo */}

        <h1>404!</h1>
        <p>The page you are looking for could not be found.</p>

        <Link
          className="theme-btn btn-style-three call-modal btn-small"
          href="/"
        >
          BACK TO HOME
        </Link>
      </div>
      {/* End .content */}
    </div>
  );
};

export default NotFound;
