"use client";
import React from "react";
import Social from "@/components/footer/Social";
import RelatedJobsCompany from "./RelatedJobsCompany";
import { useQuery } from "@tanstack/react-query";
import LoaderCommon from "@/components/LoaderCommon";
import CompanyProfileApi from "@/neb-api/CompanyProfileApi";
import { FaBuilding } from "react-icons/fa";
import { technologyOptions } from "@/utils/formConstants";
import Image from "next/image";

const CompanyDetails = ({companyId}:{companyId: string}) => {
  const { getCompany } = CompanyProfileApi();
  const { data: companyDetails, isLoading } = useQuery({
    queryFn: () => getCompany(companyId),
    queryKey: ["company", companyId],
  });

  const companyData:CompanyInfo = companyDetails?.company ?? null
  const companyRecentJobs =  companyDetails?.recentJobs ?? []


  if (isLoading) {
    return (
        <LoaderCommon />
    );
  }

  if (!isLoading && !companyData) {
    return (
        <div className="loading-container">
          <h2>Company Info Not Found 😢</h2>
        </div>
    );
  }

  const {
    companyName,
    profileImage,
    location,
    industry,
    email,
    description,
    size: companySize,
    socialNetwork,
    technologies
  } = companyData;


  return (
      <section className="job-detail-section">
        {/* <!-- Upper Box --> */}
        <div className="upper-box">
          <div className="auto-container">
            <div className="job-block-seven">
              <div className="inner-box">
                <div className="content">
                  <span className="company-logo">
                    {profileImage ? (
                      <Image src={profileImage} alt="logo" width={250} height={250} loading="lazy" />
                    ) : (
                      <FaBuilding size={90} />
                    )}
                  </span>
                  <h4>{companyName}</h4>

                  <ul className="job-info">
                    <li>
                      <span className="icon flaticon-map-locator"></span>
                      {location}
                    </li>
                    {/* compnay info */}
                    <li>
                      <span className="icon flaticon-briefcase"></span>
                      {industry}
                    </li>
                    <li>
                      <span className="icon flaticon-mail"></span>
                      {email}
                    </li>
                    {/* salary info */}
                  </ul>
                  
                </div>
                {/* End .content */}

              </div>
            </div>
            {/* <!-- Job Block --> */}
          </div>
        </div>
        {/* <!-- Upper Box --> */}

        {/* <!-- job-detail-outer--> */}
        <div className="job-detail-outer">
          <div className="auto-container">
            <div className="row">
              <div className="content-column col-lg-8 col-md-12 col-sm-12">
                <div className="job-detail">
                  <h4>About Company</h4>
                  <p>{description}</p>
                  {/* 
                  {(projectImages && projectImages.length) && (
                    <div className="row images-outer"><GalleryBox galleryItems={projectImages}/></div>
                  )} */}
                  
                </div>

               {(!!companyRecentJobs.length) && (
                <div className="related-jobs">
                  <div className="title-box">
                    <h3>Recent Jobs</h3>
                  </div>
                  <RelatedJobsCompany recentJobs={companyRecentJobs} logo={profileImage}/>
                </div>
               )}
              </div>
              {/* End .content-column */}

              <div className="sidebar-column col-lg-4 col-md-12 col-sm-12">
                <aside className="sidebar">
                  <div className="sidebar-widget company-widget">
                    <div className="widget-content">
                      {/*  compnay-info */}
                      <ul className="company-info mt-0">
                        <li>
                          Industry: <span>{industry}</span>
                        </li>
                        <li>
                          Company size: <span>{companySize}</span>
                        </li>
                        <li>
                          Email: <span>{email}</span>
                        </li>
                        <li>
                          Location: <span>{location}</span>
                        </li>
                        <li>
                          Social media:
                          <Social socials={socialNetwork}/>
                        </li>
                      </ul>
                      {/* End compnay-info */}

                      <h4 className="widget-title mt-3 fw-bold">Technologies</h4>
                      <div className="widget-content mb-3">
                        <ul className="job-skills">
                            {technologies.map((tech, i) => (
                              <li key={i}>
                              <a href="#">{technologyOptions.find(t => t.value === tech)?.label ?? tech}</a>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      

                      {(socialNetwork && socialNetwork?.website) && (
                         <div className="btn-box">
                          <a
                            href={socialNetwork?.website}
                            target="_blank"
                            rel="noreferrer"
                            className="theme-btn btn-style-three"
                            style={{ textTransform: "lowercase" }}
                          >
                            {socialNetwork?.website}
                          </a>
                        </div>
                      )}

                    </div>
                  </div>
                  {/* End company-widget */}
                </aside>
                {/* End .sidebar */}
              </div>
              {/* End .sidebar-column */}
            </div>
          </div>
        </div>
        {/* <!-- job-detail-outer--> */}
      </section>
  );
};

export default CompanyDetails;
