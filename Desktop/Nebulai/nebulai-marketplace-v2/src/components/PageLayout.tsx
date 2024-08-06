"user client";
import React from "react";

import FooterMain from "./footer/FooterMain";
import MobileMenu from "./header/MobileMenu";
import ScrollToTop from "./ScrollToTop";
import Header from "./header/Header";

interface PageLayoutProps {
  noLogin?: boolean;
  children: React.ReactNode;
}

const PageLayout = (props: PageLayoutProps) => {
  const { children, noLogin } = props;
  return (
    <div className="page-wrapper">
      <span className="header-span"></span>
      <Header noLogin={noLogin} />
      <MobileMenu />
      {children}
      <ScrollToTop />
      <FooterMain />
    </div>
  );
};

export default PageLayout;
