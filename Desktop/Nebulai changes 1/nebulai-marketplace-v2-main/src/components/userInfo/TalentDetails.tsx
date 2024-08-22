"use client";
import React from "react";
import StarRatings from "react-star-ratings";
import Social from "@/components/footer/Social";
import TalentSkills from "./TalentSkills";
import NebulaiApi from "@/neb-api/NebulaiApi";
import { useQuery } from "@tanstack/react-query";
import LoaderCommon from "@/components/LoaderCommon";
import moment from "moment";
import CertificatesShowCase from "./CertificatesShowCase";
import Image from "next/image";
import { convertRating } from "@/utils/helper";
const TalentDetails = ({ talentId }: { talentId: string }) => {
  const { getTalent } = NebulaiApi();

  const { data: talentDetails, isLoading } = useQuery({
    queryFn: () => getTalent(talentId),
    queryKey: ["talent", talentId],
  });

  const talentData: TalentInfo = talentDetails?.talent ?? null;

  if (isLoading) {
    return <LoaderCommon />;
  }

  if (!isLoading && !talentData) {
    return (
      <div className="loading-container">
        <h2>Talent Info Not Found 😢</h2>
      </div>
    );
  }

  const {
    fullName,
    profileImage,
    jobTitle,
    created_at,
    languages,
    skills,
    bio,
    socialNetwork,
    education,
    workExperiences,
    certificates,
    location,
    profileTags,
    overAllWorkExperience,
  } = talentData;

  const dateObj = moment(created_at);
  const memberSinceDate = dateObj.format("MMM DD, YYYY");

  let certificateImages: (File | string)[] = [];
  certificates?.forEach((certificate: TalentCertificate) => {
    if (certificate?.certificatesImages?.length) {
      certificate?.certificatesImages?.forEach((img) => {
        certificateImages.push(img);
      });
    }
  });

  return (
    <section className="candidate-detail-section style-three">
      <div className="upper-box">
        <div className="auto-container">
          <div className="candidate-block-six">
            <div className="inner-box">
              <figure className="image">
                <Image
                  src={profileImage}
                  alt={fullName}
                  width={250}
                  height={250}
                  loading="lazy"
                />
              </figure>
              <div className="rating">
                <StarRatings
                  rating={convertRating(talentData.rating) as number}
                  starRatedColor="#ab31ff"
                  numberOfStars={5}
                  name="talent-rating"
                  starDimension="25px"
                  starSpacing="0px"
                  svgIconViewBox="0 0 16 16"
                  svgIconPath="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
                />
              </div>
              <h4 className="name">{fullName}</h4>
              <span className="designation">{jobTitle}</span>

              <div className="content">
                <ul className="post-tags">
                  {profileTags?.map((val, i) => <li key={i}>{val}</li>)}
                </ul>
                {/* End candidate-info */}
              </div>
              {/* End .content */}
            </div>
          </div>
          {/*  <!-- Candidate block Five --> */}
        </div>
      </div>
      {/* <!-- Upper Box --> */}

      <div className="candidate-detail-outer">
        <div className="auto-container">
          <div className="row">
            <div className="sidebar-column col-lg-4 col-md-12 col-sm-12">
              <aside className="sidebar">
                <div className="sidebar-widget">
                  <div className="widget-content">
                    <ul className="job-overview">
                      <li>
                        <i className="icon icon-calendar"></i>
                        <h5>Overall Experience:</h5>
                        <span>{overAllWorkExperience} Years</span>
                      </li>

                      <li>
                        <i className="icon icon-language"></i>
                        <h5>Language:</h5>
                        <span>
                          {languages?.map((l) => l.toUpperCase()).join(",")}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                {/* End .sidebar-widget conadidate overview */}

                <div className="sidebar-widget social-media-widget">
                  <h4 className="widget-title">Social media</h4>
                  <div className="widget-content">
                    <div className="social-links">
                      <Social socials={socialNetwork} />
                    </div>
                  </div>
                </div>
                {/* End .sidebar-widget social-media-widget */}

                <div className="sidebar-widget">
                  <h4 className="widget-title">Professional Skills</h4>
                  <div className="widget-content">
                    <ul className="job-skills">
                      <TalentSkills skills={skills} />
                    </ul>
                  </div>
                </div>
                {/* End .sidebar-widget skill widget */}
              </aside>
              {/* End .sidebar */}
            </div>
            {/* End .sidebar-column */}

            <div className="content-column col-lg-8 col-md-12 col-sm-12">
              <div className="job-detail">
                <h4>Candidates About</h4>
                <p>{bio}</p>

                {/* <!-- Portfolio --> */}
                <div className="portfolio-outer">
                  <div className="row">
                    <CertificatesShowCase
                      certificateImages={certificateImages}
                    />
                  </div>
                </div>

                {/* <!-- Talent Eduction Start --> */}
                <div className={`resume-outer`}>
                  <div className="upper-title">
                    <h4>Education</h4>
                  </div>

                  {education.map((edu) => (
                    <div className="resume-block" key={edu?._id}>
                      <div className="inner">
                        <span className="name">
                          {edu?.college?.split("")[0]}
                        </span>
                        <div className="title-box">
                          <div className="info-box">
                            <h3>{edu?.college?.toUpperCase()}</h3>
                            <span>{edu?.courseName?.toUpperCase()}</span>
                          </div>
                          <div className="edit-box">
                            <span className="year">{`${edu.startYear} - ${edu.endYear}`}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* <!-- Talent Work Exp Start --> */}
                <div className={`resume-outer theme-blue`}>
                  <div className="upper-title">
                    <h4>Work Experience</h4>
                  </div>

                  {workExperiences.map((exp) => (
                    <div className="resume-block" key={exp?._id}>
                      <div className="inner">
                        <span className="name">
                          {exp?.companyName?.split("")[0]}
                        </span>
                        <div className="title-box">
                          <div className="info-box">
                            <h3>{exp?.companyName?.toUpperCase()}</h3>
                            <span>{exp?.jobTitle?.toUpperCase()}</span>
                          </div>
                          <div className="edit-box">
                            <span className="year">{`${exp.startYear} - ${exp.endYear}`}</span>
                          </div>
                        </div>
                        <div className="text">{exp.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* End .content-column */}
          </div>
        </div>
      </div>
      {/* <!-- job-detail-outer--> */}
    </section>
  );
};

export default TalentDetails;
