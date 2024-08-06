"use client";
import React, { useState } from "react";
import JobOverView from "@/components/details/job/JobOverview";
import JobSkills from "@/components/details/job/JobSkills";

import JobsApi from "@/neb-api/JobsApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import LoaderCommon from "@/components/LoaderCommon";
import { getJobData } from "@/utils/helper";

import { FaBuilding } from "react-icons/fa";

import JobApplicationApi from "@/neb-api/JobApplicationApi";
import { toast } from "react-toastify";
import useConfirm from "@/context/ConfirmDialog";
import Link from "next/link";
import { RootState, useAppSelector } from "@/redux/store";
import Image from "next/image";
import JobDetailsTop from "@/components/details/job/JobDetailsTop";

const JobDetails = ({ jobId }: { jobId: string }) => {
  const [appliedJob, setAppliedJob] = useState(false);
  const confirm = useConfirm();
  const { applyJob } = JobApplicationApi();
  const { user, accessToken } = useAppSelector(
    (state: RootState) => state.auth,
  );
  const { getJob } = JobsApi();
  const { data: jobData, isLoading } = useQuery({
    queryFn: () => getJob(jobId, { noListingCondition: true }),
    queryKey: ["job", jobId],
  });

  const { isLoading: applyingJob, mutate: applyForJob } = useMutation({
    mutationFn: applyJob,
    onSuccess: (response) => {
      const {
        status,
        data: { message },
      } = response;
      let badReqStatuses = [400, 409];
      if (badReqStatuses.includes(status)) {
        toast.error(message || "Application Failed");
        return;
      }
      if (status === 201) {
        toast.success("Application Submitted Successfully");
        setAppliedJob(true);
        return;
      } else {
        toast.error("Application Failed");
      }
    },
    onError: (error) => {
      toast.error("Something went wrong");
    },
  });

  if (isLoading) {
    return <LoaderCommon />;
  }

  if (!isLoading && !jobData) {
    return (
      <div className="loading-container">
        <h2>Job Not Found 😢</h2>
      </div>
    );
  }

  const {
    companyName,
    companyId,
    companyImage,
    jobTitle,
    location,
    companyProfileId,
    userId,
    postedOn,
    postedOnRaw,
    compensation,
    currencyType,
    contractType,
    experienceLevel,
    jobDescriptionFormatted,
    applicationDeadlineFormatted,
    skillsRequired,
    applicationDeadline,
    alreadyApplied,
    isActive,
  } = getJobData(jobData);

  const applyForJobHandler = async () => {
    if (accessToken && user) {
      const choice = await confirm({
        title: "Apply",
        description: "Are you sure you want to apply?",
        btnLabel: "Yes",
        btnClass: "theme-btn btn-style-one btn-small",
        btnCloseClass: "btn-style-eight btn-small",
      });
      if (!choice) return;
      applyForJob(jobId);
    }
  };
  
  return (
    <section className="job-detail-section">
      <div className="job-detail-outer">
        <div className="auto-container">
          <div className="row">
            <div className="content-column col-lg-8 col-md-12 col-sm-12">
              <JobDetailsTop
                data={{
                  companyName,
                  companyImage,
                  jobTitle,
                  location,
                  compensation,
                  postedOnRaw,
                  currencyType,
                  contractType,
                  experienceLevel,
                  jobDescriptionFormatted,
                }}
              />

              {/* <!-- Related Jobs --> */}
            </div>
            {/* End .content-column */}

            <div className="sidebar-column col-lg-4 col-md-12 col-sm-12">
              <aside className="sidebar">
                <div className="btn-box">
                  {!appliedJob &&
                    isActive &&
                    user &&
                    user?.role === "talent" &&
                    !alreadyApplied && (
                      <button
                        className="theme-btn btn-style-one"
                        type="button"
                        name="log-in"
                        onClick={applyForJobHandler}
                        disabled={applyingJob}
                      >
                        {applyingJob ? (
                          <>
                            Please Wait...{" "}
                            <span
                              className="spinner-border spinner-border-sm pl-4"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          </>
                        ) : (
                          "Apply For Job"
                        )}
                      </button>
                    )}

                  {(appliedJob || alreadyApplied) && (
                    <button className="theme-btn btn-style-four no-hover fw-bold" disabled>
                      <span className="fa fa-check"></span>&nbsp; Application
                      submitted
                    </button>
                  )}
                </div>
                {/* End apply for job btn */}

                {/* <!-- Modal --> */}
                <div
                  className="modal fade"
                  id="applyJobModal"
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="apply-modal-content modal-content">
                      <div className="text-center">
                        <h3 className="title">Apply for this job</h3>
                        <button
                          type="button"
                          className="closed-modal"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* End .modal */}

                <div className="sidebar-widget">
                  {/* <!-- Job Overview --> */}
                  <h4 className="widget-title">Job Overview</h4>
                  <JobOverView
                    {...jobData}
                    compensation={compensation}
                    postedOnRaw={postedOnRaw}
                    applicationDeadlineFormatted={applicationDeadlineFormatted}
                  />

                  <h4 className="widget-title mt-3">Job Skills</h4>
                  <div className="widget-content">
                    <JobSkills skillsInfo={skillsRequired} />
                  </div>
                  {/* <!-- Job Skills --> */}
                </div>
                {/* End .sidebar-widget */}

                <div className="sidebar-widget company-widget">
                  <div className="widget-content">
                    <div className="company-title">
                      <div className="company-logo">
                        {companyImage ? (
                          <Image
                            src={companyImage}
                            alt="logo"
                            width={50}
                            height={50}
                          />
                        ) : (
                          <FaBuilding size={50} />
                        )}
                      </div>
                      <h5 className="company-name">{companyName}</h5>
                      <Link
                        href={`/company-info/${companyId}`}
                        className="profile-link"
                      >
                        View company profile
                      </Link>
                    </div>
                    {/* End company title */}
                  </div>
                </div>

                {/* 
                  <div className="sidebar-widget contact-widget">
                    <h4 className="widget-title">Contact Us</h4>
                    <div className="widget-content">
                      <div className="default-form">
                        <Contact />
                      </div>
                    </div>
                  </div> */}
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

export default JobDetails;
