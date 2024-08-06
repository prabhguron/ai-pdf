"use client";
import useConfirm from "@/context/ConfirmDialog";
import useApplicantStatus from "@/hooks/useApplicantStatus";
import JobApplicationApi from "@/neb-api/JobApplicationApi";
import { useAppSelector } from "@/redux/store";
import { applicationStatusBgColorMap } from "@/utils/constants";
import { getTelegramURI } from "@/utils/helper";
import { useInfiniteQuery } from "@tanstack/react-query";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo } from "react";
import { BarLoader } from "react-spinners";
import { FaEnvelope, FaCheck } from "react-icons/fa";
import { CgClose } from "react-icons/cg";

const JobFlowApplicants = () => {
  const confirm = useConfirm();
  const jobId = useAppSelector((state) => state.jobFlowSteps.jobData?._id);
  const stepActive = useAppSelector(
    (state) => state.jobFlowSteps.steps[1]?.active,
  );

  const { updateApplicationStatusMutation, updatingApplicationStatus } =
    useApplicantStatus();
  let { getTalentAllAppliedJobs: getJobApplicants } = JobApplicationApi();

  if (!stepActive) {
    getJobApplicants = async () => {
      return {
        allApplications: [],
        totalCount: 0,
        nextPage: null,
      };
    };
  }

  const {
    data: allTalentApplicationData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["jobApplicants", jobId],
    cacheTime: Infinity,
    getNextPageParam: (prevData: TalentAllAppliedReturn) => prevData.nextPage,
    queryFn: ({ pageParam = 0 }) =>
      getJobApplicants({
        skip: pageParam,
        forCompanyJob: true,
        jobId,
      }),
  });

  const appliedJobs = allTalentApplicationData?.pages?.reduce(
    (acc: any, page: any) => {
      return [...acc, ...page?.allApplications];
    },
    [],
  );
  const memoizedData = useMemo(() => appliedJobs || [], [appliedJobs]);
  const applicationListingCount = memoizedData?.length || 0;

  const loadMoreJobsHandler = async () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const shortlistHandler = async (applicationId: string) => {
    if (!applicationId) return;
    const choice = await confirm({
      title: "Shortlist?",
      description: "Are you sure you want to shortlist this talent?",
      btnLabel: "Yes",
      btnClass: "theme-btn btn-style-one btn-small",
      btnCloseClass: "btn-style-eight btn-small",
    });
    if (!choice) return;

    updateApplicationStatusMutation({
      applicationId,
      newStatus: "shortlisted",
    });
  };

  const rejectApplicantHandler = async (applicationId: string) => {
    if (!applicationId) return;
    const choice = await confirm({
      title: "Reject Applicant?",
      description: "Are you sure you want to reject this talent?",
      btnLabel: "Yes",
      btnClass: "theme-btn btn-style-one btn-small",
      btnCloseClass: "btn-style-eight btn-small",
    });
    if (!choice) return;

    updateApplicationStatusMutation({
      applicationId,
      newStatus: "rejected",
    });
  };

  const lblLoader = (btnLabel: string) => {
    return updatingApplicationStatus ? (
      <>
        <span
          className="spinner-border spinner-border-sm pl-4"
          role="status"
          aria-hidden="true"
        ></span>
      </>
    ) : (
      btnLabel
    );
  };

  return (
    <div>
      <h4 className="mb-3 fw-bold">All Applicants</h4>
      {memoizedData.map((applicant) => (
        <div
          className="candidate-block-three mb-2"
          key={applicant?.applicationId}
        >
          <div className="inner-box flex-row py-3 d-block">
            <div className="row">
              <div className="col-6 col-md-8 col-lg-8 col-xl-8">
                <div className="content">
                  <figure className="image">
                    {/* <img src={candidate.avatar} alt="candidates" /> */}
                    <Image
                      src={applicant?.talentProfileImg}
                      alt={applicant?.talentFullName}
                      width={90}
                      height={90}
                    />
                  </figure>
                  <h4 className="name">
                    <Link
                      href={`/talent-info/${applicant?.talentId}`}
                      target="_blank"
                    >
                      {applicant?.talentFullName}{" "}
                      <span className="la la-external-link"></span>
                    </Link>
                  </h4>

                  <ul className="candidate-info">
                    <li className="designation">
                      {applicant?.talentJobTitle?.toUpperCase()}
                    </li>
                    <li>
                      <span className="icon flaticon-map-locator"></span>{" "}
                      {applicant?.talentLocation}
                    </li>
                    {/* <li>
                  <span className="icon flaticon-money"></span> $ $99 / hour
                </li> */}
                  </ul>
                  {/* End candidate-info */}
                  <p className="mb-0">
                    Applied On:&nbsp;
                    <strong>
                      {moment(applicant.submittedAt, "MM/DD/YYYY").format(
                        "MMM Do, YYYY",
                      )}
                    </strong>
                  </p>
                  <span className="fw-bold">
                    <span
                      className={`bg-${
                        applicationStatusBgColorMap[applicant?.status] ??
                        "primary"
                      } text-white px-2 py-1 rounded fs-11`}
                    >
                      {applicant?.status?.toUpperCase()}
                    </span>
                  </span>

                  {/* <TalentSkills
                    skills={applicant?.talentSkills}
                    tagStyle={true}
                  /> */}
                </div>
                {/* End content */}
              </div>

              <div className="col-6 col-md-4 col-lg-4 col-xl-4">
                <div className="btn-box d-flex flex-fill justify-content-evenly applicantListActions">
                  <Link
                    href={getTelegramURI(applicant?.talentTelegram)}
                    target="_blank"
                    className="theme-btn btn-style-three message-variant btn-xs fw-bold gap-1"
                  >
                    <span className="la la-telegram"></span>
                    Message
                  </Link>
                  {/* <Link
                    href={`/talent-info/${applicant?.talentId}`}
                    className="theme-btn btn-style-one btn-xs fw-bold"
                    target="_blank"
                  >
                    View Profile
                  </Link> */}
                  {applicant?.status === "pending" && (
                    <>
                      <button
                        className="theme-btn btn-style-three success-variant btn-xs fw-bold gap-1"
                        onClick={() => {
                          shortlistHandler(applicant?.applicationId);
                        }}
                      >
                        <FaCheck />
                        {lblLoader("Shortlist")}
                      </button>
                      <button
                        className="theme-btn btn-style-three danger-variant btn-xs fw-bold gap-1"
                        onClick={() => {
                          rejectApplicantHandler(applicant?.applicationId);
                        }}
                      >
                        <CgClose className="fs-5" />
                        {lblLoader("Reject")}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {!isLoading && memoizedData && memoizedData?.length <= 0 && (
        <div className="text-center p-11rem fw-bolder">No Applicants 📃</div>
      )}

      {isLoading && (
        <div className="d-flex justify-content-center p-8rem fw-bolder">
          <BarLoader color="#ab31ff" />
        </div>
      )}

      <div className="ls-show-more mt-3">
        {hasNextPage ? (
          <button
            className="show-more mb-3"
            onClick={loadMoreJobsHandler}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "Loading..." : "Show More"}
          </button>
        ) : (
          applicationListingCount > 0 && (
            <div className="text-center">
              You are at the end of Applicants ⚡️
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default JobFlowApplicants;
