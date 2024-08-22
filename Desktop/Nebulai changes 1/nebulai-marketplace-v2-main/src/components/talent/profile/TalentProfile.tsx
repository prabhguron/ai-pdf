"use client";
import React, { useEffect } from "react";
import Education from "./education/Education";
import SkillsBox from "./skills/SkillsBox";
import SocialNetworkBox from "./SocialNetworkBox";
import WorkExperiences from "./workExperience/WorkExperiences";
import Projects from "./project/Projects";
import Certification from "./certificates/Certification";
import { useQueryClient } from "@tanstack/react-query";
import RequiredLabel from "@/components/common/RequiredLabel";
import OptionalLabel from "@/components/common/OptionalLabel";
import MainProfile from "./MainProfile";
import ProfileRating from "./profileRating/ProfileRating";

const TalentProfile = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    return () => {
      queryClient.invalidateQueries(['validateUserProfile'])
    }
  },[])

  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="ls-widget profile-rating">
            <div className="tabs-box">
              <div className="widget-title">
                <h3>Nebulai Profile Rating</h3>
              </div>
              <ProfileRating />
            </div>
          </div>

          <div className="ls-widget">
            <div className="tabs-box">
              <div className="widget-title">
                <h3>My Profile</h3>   
                <RequiredLabel/>
              </div>
              <MainProfile />
            </div>
          </div>

          <div className="ls-widget">
            <div className="tabs-box">
              <div className="widget-title">
                <h3>Skills</h3>
                <RequiredLabel/>
              </div>
              {/* End widget-title */}

              <div className="widget-content">
                <SkillsBox />
              </div>
            </div>
          </div>

          <div className="ls-widget">
            <div className="tabs-box">
              <div className="widget-title p-2 justify-content-end">
                <RequiredLabel/>
              </div>
              <div className="widget-content">
                <WorkExperiences />
              </div>
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
                <Projects />
              </div>
            </div>
          </div>

          <div className="ls-widget">
            <div className="tabs-box">
              <div className="widget-title">
                <h3>Certificates</h3>
                <OptionalLabel/>
              </div>
              {/* End widget-title */}

              <div className="widget-content">
                <Certification />
              </div>
            </div>
          </div>
          

          <div className="ls-widget">
            <div className="tabs-box">
              <div className="widget-title p-2 justify-content-end">
                <OptionalLabel/>
              </div>
              <div className="widget-content">
                <Education />
              </div>
            </div>
          </div>


          <div className="ls-widget">
            <div className="tabs-box">
              <div className="widget-title">
                <h3>Social Network</h3>
                <OptionalLabel/>
              </div>
              {/* End widget-title */}

              <div className="widget-content">
                <SocialNetworkBox />
              </div>
            </div>
          </div>

        </div>
      </div>
      {/* End .row */}
    </>
  );
};

export default TalentProfile;
