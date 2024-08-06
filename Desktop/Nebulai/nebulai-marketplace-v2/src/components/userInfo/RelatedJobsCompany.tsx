"use client"
import moment from "moment";
import Link from "next/link";
import {
  compensationRangeOptions,
  contractTypeOptions,
  experienceLevelOptions,
} from "@/utils/formConstants";
import { returnOptionLabel } from "@/utils/helper";
import Image from "next/image";

interface RecentJob {
  _id: string,
  jobTitle :string;
  experienceLevel :string;
  location :string;
  compensation :string;
  contractType :string;
  created_at: Date;
}

interface RelatedJobsCompanyProps{
  logo: string;
  recentJobs: RecentJob[]
}

const RelatedJobsCompany = ({ logo, recentJobs }: RelatedJobsCompanyProps) => {
  return (
    <>
      {recentJobs.map(
        ({
          _id: jobId,
          jobTitle,
          experienceLevel,
          location,
          compensation,
          contractType,
          created_at,
        }) => (
          <div className="job-block" key={jobId}>
            <div className="inner-box">
              <div className="content">
                <span className="company-logo">
                  <Image src={logo} alt="Logo" width={250} height={250}/>
                </span>
                <h4>
                  <Link href={`/job/${jobId}`}>{jobTitle}</Link>
                </h4>

                <ul className="job-info">
                  <li>
                    <span className="icon flaticon-map-locator"></span>
                    {location}
                  </li>

                  <li>
                    <span className="icon flaticon-clock-3"></span>{" "}
                    {moment(created_at).fromNow() ?? created_at}
                  </li>

                  <li>
                    <span className="icon flaticon-money"></span>{" "}
                    {returnOptionLabel(compensationRangeOptions, compensation)}
                  </li>
                </ul>

                <ul className="job-other-info">
                  <li className="time">
                    {returnOptionLabel(contractTypeOptions, contractType)}
                  </li>
                  <li className="privacy">
                    {returnOptionLabel(experienceLevelOptions, experienceLevel)}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default RelatedJobsCompany;
