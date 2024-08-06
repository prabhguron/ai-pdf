'use client';
import Image from "next/image";
import CopyrightFooter from "./CopyrightFooter";
import FooterContent from "./FooterContent";

const FooterMain = ({ footerStyle = "" }) => {
  return (
    <footer className={`main-footer ${footerStyle}`}>
      <div className="auto-container">
        {/* <!--Widgets Section--> */}
        <div className="widgets-section" data-aos="fade-up">
          <div className="row">
            <div className="big-column col-xl-4 col-lg-3 col-md-12">
              <div className="footer-column about-widget">
                <div className="logo">
                  <a href="#">
                    <Image src="/img/logo1.png" width={200} height={200} alt="brand" />
                  </a>
                </div>
                <p className="phone-num">
                  <span>Call us </span>
                  <a href="#">(954) 824-1488</a>
                </p>
                <p className="address">
                  66 W Flagler St suite 900,
                  <br /> Miami, FL 33130. <br />
                  <a href="mailto:support@nebulai.com" className="email">
                    support@nebulai.com
                  </a>
                </p>
              </div>
            </div>
            {/* End footer left widget */}

            <div className="big-column col-xl-8 col-lg-9 col-md-12">
              <div className="row">
                <FooterContent />
              </div>
            </div>
            {/* End col-xl-8 */}
          </div>
        </div>
      </div>
      {/* End auto-container */}

      <CopyrightFooter />
      {/* <!--Bottom--> */}
    </footer>
    //   {/* <!-- End Main Footer --> */}
  );
};

export default FooterMain;
