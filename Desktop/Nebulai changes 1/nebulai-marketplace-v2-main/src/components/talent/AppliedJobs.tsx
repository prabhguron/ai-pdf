"use client";
import React, { useEffect, useMemo } from "react";
import { BarLoader } from "react-spinners";
import { useInfiniteQuery } from "@tanstack/react-query";
import JobApplicationApi from "@/neb-api/JobApplicationApi";
import { useExpanded, useTable } from "react-table";
import BreadCrumb from "@/components/common/BreadCrumb";
import { applicationStatusBadgeMap } from "@/utils/constants";
import TalentJobFlowMain from "@/components/talent/talentJobFlow/TalentJobFlowMain";
import JobsApi from "@/neb-api/JobsApi";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  goToStep,
  resetTalentJobFlowStepSlice,
  setApplicationListingHidden,
  setJobApplicationStatus,
  setStepAllowed,
  setTalentJobFlowJobData,
  setTalentJobFlowOfferMetaTxData,
  setViewJobApplication,
} from "@/redux/talentJobFlowSteps/talentJobFlowStepsSlice";
import useApplicationOffer from "@/hooks/useApplicationOffer";
import OffersApi from "@/neb-api/OffersApi";
import {
  setContractID,
  setOfferID,
} from "@/redux/contractInfo/contractInfoSlice";
import { setLoadingOverlay } from "@/redux/toggle/toggleSlice";

const AppliedJobs = () => {
  const dispatch = useAppDispatch();
  const applicationListingHidden = useAppSelector(
    (state) => state.talentJobFlowSteps.applicationListingHidden,
  );
  const viewJobApplication = useAppSelector(
    (state) => state.talentJobFlowSteps.viewJobApplication,
  );
  const { getOffer } = useApplicationOffer();
  const { getOfferMetadata } = OffersApi();
  const { getTalentAllAppliedJobs } = JobApplicationApi();
  const { getJob } = JobsApi();

  useEffect(() => {
    return () => {
      dispatch(resetTalentJobFlowStepSlice());
    };
  }, []);

  const {
    data: allTalentApplicationData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["myAppliedJobs"],
    cacheTime: Infinity,
    getNextPageParam: (prevData: TalentAllAppliedReturn) => prevData.nextPage,
    queryFn: ({ pageParam = 0 }) =>
      getTalentAllAppliedJobs({
        skip: pageParam,
        forUser: true,
      }),
  });

  const appliedJobs = allTalentApplicationData?.pages?.reduce(
    (acc: any, page: any) => {
      return [...acc, ...page?.allApplications];
    },
    [],
  );
  const memoizedData = useMemo(() => appliedJobs || [], [appliedJobs]);

  const viewJobApplicationHandler = async (rowData: TalentApplication) => {
    await dispatch(setLoadingOverlay(true));
    const jobData = await getJob(rowData?.jobId, { noListingCondition: true });
    if (!jobData) return;
    const offerData = await getOfferMetadata(rowData?.applicationId, {
      matchApplicationId: true,
    });
    dispatch(setTalentJobFlowJobData(jobData));
    if (offerData?.meta) {
      dispatch(setTalentJobFlowOfferMetaTxData(offerData));
    }

    let goToFlowStep = null;
    if (offerData?.txData?.escrowProjectId?.length) {
      goToFlowStep = 3;
    } else if (offerData?.offerDetails?.isOfferSent) {
      goToFlowStep = 2;
    }
    if (offerData?.txData?.escrowProjectId?.length) {
      dispatch(setContractID(offerData?.txData?.escrowProjectId ?? null));
      dispatch(setOfferID(offerData?.offerDetails?.offerId ?? null));
    }
    await dispatch(setLoadingOverlay(false));
    dispatch(setJobApplicationStatus(rowData?.status ?? null));
    dispatch(
      setStepAllowed({
        step: 2,
        allowed: offerData?.offerDetails?.isOfferSent ? true : false,
      }),
    );
    dispatch(
      setStepAllowed({
        step: 3,
        allowed: offerData?.txData?.escrowProjectId?.length ? true : false,
      }),
    );
    dispatch(setViewJobApplication(true));
    dispatch(setApplicationListingHidden(true));
    if (goToFlowStep) {
      dispatch(goToStep(goToFlowStep));
    }
  };

  const columns = useMemo(
    () => [
      {
        // Build our expander column
        id: "expander", // Make sure it has an ID
        Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }: any) => (
          <span {...getToggleAllRowsExpandedProps()}>
            {isAllRowsExpanded ? "➖" : "➕"}
          </span>
        ),
        Cell: ({ row }: any) => (
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? "➖" : "➕"}
          </span>
        ),
      },
      {
        Header: "Id",
        accessor: (row: any, index: number) => index + 1,
      },
      {
        Header: "Job Title",
        accessor: "jobTitle",
      },
      {
        Header: "Company Name",
        accessor: "companyName",
      },
      {
        Header: "Applied On",
        accessor: "submittedAt",
      },
      {
        Header: "Status",
        Cell: ({
          row,
        }: {
          row: {
            original: TalentApplication;
          };
        }) => (
          <span
            className={`${
              applicationStatusBadgeMap[row?.original?.status] ?? ""
            } fw-bold`}
          >
            {row?.original?.status.toUpperCase()}
          </span>
        ),
      },
      {
        Header: "Actions",
        Cell: ({
          row,
        }: {
          row: {
            original: TalentApplication;
          };
        }) => (
          <ul className="option-list">
            <li>
              <button
                data-text={
                  row.original?.smartContractInitiated
                    ? "View Conctract"
                    : "View"
                }
                onClick={() => {
                  viewJobApplicationHandler(row.original);
                }}
              >
                <span className="la la-eye"></span>
              </button>
            </li>
          </ul>
        ),
      },
    ],
    [],
  );

  const debounce = (func: (e: any) => void, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return function (this: any, ...args: any) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  const handleScroll = debounce((event) => {
    const { scrollTop, clientHeight, scrollHeight } = event.target;
    if (scrollHeight - scrollTop === clientHeight) {
      if (hasNextPage) {
        fetchNextPage();
      }
    }
  }, 300);

  const tableCardClass = () => {
    let cardClass = "col-12";
    if (viewJobApplication) {
      cardClass = "col-4";
    }
    if (applicationListingHidden) {
      cardClass += " d-none";
    }
    return cardClass;
  };

  return (
    <>
      <BreadCrumb title="My Applied Jobs" />
      {/* breadCrumb */}

      <div className="row">
        <div className={tableCardClass()}>
          {/* <!-- Ls widget --> */}
          <div className="ls-widget">
            <div className="tabs-box">
              <div className="widget-title"></div>

              <div className="widget-content">
                <div
                  className="table-outer table-container"
                  onScroll={handleScroll}
                >
                  <Table
                    columns={columns}
                    data={memoizedData}
                    viewJobApplication={viewJobApplication}
                  />
                  {isLoading && (
                    <div className="d-flex justify-content-center p-8rem fw-bolder">
                      <BarLoader color="#ab31ff" />
                    </div>
                  )}
                  {isFetchingNextPage && (
                    <div className="text-center">Loading...</div>
                  )}
                  {appliedJobs && appliedJobs?.length <= 0 && (
                    <div className="text-center p-11rem fw-bolder">
                      Start exploring and applying for jobs to get started. 📃
                    </div>
                  )}
                  {!hasNextPage && appliedJobs && appliedJobs.length > 0 && (
                    <div className="text-center">
                      You have scrolled through all your applications ⚡️
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {viewJobApplication && (
          <div className={`col-${applicationListingHidden ? "12" : "8"}`}>
            <div className="ls-widget job-flow-container">
              <div className="tabs-box">
                <div className="widget-content mt-2">
                  <TalentJobFlowMain />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* End .row */}
    </>
  );
};

const Table = ({ columns, data, viewJobApplication }: any) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
  } = useTable<any>({ columns, data }, useExpanded);

  const renderRowSubComponent = React.useCallback(({ row }: any) => {
    return (
      <ul>
        <li className="li-responsive">
          <span className="fw-bold text-dark">Company Name: </span>
          <span className="fw-bold">{row?.original?.companyName}</span>
        </li>
        <li className="li-responsive">
          <span className="fw-bold text-dark">Applied On: </span>
          <span className="fw-bold">{row?.original?.submittedAt}</span>
        </li>
        <li className="li-responsive">
          <span className="fw-bold text-dark">Status: </span>
          <span className="fw-bold">
            <span
              className={`${
                applicationStatusBadgeMap[row?.original?.status] ?? ""
              } fw-bold`}
            >
              {row?.original?.status.toUpperCase()}
            </span>
          </span>
        </li>
      </ul>
    );
  }, []);

  return (
    <table
      className={`default-table manage-applied-jobs-table table-market-place ${
        viewJobApplication ? "hide-cols-talent" : ""
      }`}
      {...getTableProps()}
    >
      <thead>
        {headerGroups?.map((headerGroup, i) => (
          <tr
            {...headerGroup.getHeaderGroupProps()}
            key={i}
            className="bg-primaryColor"
          >
            {headerGroup.headers.map((column, idx) => (
              <th
                className="fw-bolder table-header"
                {...column.getHeaderProps()}
                key={idx}
              >
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>

      <tbody {...getTableBodyProps()}>
        {rows.map((row: any, i) => {
          prepareRow(row);
          return (
            <React.Fragment key={`f-${i}`}>
              <tr {...row.getRowProps()} key={`r-${i}`}>
                {row.cells.map((cell: any, cellIdx: any) => (
                  <td
                    className="text-dark"
                    {...cell.getCellProps()}
                    key={cellIdx}
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
              {row?.isExpanded ? (
                <tr {...row.getRowProps()} key={`s-${i}`}>
                  <td colSpan={visibleColumns.length}>
                    {renderRowSubComponent({ row })}
                  </td>
                </tr>
              ) : null}
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
};

export default AppliedJobs;
