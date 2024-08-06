"use client";
import React, { useMemo, useState } from "react";
import { BarLoader } from "react-spinners";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import JobApplicationApi from "@/neb-api/JobApplicationApi";
import { useTable } from "react-table";
import BreadCrumb from "@/components/common/BreadCrumb";
import {
  APPLICATION_STATUS,
  applicationStatusColorMap,
  applicationStatusOptions,
} from "@/utils/constants";
import Select from "react-select";
import useConfirm from "@/context/ConfirmDialog";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";

const AllApplicants = () => {
  const queryClient = useQueryClient();
  const { getTalentAllAppliedJobs, updateApplicationStatus } =
    JobApplicationApi();
  const [rowStatus, setRowStatus] = useState<any>({});
  const [rowStatusLoader, setRowStatusLoader] = useState<{
    [key: string]: boolean;
  }>({});
  const confirm = useConfirm();
  const router = useRouter();
  const {
    data: allTalentApplicationData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["allApplicants"],
    cacheTime: Infinity,
    onError: (error: any) => {
      if (error?.status === 403) {
        // Redirect to login page
        router.push("/login");
      }
    },
    getNextPageParam: (prevData: TalentAllAppliedReturn) => prevData.nextPage,
    queryFn: ({ pageParam = 0 }) =>
      getTalentAllAppliedJobs({
        skip: pageParam,
        forCompany: true,
      }),
  });

  const {
    mutate: updateApplicationStatusMutation,
    isLoading: updatingApplicationStatus,
  } = useMutation({
    mutationFn: (mutationData: {
      applicationId: string;
      newStatus: string;
    }) => {
      return updateApplicationStatus(
        mutationData?.applicationId,
        mutationData?.newStatus,
      );
    },
    onSuccess: (response) => {
      const { status, data } = response;
      if (status === 200 && data?.updatedApplication) {
        const { updatedApplication } = data;
        queryClient.setQueryData(["allApplicants"], (prev: any) => {
          const applicationData = { ...prev };
          const allApplications = [
            ...applicationData.pages[0]?.allApplications,
          ];
          const applicationIndex = allApplications.findIndex(
            (app) => app.applicationId === updatedApplication._id,
          );
          if (applicationIndex !== -1) {
            // Create a new object with the updated status
            const updatedApp = {
              ...allApplications[applicationIndex],
              status: updatedApplication?.status,
            };
            // Replace the application at the specified index with the updated application
            allApplications[applicationIndex] = updatedApp;
            // Update the allApplications array in the copied applicationData
            applicationData.pages[0].allApplications = allApplications;
          }

          return applicationData;
        });

        queryClient.removeQueries([
          "shortListedApplicants",
          updatedApplication?.jobId,
        ]);
        queryClient.removeQueries(["shortListedJobs"]);
        setRowStatusLoader({});
        setRowStatus({});
        toast.success("Update Application Status Successfully");
        return;
      } else {
        setRowStatusLoader({});
        setRowStatus({});
        toast.error("Updating Application Status Failed");
      }
    },
    onError: (error) => {
      setRowStatusLoader({});
      setRowStatus({});
      toast.error("Something went wrong");
    },
  });

  let appliedJobs = allTalentApplicationData?.pages?.reduce(
    (acc: any, page: any) => {
      return [...acc, ...page?.allApplications];
    },
    [],
  );
  const memoizedData = useMemo(() => appliedJobs || [], [appliedJobs]);

  interface Data {
    applicationId: string;
  }
  const updateApplicationStatusHandler = async (
    newOpt: { value: string },
    data: Data,
  ) => {
    const choice = await confirm({
      title: "Change Status?",
      description: "Are you sure you want to change the application status?",
      btnLabel: "Change",
      btnClass: "theme-btn btn-style-one btn-small",
      btnCloseClass: "btn-style-eight btn-small",
    });
    if (!choice) return;
    setRowStatus((s: any) => {
      return {
        ...s,
        [data?.applicationId]: newOpt,
      };
    });
    setRowStatusLoader((s) => {
      return {
        ...s,
        [data?.applicationId]: true,
      };
    });
    updateApplicationStatusMutation({
      applicationId: data?.applicationId,
      newStatus: newOpt?.value,
    });
  };

  const columns = useMemo(
    () => [
      {
        Header: "Id",
        accessor: (row: any, index: number) => index + 1,
      },
      {
        Header: "Job Title",
        accessor: "jobTitle",
      },
      {
        Header: "Applicant Name",
        accessor: "talentFullName",
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
        }) => {
          const currentStatusOpt =
            applicationStatusOptions.find(
              (s) => s.value === row?.original?.status,
            ) || null;
          const rowOptionVal =
            rowStatus[row?.original?.applicationId] || currentStatusOpt;
          return (
            <Select
              styles={{
                singleValue: (provided) => ({
                  ...provided,
                  color:
                    applicationStatusColorMap[rowOptionVal?.value] ?? "black",
                  fontWeight: "bolder",
                }),
              }}
              className="basic-single"
              classNamePrefix="select"
              defaultValue={currentStatusOpt}
              value={rowOptionVal}
              isSearchable={true}
              name="applicationStatus"
              options={applicationStatusOptions}
              onChange={(newOpt) => {
                updateApplicationStatusHandler(newOpt, row?.original);
              }}
              isLoading={rowStatusLoader[row?.original?.applicationId] || false}
              isDisabled={
                updatingApplicationStatus ||
                currentStatusOpt?.value === APPLICATION_STATUS["ACCEPTED"]
              }
            />
          );
        },
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="option-box">
            <ul className="option-list">
              <li>
                <Link
                  href={`/job/${row?.original?.jobId}`}
                  data-text="View Job Details"
                >
                  <span className="la la-eye"></span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/talent-info/${row?.original?.talentId}`}
                  data-text="View Talent Profile"
                >
                  <span className="la la-user"></span>
                </Link>
              </li>
            </ul>
          </div>
        ),
      },
    ],
    [rowStatus],
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: memoizedData });

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

  return (
    <>
      <BreadCrumb title="All Applicants" />
      {/* breadCrumb */}

      <div className="row">
        <div className={`col-lg-12'}`}>
          {/* <!-- Ls widget --> */}
          <div className="ls-widget">
            <div className="tabs-box">
              <div className="widget-title"></div>

              <div className="widget-content">
                <div
                  className="table-outer table-container"
                  onScroll={handleScroll}
                >
                  <table
                    className="default-table manage-job-table"
                    {...getTableProps()}
                  >
                    <thead>
                      {headerGroups.map((headerGroup, i) => (
                        <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                          {headerGroup.headers.map((column, cIdx) => (
                            <th
                              className="fw-bolder"
                              {...column.getHeaderProps()}
                              key={cIdx}
                            >
                              {column.render("Header")}
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                      {rows.map((row, i) => {
                        prepareRow(row);
                        return (
                          <tr {...row.getRowProps()} key={i}>
                            {row.cells.map((cell, cIdx) => (
                              <td
                                className="text-dark"
                                {...cell.getCellProps()}
                                key={cIdx}
                              >
                                {cell.render("Cell")}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
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
                      No Applicants Found. 📃
                    </div>
                  )}
                  {!hasNextPage && appliedJobs && appliedJobs.length > 0 && (
                    <div className="text-center">
                      You have scrolled through all the applicants ⚡️
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End .row */}
    </>
  );
};

export default AllApplicants;
