import React from "react";
import Link from "next/link";
import Image from "next/image";

const JobsAbout = () => {
  return (
    <section className="about-section-two style-two">
      <div className="auto-container">
        <div className="row">
          {/* <!-- Content Column --> */}
          <div className="content-column col-lg-6 col-md-12 col-sm-12 order-2">
            <div className="inner-column" data-aos="fade-left">
              <div className="sec-title">
                <h2>
                  Showcase your skills and get paid quickly and securely on Nebulai&apos;s platform. 
                </h2>
                <div className="text">
                Get additional protection when transacting with unknown parties through our Nebulai Escrow system. 
                </div>
              </div>
              <ul className="list-style-one">
                <li>Access to top solution providers and talent from around the world</li>
                <li>Secure and transparent payment system with fiat and crypto support</li>
                <li>Dispute any issues through the fast and secure Nebulai Mediation Service</li>
              </ul>
              <Link
                href="/register"
                className="theme-btn btn-style-seven"
              >
                Get Started
              </Link>
            </div>
          </div>
          {/* End .content-column */}

          {/* <!-- Image Column --> */}
          <div className="image-column col-lg-6 col-md-12 col-sm-12">
            <figure className="image-box" data-aos="fade-right">
              <Image src="/img/resource/job-hero/eco.png" alt="resource" width={600} height={400} />
            </figure>
          </div>
          {/* End image-column */}
        </div>
      </div>
    </section>
  );
};

export default JobsAbout;
