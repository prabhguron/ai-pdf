"use client";
import JobsApi from "@/neb-api/JobsApi";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { BarLoader } from "react-spinners";
import {
  APPLICATION_STATUS,
  OFFER_STATUS,
  applicationStatusBgColorMap,
} from "@/utils/constants";
import useApplicationOffer from "@/hooks/useApplicationOffer";
import {
  resetJobOfferSlice, setSelectedApplicantInfo, setSelectedOfferInfo, toggleSelectedOfferInfoLoading,
} from "@/redux/jobOffer/jobOfferSlice";
import Link from "next/link";
import OfferModal from "@/components/company/shortlists/OfferModal/OfferModal";
import { setOfferModalOpen } from "@/redux/contractSteps/contractStepsSlice";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { setContractID, setContractModalOpen, setOfferID } from "@/redux/contractInfo/contractInfoSlice";
import ContractModal from "@/components/escrow/ContractModal/ContractModal";

const ShortlistedJobApplicantsNew = () => {
  const dispatch = useAppDispatch();
  const selectedOfferInfoLoading = useAppSelector((state) => state.jobOffer.selectedOfferInfoLoading);
  const jobId = useAppSelector((state) => state.jobFlowSteps.jobData?._id);
  const [appId, setAppId] = useState("");
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

  const shortlistedApplicants = data?.pages?.reduce(
    (
      acc: JobShortlistedApplicant[],
      page: GetAllJobsShortlistedApplicantsResponse
    ) => {
      return [...acc, ...page?.jobs];
    },
    []
  );

  const memoizedShortlistedApplicantsData = useMemo(
    () => shortlistedApplicants || [],
    [shortlistedApplicants]
  );
  const applicantCount = data?.pages[0]?.totalCount || 0;
  const applicantListingCount = memoizedShortlistedApplicantsData?.length || 0;

  useEffect(() => {
    if (applicantCount <= 0) {
      dispatch(resetJobOfferSlice());
    }
  }, []);

  const loadMoreApplicantsHandler = async () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const createViewOfferHandler = async(applicant: JobShortlistedApplicant) => {
    if(!applicant) return;
    dispatch(toggleSelectedOfferInfoLoading());
    //selectedOfferInfo
    setAppId(applicant?.applicationId)
    const offer = await getOffer(applicant);
    dispatch(setSelectedOfferInfo(offer));
    dispatch(toggleSelectedOfferInfoLoading());
    dispatch(setOfferModalOpen(true));
    dispatch(setSelectedApplicantInfo(applicant));
  } 

  const viewContractHandler = async(applicant: JobShortlistedApplicant) => {
    dispatch(setContractID(applicant?.escrowProjectId ?? null));
    dispatch(setOfferID(applicant?.offerId));
    dispatch(setContractModalOpen(true));
  }

  const lblLoader = (btnLabel: string, loadingState: boolean) => {
    return loadingState ? (
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
      <OfferModal/>
      <ContractModal/>
      <h4 className="mb-3 fw-bold">Shortlisted Applicants</h4>
      {memoizedShortlistedApplicantsData.map((applicant) => (
        <div
          className="candidate-block-three mb-2"
          key={applicant?.applicationId}
        >
          <div className="inner-box flex-row py-3 d-block">
            <div className="row">
              <div className="col-6 col-md-8 col-lg-8 col-xl-8">
                <div className="content">
                  <figure className="image">
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
                  </ul>

                  <span className="fw-bold">

                    
                    {(applicant.offerStatus === OFFER_STATUS['APPROVED'] && !applicant?.escrowProjectId)?(
                      <span
                        className={`bg-success text-white px-2 py-1 rounded fs-11`}
                      >
                        OFFER APPROVED
                      </span>
                    ):(applicant?.offerStatus === OFFER_STATUS['REJECTED'] && !applicant?.escrowProjectId) ? (
                      <span
                        className={`bg-danger text-white px-2 py-1 rounded fs-11`}
                      >
                        OFFER REJECTED
                      </span>
                    ):(applicant?.offerStatus === OFFER_STATUS['APPROVED'] && applicant?.escrowProjectId) ? (
                      <span
                        className={`bg-success text-white px-2 py-1 rounded fs-11`}
                      >
                        HIRED <BsFillCheckCircleFill/>
                      </span>
                    ):(applicant?.offerStatus === OFFER_STATUS['OFFERED'] && applicant?.isOfferSent) ? (
                      <span
                        className={`bg-success text-white px-2 py-1 rounded fs-11`}
                      >
                        OFFER SENT <BsFillCheckCircleFill/>
                      </span>
                    ):(
                      <span
                        className={`bg-${
                          applicationStatusBgColorMap[applicant?.status] ??
                          "primary"
                        } text-white px-2 py-1 rounded fs-11`}
                      >
                        {applicant?.status?.toUpperCase()}
                      </span>
                    )}
                  </span>
                </div>
                {/* End content */}
              </div>

              <div className="col-6 col-md-4 col-lg-4 col-xl-4">
                <div className="btn-box d-flex flex-fill justify-content-evenly shortlistedActions">
                  {!applicant.smartContractInitiated && (
                    <button className="theme-btn btn-style-one btn-xs fw-bold" onClick={() => {
                      createViewOfferHandler(applicant)
                    }}>
                      {lblLoader((applicant.offerStatus === OFFER_STATUS['APPROVED'] && !applicant.smartContractInitiated) ? 'Create Contract' : 'Create / View Offer', selectedOfferInfoLoading)}
                    </button>
                  )}

                  {(applicant.smartContractInitiated && applicant.escrowProjectId) && (
                    <button className="theme-btn btn-style-one btn-xs fw-bold" onClick={() => {
                      viewContractHandler(applicant)
                    }}>
                      {lblLoader('View Contract', false)}
                    </button>
                  )}
                  {/* <button
                    className="theme-btn btn-style-danger btn-xs-round fw-bold"
                    onClick={() => {
                      rejectApplicantHandler(applicant?.applicationId);
                    }}
                  >
                    {lblLoader("View Contract")}
                  </button> */}

                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {!isLoading &&
        memoizedShortlistedApplicantsData &&
        memoizedShortlistedApplicantsData?.length <= 0 && (
          <div className="text-center p-11rem fw-bolder">No Shortlisted Applicants 📃</div>
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
            onClick={loadMoreApplicantsHandler}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "Loading..." : "Show More"}
          </button>
        ) : (
          applicantListingCount > 0 && (
            <div className="text-center">
              You are at the end of Shortlisted Applicants ⚡️
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ShortlistedJobApplicantsNew;
