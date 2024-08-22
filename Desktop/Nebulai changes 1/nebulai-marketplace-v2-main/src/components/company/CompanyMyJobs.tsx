"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Column, useTable, useExpanded } from "react-table";
import BreadCrumb from "@/components/common/BreadCrumb";
import JobsApi from "@/neb-api/JobsApi";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import PostBoxForm from "./postJob/PostBoxForm";
import { formatToLblValObj } from "@/utils/helper";
import { toast } from "react-toastify";
import useConfirm from "@/context/ConfirmDialog";
import { BarLoader } from "react-spinners";
import JobFlowMain from "@/components/company/jobFlow/JobFlowMain";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  goToStep,
  resetJobFlowStepSlice,
  setJobFlowJobData,
  setJobListingHidden,
  setViewJob,
} from "@/redux/jobFlowSteps/jobFlowStepsSlice";
import Link from "next/link";
import { setLoadingOverlay } from "@/redux/toggle/toggleSlice";

const CompanyMyJobs = () => {
  const dispatch = useAppDispatch();
  const jobListingHidden = useAppSelector(
    (state: any) => state.jobFlowSteps.jobListingHidden,
  );
  const viewJob = useAppSelector((state) => state.jobFlowSteps.viewJob);
  const queryClient = useQueryClient();
  const confirm = useConfirm();
  const { getAllJobs, deleteJob, getJobStats } = JobsApi();
  const [editJob, setEditJob] = useState<PostJob | null>(null);
  const [editViewJobId, setEditViewJob] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      dispatch(resetJobFlowStepSlice());
    };
  }, []);

  const deletePostMutation = useMutation({
    mutationFn: deleteJob,
    onSuccess: (response) => {
      const { status } = response;
      if (status === 200) {
        queryClient.invalidateQueries(["myAllJobs"]);
        toast.success("Deleted Job Post Successfully");
        return;
      } else {
        toast.error("Delete Job Post Failed");
      }
    },
    onError: (error) => {
      toast.error("Something went wrong");
    },
  });

  const {
    data: allJobsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["myAllJobs"],
    cacheTime: Infinity,
    getNextPageParam: (prevData: GetAllJobsResponse) => prevData.nextPage,
    queryFn: ({ pageParam = 0 }) =>
      getAllJobs({
        skip: pageParam,
        forUser: true,
        noListingCondition: true,
        companyProfileMeta: true,
      }),
  });

  const jobs = allJobsData?.pages?.reduce((acc: any, page) => {
    return [...acc, ...page?.jobs];
  }, []);

  const memoizedData = useMemo(() => jobs || [], [jobs]);

  const viewJobHandler = async (row: AllJobItem) => {
    if (!row?._id) return;
    await dispatch(setLoadingOverlay(true));
    const jobStats = await getJobStats(row?._id);
    const applicantCount = jobStats?.applicantCount ?? 0;
    const smartContractInitiatedCount =
      jobStats?.smartContractInitiatedCount ?? 0;
    await dispatch(setLoadingOverlay(false));
    dispatch(
      setJobFlowJobData({
        ...row,
        applicantCount,
        smartContractInitiatedCount,
      }),
    );
    dispatch(setJobListingHidden(true));
    dispatch(setViewJob(!viewJob));
    setEditViewJob(row?._id || null);
    setEditJob(null);
    if (applicantCount > 0) {
      let goToJobStep = 2; //Applicants
      if (row?.shortlistedCount > 0 || smartContractInitiatedCount > 0) {
        goToJobStep = 3; // Shortlist / Contract
      }
      dispatch(goToStep(goToJobStep));
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
      // {
      //   Header: "Job Identifier",
      //   accessor: "jobIdentifier"
      // },
      {
        Header: "Job Title",
        accessor: "jobTitle",
        Cell: ({ row }: any) => (
          <Link
            href={"#"}
            className="fw-bold cursor-pointer"
            onClick={() => {
              viewJobHandler(row.original);
            }}
          >
            {row.original.jobTitle}
          </Link>
        ),
      },
      {
        Header: "Location",
        accessor: "location",
      },
      {
        Header: "Shortlisted",
        accessor: "shortlistedCount",
      },
      {
        Header: "Deadline",
        accessor: "applicationDeadline",
      },
      {
        Header: "Posted On",
        accessor: "postedOn",
      },
      {
        Header: "Actions",
        Cell: ({ row }: any) => (
          <div className="option-box">
            <ul className="option-list">
              <li>
                <button
                  data-text="View"
                  onClick={() => {
                    viewJobHandler(row.original);
                  }}
                >
                  <span className="la la-eye"></span>
                </button>
              </li>
              {row?.original?.smartContractCount <= 0 && (
                <>
                  <li>
                    <button
                      data-text="Edit Job"
                      onClick={() => handleEdit(row.original)}
                    >
                      <span className="la la-pencil"></span>
                    </button>
                  </li>
                  <li>
                    <button
                      data-text="Delete Job Post"
                      onClick={() => handleDelete(row.original)}
                    >
                      <span className="la la-trash"></span>
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        ),
      },
    ],
    [],
  );

  const handleEdit = (row: PostJob) => {
    if (row) {
      let jobData = { ...row };
      //jobData.portfolioOrWorkSamples = formatToLblValObj(jobData.portfolioOrWorkSamples);
      //jobData.references = formatToLblValObj(jobData.references)
      jobData.skillsRequired = formatToLblValObj(jobData.skillsRequired);
      setEditJob(jobData);
      setEditViewJob(jobData?._id || null);
      dispatch(setViewJob(false));
    }
  };

  const handleDelete = async (row: AllJobItem) => {
    const choice = await confirm({
      title: "Delete Job Post",
      description: "Are you sure you want to delete?",
      btnClass: "theme-btn btn-style-one btn-small",
      btnCloseClass: "btn-style-eight btn-small",
    });
    if (!choice || !row?._id) return;
    deletePostMutation.mutate(row?._id);
  };

  interface ReactColumnProps {
    columns: Column<AllJobItem>[];
    memoizedData: AllJobItem[];
  }

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

  const handleScroll = debounce((event: any) => {
    const { scrollTop, clientHeight, scrollHeight } = event?.target;
    if (scrollHeight - scrollTop === clientHeight) {
      if (hasNextPage) {
        fetchNextPage();
      }
    }
  }, 300);

  const tableCardClass = () => {
    let cardClass = "col-12";
    // if (editJob !== null || viewJob) {
    //   // styles if want to keep side-by-side view
    //   cardClass = "col-12 col-xxl-4";
    // }
    if (jobListingHidden) {
      cardClass += " d-none";
    }
    return cardClass;
  };

  return (
    <>
      <BreadCrumb title="All Posted Jobs" />
      {/* breadCrumb */}

      <div className="row">
        <div className={tableCardClass()}>
          {/* <!-- Ls widget --> */}
          <div className="ls-widget">
            <div className="tabs-box">
              <div className="widget-title"></div>

              <div className="widget-content">
                <div
                  className={`table-outer table-container ${
                    editJob !== null ? "no-xScroll" : ""
                  }`}
                  onScroll={handleScroll}
                >
                  <Table
                    columns={columns}
                    data={memoizedData}
                    editJob={editJob || viewJob}
                    editViewJobId={editViewJobId}
                  />

                  {isLoading && (
                    <div className="d-flex justify-content-center p-8rem fw-bolder">
                      <BarLoader color="#ab31ff" />
                    </div>
                  )}
                  {isFetchingNextPage && (
                    <div className="text-center">Loading...</div>
                  )}
                  {jobs && jobs?.length <= 0 && (
                    <div className="text-center p-11rem fw-bolder">
                      No Job Posts 📃
                    </div>
                  )}
                  {!hasNextPage && jobs && jobs.length > 0 && (
                    <div className="text-center">
                      You have scrolled through all the Jobs ⚡️
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {editJob !== null && (
          <div className="col-12">
            <div className="ls-widget job-edit-container">
              <div className="tabs-box">
                <div className="widget-title">
                  {!!editJob?.jobTitle?.length && (
                    <div className="row">
                      <div className="col-lg-10">
                        <span className="mb-3 h5">
                          <em>
                            You are now editing{" "}
                            <strong>{editJob?.jobTitle}</strong>
                          </em>
                        </span>
                      </div>
                      <div className="col-lg-2">
                        <button
                          type="button"
                          className="theme-btn btn-style-one btn-small"
                          onClick={() => {
                            setEditJob(null);
                            setEditViewJob(null);
                            dispatch(setViewJob(false));
                          }}
                        >
                          CANCEL
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="widget-content">
                  <PostBoxForm formInitValues={editJob} />
                </div>
              </div>
            </div>
          </div>
        )}

        {viewJob && (
          <div className={`col-${jobListingHidden ? "12" : "8"}`}>
            <div className="ls-widget job-flow-container">
              <div className="tabs-box">
                <div className="widget-content mt-2">
                  <JobFlowMain />
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

const Table = ({ columns, data, editJob, editViewJobId }: any) => {
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
          <span className="fw-bold text-dark">Location: </span>
          <span className="fw-bold">{row?.original?.location}</span>
        </li>
        <li className="li-responsive">
          <span className="fw-bold text-dark">Shortlisted: </span>
          <span className="fw-bold">{row?.original?.shortlistedCount}</span>
        </li>
        <li className="li-responsive">
          <span className="fw-bold text-dark">Deadline: </span>
          <span className="fw-bold">{row?.original?.applicationDeadline}</span>
        </li>
        <li className="li-responsive">
          <span className="fw-bold text-dark">Posted On: </span>
          <span className="fw-bold">{row?.original?.postedOn}</span>
        </li>
      </ul>
    );
  }, []);

  return (
    <table
      className={`default-table manage-posted-jobs-table table-market-place ${
        editJob ? "hide-cols" : ""
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
              <tr
                {...row.getRowProps()}
                key={`r-${i}`}
                className={`${
                  editJob && row.original._id === editViewJobId
                    ? "rowSelected"
                    : ""
                }`}
              >
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

export default CompanyMyJobs;
