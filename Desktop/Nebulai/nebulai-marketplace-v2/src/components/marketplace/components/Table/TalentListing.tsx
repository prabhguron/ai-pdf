"use client";
import React, { useEffect, useMemo, useState } from "react";
import "@/components/marketplace/components/Table/talent-listing.scss";
import "@/components/marketplace/components/Table/table-data-loader.scss";
import { useExpanded, useSortBy, useTable } from "react-table";
import { BarLoader } from "react-spinners";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import NebulaiApi from "@/neb-api/NebulaiApi";
import { BsSortDown, BsSortUp } from "react-icons/bs";
import UserAvatar from "@/components/common/Avatar/UserAvatar";
import StarRatings from "react-star-ratings";
import moment from "moment";
import { profileTagOptions } from "@/utils/formConstants";
import SelectMulti from "@/components/form/SelectMulti";
import { skills } from "@/utils/helper";
import Link from "next/link";
import { convertRating } from "@/utils/helper";

const TalentNameView = ({ talent }: { talent: any }) => {
  return (
    <div className="split-content-2">
      <div className="text-name">{talent.fullName}</div>
      <div className="box-rating">
        <div className="box-rating-stars">
          <StarRatings
            rating={convertRating(talent.rating) as number}
            starRatedColor="#ab31ff"
            numberOfStars={5}
            name="talent-rating"
            starDimension="25px"
            starSpacing="0px"
            svgIconViewBox="0 0 16 16"
            svgIconPath="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
          />
        </div>
        <div className="box-rating-text">
          {convertRating(talent?.rating, "string")}
        </div>
      </div>
    </div>
  );
};

const TalentCategoryView = ({ talent }: { talent: any }) => {
  return (
    <div className="td-category">
      {talent.profileTags.map((category: string) => {
        return (
          <button key={category} className="button-category">
            {category}
          </button>
        );
      })}
    </div>
  );
};

interface TalentProfileFilters {
  skills?: string;
  tags?: string;
}

// MAIN TALENT LISTING
const TalentListing = () => {
  const queryClient = useQueryClient();
  const editJob = false;
  const viewJob = false;
  const editViewJobId = false;
  const { getUserProfiles } = NebulaiApi();
  const [filters, setFilters] = useState<TalentProfileFilters | null>(null);
  const [filtersFetching, setFiltersFetching] = useState<boolean>(false);

  const {
    data: allTalentProfilesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["talentProfiles"],
    cacheTime: Infinity,
    getNextPageParam: (prevData: GetAllTalentProfilesResponse) =>
      prevData.nextPage,
    queryFn: ({ pageParam = 0 }) =>
      getUserProfiles("talent", {
        ...filters,
        skip: pageParam,
      }),
  });

  const talentProfiles = allTalentProfilesData?.pages?.reduce(
    (acc: any, page) => {
      return [...acc, ...page?.profiles];
    },
    []
  );

  const memoizedData:AllTalentProfileItem[] = useMemo(() => talentProfiles || [], [talentProfiles]);

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
          <UserAvatar fallbackName="avatar" imageURI={row.original.avatar} />
        ),
        disableSortBy: true,
      },
      {
        Header: "Name",
        accessor: "fullName",
        Cell: ({ row }: any) => <TalentNameView talent={row.original} />,
      },
      {
        Header: "Category",
        accessor: "category",
        Cell: ({ row }: any) => <TalentCategoryView talent={row.original} />,
        disableSortBy: true,
      },
      {
        Header: "Projects Done",
        accessor: "projectsDone",
        Cell: ({ row }: any) => {
          const doneProjects = parseInt(row?.original?.projectsDone ?? 0);
          return doneProjects === 0 ? "-" : doneProjects;
        },
        disableSortBy: true,
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
              href={`/talent-info/${row?.original?.userId}`}
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

  const refetchInfo = async () => {
   await queryClient.setQueryData(['talentProfiles'], {
    pages:[
      {
        profiles: [],
        totalCount: 0,
        nextPage: null
      }
    ]
   });
    setFiltersFetching(true);
    await refetch();
    setFiltersFetching(false);
  };

  useEffect(() => {
    if (filters) {
      (async () => {
        await refetchInfo();
      })();
    }
  }, [filters]);

  return (
    <div>
      <div className="talent-market-place-filters my-3 mb-4">
        <div className="row">
          <div className="col-4"></div>
          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 mb-2">
            <SelectMulti
              placeholder="Select Skills"
              isSearchable={true}
              name="profileSkillsFilter"
              options={skills}
              onChange={(newOpt: any) => {
                setFilters((prev) => {
                  const skills = newOpt.map((skill: any) => skill?.value);
                  return {
                    ...prev,
                    skills: skills.join(","),
                  };
                });
              }}
            />
          </div>
          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12">
            <SelectMulti
              placeholder="Select Tags"
              isSearchable={true}
              name="profileTagsFilter"
              options={profileTagOptions}
              onChange={(newOpt: any) => {
                setFilters((prev) => {
                  const tags = newOpt.map((tag: any) => tag?.value);
                  return {
                    ...prev,
                    tags: tags.join(","),
                  };
                });
              }}
            />
          </div>
        </div>
      </div>
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
          isLoading={isFetching && filtersFetching}
        />

        {((isLoading) || (isFetching && filtersFetching)) && (
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
        {(talentProfiles && talentProfiles?.length <= 0 && !filtersFetching) && (
          <div className="text-center p-11rem fw-bolder">
            No Talents Found 👩‍💻
          </div>
        )}
        {!hasNextPage && talentProfiles && talentProfiles.length > 0 && (
          <div className="text-center">
            You have scrolled through all the Talents ⚡️
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
      <ul>
        <li className="li-responsive">
          <span className="fw-bold text-dark">Location: </span>
          <span className="fw-bold">{row?.original?.location}</span>
        </li>
        <li className="li-responsive">
          <span className="fw-bold text-dark">Category: </span>
          <span className="fw-bold">
            <TalentCategoryView talent={row.original} />
          </span>
        </li>
        <li className="li-responsive">
          <span className="fw-bold text-dark">On Platform: </span>
          <span className="fw-bold">
            {moment(row?.original?.created_at).fromNow()}
          </span>
        </li>
      </ul>
    );
  }, []);

  return (
    <table
      className={`default-talent-table talent-profiles-table table-market-place table-data-loader ${
        isLoading ? "data-loading" : ""
      } ${editJob ? "hide-talent-cols" : ""}`}
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

export default TalentListing;
