import React from "react";
import JobDetailsDescriptions from "@/components/details/job/JobDetailsDescriptions";
import Image from "next/image";
import { FaBuilding } from "react-icons/fa";
import { currencyImgMap } from "@/utils/formConstants";

interface JobDetailsTop {
  companyName?: string;
  companyImage: string;
  jobTitle: string;
  location: string;
  postedOnRaw: string;
  compensation: string;
  currencyType: string;
  contractType: string;
  experienceLevel: string;
  jobDescriptionFormatted: string;
}

const JobDetailsTop = ({ data }: { data: JobDetailsTop }) => {
  return (
    <>
      <div className="job-block-outer">
        <div className="job-block-seven">
          <div className="inner-box">
            <div className="content">
              <span className="company-logo">
                {data?.companyImage ? (
                  <Image
                    src={data?.companyImage}
                    alt="logo"
                    width={90}
                    height={90}
                  />
                ) : (
                  <FaBuilding size={90} />
                )}
              </span>
              <h4>{data?.jobTitle}</h4>

              <ul className="job-info">
                <li>
                  <span className="icon flaticon-briefcase"></span>
                  {data?.companyName}
                </li>
                {/* compnay info */}
                <li>
                  <span className="icon flaticon-map-locator"></span>
                  {data?.location}
                </li>
                {/* location info */}
                <li>
                  <span className="icon flaticon-clock-3"></span>{" "}
                  {data?.postedOnRaw}
                </li>
                {/* time info */}
                <li>
                  <Image
                    className="mr-4"
                    src={currencyImgMap?.[data?.currencyType]}
                    width={30}
                    height={30}
                    alt={data?.currencyType}
                    loading="lazy"
                  />
                  <span className="fw-bolder">
                    {data?.compensation} {data?.currencyType?.toUpperCase()}
                  </span>
                </li>
                {/* salary info */}
              </ul>
              {/* End .job-info */}

              <ul className="job-other-info">
                <li className="time">{data?.contractType}</li>
                <li className="privacy">{data?.experienceLevel}</li>
              </ul>
              {/* End .job-other-info */}
            </div>
            {/* End .content */}
          </div>
        </div>
        {/* <!-- Job Block --> */}
      </div>
      {/* End job-block-outer */}

      <JobDetailsDescriptions jobDescription={data?.jobDescriptionFormatted} />
    </>
  );
};

export default JobDetailsTop;
