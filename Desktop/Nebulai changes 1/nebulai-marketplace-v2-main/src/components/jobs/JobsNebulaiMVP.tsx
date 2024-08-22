import React from "react";
import JobHeroImage from "./JobHeroImage";
import Link from "next/link";

const JobsNebulaiMVP = () => {
  return (
    <section className="banner-section -type-14">
      <div className="auto-container">
        <div className="row">
          <div className="content-column col-lg-6 col-md-12">
            <div
              className="inner-column"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="title-box">
                <h3 className="font-weight-bold">Welcome to Nebulai!</h3>
                <div className="text">
                  Unleash Innovation with the Power of Our Global Intelligent
                  Solutions and Talent Marketplace
                </div>
              </div>

              {/* <!-- Job Search Form --> */}
              <div data-aos="fade-up" data-aos-delay="500">
                <Link href="/register" className="theme-btn btn-style-one">
                  GET STARTED NOW
                </Link>
              </div>
              {/* <!-- Job Search Form --> */}
            </div>
          </div>
          {/* End .col */}

          <div className="image-column col-lg-4 col-md-5">
            <JobHeroImage />
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobsNebulaiMVP;

