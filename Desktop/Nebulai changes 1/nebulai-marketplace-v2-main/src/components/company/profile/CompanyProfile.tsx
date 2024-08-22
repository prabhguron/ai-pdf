"use client";
import React, { useEffect } from "react";
import BreadCrumb from "@/components/common/BreadCrumb";
import MainProfile from "./MainProfile";
import CompanyProjects from "./project/CompanyProjects";
import CompanyCaseStudies from "./caseStudy/CompanyCaseStudies";
import CompanyTeamMembers from "./team/CompanyTeamMembers";
import CompanyPartnerships from "./partnerships/CompanyPartnerships";
import CompanyTestimonials from "./testimonials/CompanyTestimonials";
import CompanySocials from "./CompanySocials";
import { useQueryClient } from "@tanstack/react-query";
import RequiredLabel from "@/components/common/RequiredLabel";
import OptionalLabel from "@/components/common/OptionalLabel";

const CompanyProfile = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    return () => {
      queryClient.invalidateQueries(['validateUserProfile'])
    }
  },[])

  return (
    <>
      <BreadCrumb title="My Profile!" />
      {/* breadCrumb */}

      <div className="row">
        <div className="col-lg-12">
          <div className="ls-widget">
            <div className="tabs-box">
              <div className="widget-title">
                <h4>My Profile</h4>
                <RequiredLabel/>
              </div>
              <MainProfile />
            </div>
          </div>

          <div className="ls-widget">
            <div className="tabs-box">
              <div className="widget-title">
                <h3>Projects</h3>
                <OptionalLabel/>
              </div>
              {/* End widget-title */}

              <div className="widget-content">
                <CompanyProjects />
              </div>
            </div>
          </div>

          <div className="ls-widget">
            <div className="tabs-box">
              <div className="widget-title">
                <h3>Case Studies</h3>
                <OptionalLabel/>
              </div>
              {/* End widget-title */}

              <div className="widget-content">
                <CompanyCaseStudies/>
              </div>
            </div>
          </div>

          <div className="ls-widget">
            <div className="tabs-box">
              <div className="widget-title">
                <h3>Team Members</h3>
                <OptionalLabel/>
              </div>
              {/* End widget-title */}

              <div className="widget-content">
                <CompanyTeamMembers />
              </div>
            </div>
          </div>
          
          <div className="ls-widget">
            <div className="tabs-box">
              <div className="widget-title">
                <h3>Partnerships</h3>
                <OptionalLabel/>
              </div>
              {/* End widget-title */}

              <div className="widget-content">
                <CompanyPartnerships />
              </div>
            </div>
          </div>

          <div className="ls-widget">
            <div className="tabs-box">
              <div className="widget-title">
                <h3>Testimonials</h3>
                <OptionalLabel/>
              </div>
              {/* End widget-title */}

              <div className="widget-content">
                <CompanyTestimonials />
              </div>
            </div>
          </div>

          <div className="ls-widget">
            <div className="tabs-box">
              <div className="widget-title">
                <h3>Socials</h3>
                <OptionalLabel/>
              </div>
              {/* End widget-title */}

              <div className="widget-content">
                <CompanySocials />
              </div>
            </div>
          </div>

        </div>
      </div>
      {/* End .row */}
    </>
  );
};

export default CompanyProfile;
