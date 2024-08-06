"use client";
import JobsApi from "@/neb-api/JobsApi";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { BarLoader } from "react-spinners";
import { applicationStatusOptions } from "@/utils/constants";
import useApplicationOffer from "@/hooks/useApplicationOffer";
import {
  resetJobOfferSlice,
  setSelectedOfferInfo,
  toggleSelectedOfferInfoLoading,
} from "@/redux/jobOffer/jobOfferSlice";

const ShortlistedJobApplicants = () => {
  const dispatch = useAppDispatch();
  // const selectedShortlistedJob = useAppSelector((state) => state.jobOffer.selectedShortlistedJob);
  const jobId = useAppSelector((state) => state.jobFlowSteps.jobData?._id);
  const [appId, setAppId] = useState("");
  const firstListItemRef = useRef<HTMLLIElement | null>(null);
  const { getOffer } = useApplicationOffer();
  const { getAllJobApplicants } = JobsApi();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isInitialLoading,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["shortListedApplicants", jobId],
    cacheTime: Infinity,
    getNextPageParam: (prevData: GetAllJobsShortlistedApplicantsResponse) =>
      prevData.nextPage,
    queryFn: ({ pageParam = 0 }) =>
      getAllJobApplicants(jobId ?? null, {
        skip: pageParam,
      }),
  });

  const applicants = data?.pages?.reduce(
    (
      acc: JobShortlistedApplicant[],
      page: GetAllJobsShortlistedApplicantsResponse,
    ) => {
      return [...acc, ...page?.jobs];
    },
    [],
  );

  const memoizedApplicantsData = useMemo(() => applicants || [], [applicants]);
  const applicantCount = data?.pages[0]?.totalCount || 0;
  const applicantListingCount = memoizedApplicantsData?.length || 0;

  useEffect(() => {
    if (!isInitialLoading && firstListItemRef.current) {
      firstListItemRef?.current?.click();
    }
  }, [isInitialLoading]);

  useEffect(() => {
    if (applicantCount <= 0) {
      dispatch(resetJobOfferSlice());
    }
  }, []);

  // useEffect(() => {
  //   console.log('checking now')
  //   console.log(selectedApplicationId);
  //   console.log(selectedShortlistedJob?.applicationId);
  //   if(selectedApplicationId !== null && selectedShortlistedJob?.applicationId !== null && selectedApplicationId !== selectedShortlistedJob?.applicationId){
  //     console.log('clicking now');
  //     firstListItemRef?.current?.click();
  //   }
  // },[])

  const loadMoreApplicantsHandler = async () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const onApplicantSelectHandler = async (
    applicant: JobShortlistedApplicant,
  ) => {
    if (!applicant) return;
    dispatch(toggleSelectedOfferInfoLoading());
    //selectedOfferInfo
    setAppId(applicant?.applicationId);
    const offer = await getOffer(applicant);
    dispatch(setSelectedOfferInfo(offer));
    dispatch(toggleSelectedOfferInfoLoading());
  };

  return (
    <>
      <ul className="contacts">
        {memoizedApplicantsData?.map((a, idx) => (
          <li
            key={idx}
            ref={idx === 0 ? firstListItemRef : null}
            onClick={() => {
              onApplicantSelectHandler(a);
            }}
            className={`${
              appId === a?.applicationId ? "selected-applicant" : ""
            }`}
          >
            <a href="#" className="liPadding">
              <div className="d-flex bd-highlight">
                <div className="img_cont">
                  <Image
                    src={a?.talentProfileImg}
                    className="rounded-circle user_img"
                    alt={a?.talentFullName}
                    width={90}
                    height={90}
                    loading="lazy"
                  />
                </div>
                <div
                  className={`${
                    appId === a?.applicationId ? "user_info_white" : "user_info"
                  }`}
                >
                  <span>{a?.talentFullName}</span>
                  <p>
                    {" "}
                    {
                      /* a?.talentJobTitle */ applicationStatusOptions?.find(
                        (s) => s.value === a?.status,
                      )?.label ?? null
                    }
                  </p>
                </div>
                {/* <span className="info">
                {applicationStatusOptions?.find(s => s.value === a?.status)?.label ?? null}
              </span> */}
              </div>
            </a>
          </li>
        ))}

        {!isLoading && memoizedApplicantsData && applicantListingCount <= 0 && (
          <div className="loading-container">
            No Shortlisted Applicants Found 📃
          </div>
        )}

        {isLoading && (
          <div className="d-flex justify-content-center p-8rem fw-bolder">
            <BarLoader color="#ab31ff" />
          </div>
        )}
      </ul>
      <div className="ls-show-more mt-3">
        <p className="mb-2">
          Showing {applicantListingCount} of {applicantCount} Applicants
        </p>
        {hasNextPage ? (
          <button
            className="show-more mb-3"
            onClick={loadMoreApplicantsHandler}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "Loading..." : "Show More"}
          </button>
        ) : (
          applicantListingCount > 0 && (
            <div className="text-center">
              You are at the end of Applicants ⚡️
            </div>
          )
        )}
      </div>
    </>
  );
};

export default ShortlistedJobApplicants;

