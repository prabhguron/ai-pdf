"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import JobsApi from "@/neb-api/JobsApi";
import React, { useMemo } from "react";
import { FaBuilding } from "react-icons/fa";
import { BarLoader } from "react-spinners";
import {
  contractTypeOptions,
  experienceLevelOptions,
} from "@/utils/formConstants";
import { returnOptionLabel } from "@/utils/helper";
import Link from "next/link";
import Image from "next/image";

const JobCard = ({ job }:{job: AllJobItem}) => {
  return (
    <div className="job-block-four col-xl-3 col-lg-4 col-md-6 col-sm-12">
      <Link href={`/job/${job?._id}`} target="_blank">
        <div className="inner-box">
          <ul className="job-other-info">
            <li className="time">
              {returnOptionLabel(contractTypeOptions, job?.contractType)}
            </li>
            <li className="privacy">
              {returnOptionLabel(experienceLevelOptions, job?.experienceLevel)}
            </li>
          </ul>
          <span className="company-logo">
            {job?.companyImage ? (
              <Image src={job?.companyImage} alt={job?.companyProfileId?.companyName} width={250}
              height={250}/>
            ) : (
              <FaBuilding className="mt-3" size={60} />
            )}
          </span>
          <span className="company-name">{job?.companyProfileId?.companyName}</span>
          <h4>{job?.jobTitle}</h4>
          <div className="location">
            <span className="icon flaticon-map-locator"></span>
            {job?.location}
          </div>
        </div>
      </Link>
    </div>
  );
};

const JobsMarket = () => {
  const { getAllJobs } = JobsApi();
  const {
    data: allJobsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["jobsMarket"],
    cacheTime: Infinity,
    getNextPageParam: (prevData: GetAllJobsResponse) => prevData.nextPage,
    queryFn: ({ pageParam = 0 }) =>
      getAllJobs({
        skip: pageParam,
        companyMeta: true,
        forMarket: true,
      }),
  });

  const jobs = allJobsData?.pages?.reduce((acc: any, page) => {
    return [...acc, ...page?.jobs];
  }, []);

  const memoizedJobsData = useMemo(() => jobs || [], [jobs]);
  const jobCount = allJobsData?.pages[0]?.totalCount || 0;
  const jobListingCount = memoizedJobsData?.length || 0;

  const loadMoreJobsHandler = async () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  return (
    <>
      <div className="ls-switcher">
        <div className="showing-result">
          <div className="text pt-3">
            <strong>{jobCount}</strong> Jobs
          </div>
        </div>
        {/* End .showing-result */}

        <div className="sort-by d-none">
          <button
            className="btn btn-danger text-nowrap me-2"
            style={{ minHeight: "45px", marginBottom: "15px" }}
          >
            Clear All
          </button>

          <select className="chosen-single form-select">
            <option value="">Sort by (default)</option>
            <option value="asc">Newest</option>
            <option value="des">Oldest</option>
          </select>
          {/* End select */}

          <select className="chosen-single form-select ms-3 ">
            <option
              value={JSON.stringify({
                start: 0,
                end: 0,
              })}
            >
              All
            </option>
            <option
              value={JSON.stringify({
                start: 32,
                end: 36,
              })}
            >
              35 per page
            </option>
            <option
              value={JSON.stringify({
                start: 35,
                end: 41,
              })}
            >
              40 per page
            </option>
          </select>
          {/* End select */}
        </div>
        {/* End sort by filter */}
      </div>
      {/* <!-- ls Switcher --> */}

      <div className="row">
        {memoizedJobsData.map((jobInfo: AllJobItem) => (
          <JobCard key={jobInfo?._id} job={jobInfo} />
        ))}

        {(!isLoading && memoizedJobsData && memoizedJobsData?.length <= 0) && (
          <div className="text-center p-11rem fw-bolder">No Job Posts 📃</div>
        )}

        {isLoading && (
          <div className="d-flex justify-content-center p-8rem fw-bolder">
            <BarLoader color="#ab31ff" />
          </div>
        )}
      </div>

      <div className="ls-show-more mt-3">
        <p className="mb-2">
          Showing {jobListingCount} of {jobCount} Jobs
        </p>
        {hasNextPage ? (
          <button
            className="show-more mb-3"
            onClick={loadMoreJobsHandler}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "Loading..." : "Show More"}
          </button>
        ) : (
          jobListingCount > 0 && (
            <div className="text-center">You are at the end of Jobs ⚡️</div>
          )
        )}
      </div>
    </>
  );
};

export default JobsMarket;
