"use client";
import React, { useMemo } from "react";
import "@/components/marketplace/components/Table/Company/company-listing.scss";
import "@/components/marketplace/components/Table/table-data-loader.scss";
import { useExpanded, useSortBy, useTable } from "react-table";
import { BarLoader } from "react-spinners";
import { useInfiniteQuery } from "@tanstack/react-query";
import NebulaiApi from "@/neb-api/NebulaiApi";
import { BsSortDown, BsSortUp } from "react-icons/bs";
import UserAvatar from "@/components/common/Avatar/UserAvatar";
import moment from "moment";
import Link from "next/link";

// MAIN Company LISTING
const CompanyListing = () => {
  const editJob = false;
  const viewJob = false;
  const editViewJobId = false;
  const { getUserProfiles } = NebulaiApi();

  const {
    data: allCompanyProfilesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["companyProfiles"],
    cacheTime: Infinity,
    getNextPageParam: (prevData: GetAllCompanyProfilesResponse) =>
      prevData.nextPage,
    queryFn: ({ pageParam = 0 }) =>
      getUserProfiles("company", {
        skip: pageParam,
      }),
  });

  const companyProfiles = allCompanyProfilesData?.pages?.reduce(
    (acc: any, page) => {
      return [...acc, ...page?.profiles];
    },
    []
  );

  const memoizedData: AllCompanyProfileItem[] = useMemo(
    () => companyProfiles || [],
    [companyProfiles]
  );

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
        disableSortBy: true,
      },
      {
        Header: "",
        accessor: "avatar",
        Cell: ({ row }: any) => (
          <div
            style={{
              padding: "8px",
            }}
          >
            <UserAvatar fallbackName="avatar" imageURI={row.original.avatar} />
          </div>
        ),
        disableSortBy: true,
      },
      {
        Header: "Company",
        accessor: "companyName",
      },
      {
        Header: "Industry",
        accessor: "industry",
      },
      {
        Header: "Location",
        accessor: "location",
      },
      {
        Header: "On Platform",
        accessor: "created_at",
        Cell: ({ row }: any) => {
          return moment(row?.original?.created_at).fromNow();
        },
      },
      {
        Header: "Actions",
        Cell: ({ row }: any) => (
          <div className="">
            <Link
              className="theme-btn btn-style-one btn-xs fw-bold"
              target="_blank"
              href={`/company-info/${row?.original?.userId}`}
              data-text="View"
            >
              VIEW
            </Link>
          </div>
        ),
        disableSortBy: true,
      },
    ],
    []
  );

  const loadMoreHandler = async () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  return (
    <div>
      <div
        className={`table-outer table-container table-container-black ${
          editJob !== null ? "no-xScroll" : ""
        }`}
      >
        <Table
          columns={columns}
          data={memoizedData}
          editJob={editJob || viewJob}
          editViewJobId={editViewJobId}
          isLoading={isFetching}
        />

        {(isLoading || isFetching) && (
          <div className="d-flex justify-content-center p-8rem fw-bolder">
            <BarLoader color="#ab31ff" />
          </div>
        )}
        <div className="ls-show-more mt-3">
          {hasNextPage && (
            <button
              className="show-more mb-3"
              onClick={loadMoreHandler}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? "Loading..." : "Show More"}
            </button>
          )}
        </div>
        {companyProfiles && companyProfiles?.length <= 0 && (
          <div className="text-center p-11rem fw-bolder">
            No Companies Found 👩‍💻
          </div>
        )}
        {!hasNextPage && companyProfiles && companyProfiles.length > 0 && (
          <div className="text-center">
            You have scrolled through all the Companies ⚡️
          </div>
        )}
      </div>
    </div>
  );
};

const Table = ({ columns, data, editJob, editViewJobId, isLoading }: any) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
  } = useTable<any>({ columns, data }, useSortBy, useExpanded);

  const renderRowSubComponent = React.useCallback(({ row }: any) => {
    return (
      <ul className="p-8">
        <li className="li-responsive">
          <span className="fw-bold text-dark">Location: </span>
          <span className="fw-bold">{row?.original?.location}</span>
        </li>
        <li className="li-responsive">
          <span className="fw-bold text-dark">Industry: </span>
          <span className="fw-bold">{row?.original?.industry}</span>
        </li>
        <li className="li-responsive">
          <span className="fw-bold text-dark">On Platform: </span>
          <span className="fw-bold">
            {moment(row?.original?.created_at).fromNow()}
          </span>
        </li>
        <li>
          <Link
            className="theme-btn btn-style-one btn-xs fw-bold"
            target="_blank"
            href={`/company-info/${row?.original?.userId}`}
            data-text="View"
          >
            VIEW
          </Link>
        </li>
      </ul>
    );
  }, []);

  return (
    <table
      className={`default-company-table company-profiles-table table-market-place table-data-loader ${
        isLoading ? "data-loading" : ""
      } ${editJob ? "hide-company-cols" : ""}`}
      {...getTableProps()}
    >
      <thead>
        {headerGroups?.map((headerGroup, i) => (
          <tr
            {...headerGroup.getHeaderGroupProps()}
            key={i}
            className="bg-white"
          >
            {headerGroup.headers.map((column, idx) => (
              <th
                className="fw-bolder table-header"
                {...column.getHeaderProps(column.getSortByToggleProps())}
                key={idx}
              >
                {!column?.disableSortBy ? (
                  <>
                    {column.render("Header")}{" "}
                    <span>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <BsSortDown size={18} color="#b1afc3" />
                        ) : (
                          <BsSortUp size={18} color="#b1afc3" />
                        )
                      ) : (
                        <BsSortDown size={18} color="#b1afc3" />
                      )}
                    </span>
                  </>
                ) : (
                  <>{column.render("Header")}</>
                )}
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

export default CompanyListing;
