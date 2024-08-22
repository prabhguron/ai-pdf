"use client";
import { ChangeOrderFormatted } from "@/abi/contractTypes";
import CopyClipboard from "@/components/common/CopyClipboard";
import { useAppSelector } from "@/redux/store";
import { formatIpfsURI, shortStr } from "@/utils/helper";
import Link from "next/link";
import React from "react";
import { FaCheckCircle, FaClock } from "react-icons/fa";
import ChangeOrderInfoMsgs from "../ChangeOrderInfoMsgs";
import CommonProjectIdAction from "../CommonProjectIdAction";
import ApproveChangeOrder from "../actions/ApproveChangeOrder";
import { DetailBlock } from "../ContractDetails";

const ChangeOrderAccordionItem = ({
  changeOrder,
  index,
}: {
  changeOrder: ChangeOrderFormatted;
  index: number;
}) => {
  const role = useAppSelector((state) => state.auth?.user?.role);
  const cProjectId = changeOrder?.projectId;
  const dateProposed = changeOrder?.dateProposed;
  const proposedBy = changeOrder?.proposedBy;
  const adjustedProjectFee = changeOrder?.adjustedProjectFee;
  const providerStakeForfeit = changeOrder?.providerStakeForfeit;
  const buyerApproval = changeOrder?.buyerApproval;
  const providerApproval = changeOrder?.providerApproval;
  const detailsURI = changeOrder?.detailsURI;
  const activeChangeOrder = changeOrder?.active;

  let userApproved =
    changeOrder[role === "company" ? "buyerApproval" : "providerApproval"];

  return (
    <div className="accordion-item border-bottom-0 p-2 pb-0">
      <div
        className="accordion-header accordion-header-styles border border-2 mb-1 p-2 rounded-3"
        id={`changeOrderHeading${index}`}
        data-bs-toggle="collapse"
        data-bs-target={`#collapse${index}`}
        aria-expanded="false"
        aria-controls={`collapse${index}`}
      >
        <div>
          <div className="d-flex flex-wrap justify-content-start align-items-center pb-2 gap-2 gap-sm-4">
            <h5 className="fw-bold">Change Order #{index}</h5>
            <span
              className={`bg-${
                activeChangeOrder ? "success text-white" : "warning text-black"
              } d-inline-block px-2 rounded-1 lh-18 fs-11 fw-bold`}
            >
              {activeChangeOrder ? "ACTIVE" : "IN-ACTIVE"}
            </span>
          </div>
          <div>
            <div className="d-flex gap-2 flex-wrap">
              <span
                className={`bg-${
                  buyerApproval ? "success text-white " : "info text-black"
                } px-2 rounded-1 height-24 fs-11 fw-bold d-inline-flex align-items-center gap-1`}
              >
                {buyerApproval ? (
                  <>
                    <FaCheckCircle /> Company Approved
                  </>
                ) : (
                  <>
                    <FaClock /> Awaiting Company Approval
                  </>
                )}
              </span>

              <span
                className={`bg-${
                  providerApproval ? "success text-white " : "info text-black"
                } px-2 rounded-1 height-24 fs-11 fw-bold d-inline-flex align-items-center gap-1`}
              >
                {providerApproval ? (
                  <>
                    <FaCheckCircle /> Talent Approved
                  </>
                ) : (
                  <>
                    <FaClock /> Awaiting Talent Approval
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        <Link
          className="text-center"
          href={formatIpfsURI(detailsURI ?? "")}
          target="_blank"
        >
          <span className="la la-external-link fs-4"></span>
          <span className="fs-6 fw-bold">View Details</span>
        </Link>
      </div>
      <div
        id={`collapse${index}`}
        className={`accordion-collapse collapse ${
          activeChangeOrder ? "show" : ""
        }`}
        aria-labelledby={`changeOrderHeading${index}`}
        data-bs-parent="#changeOrdersAccordion"
      >
        <div className="accordion-body bg-white p-2">
          <div className="row">
            <div className="category-block col-12 col-md-12 col-lg-3 col-xl-3 mb-2">
              <DetailBlock
                lbl={`Proposed By: `}
                val={<CopyClipboard text={proposedBy} short={true} />}
              />
            </div>
            <div className="category-block col-12 col-md-12 col-lg-3 col-xl-3 mb-2">
              <DetailBlock
                lbl={`Date Proposed: `}
                val={<span className="fw-bold">{dateProposed}</span>}
              />
            </div>
            <div className="category-block col-12 col-md-12 col-lg-3 col-xl-3 mb-2">
              <DetailBlock
                lbl={`Contract ID: `}
                val={<span className="fw-bold">{cProjectId}</span>}
              />
            </div>
            <div className="category-block col-12 col-md-12 col-lg-3 col-xl-3 mb-2">
              <DetailBlock
                lbl={`Contract Adjusted Compensation: `}
                val={<span className="fw-bold">{adjustedProjectFee}</span>}
              />
            </div>
            <div className="category-block col-12 col-md-12 col-lg-3 col-xl-3 mb-2">
              <DetailBlock
                lbl={`Provider Stake Forfeit: `}
                val={<span className="fw-bold">{providerStakeForfeit}</span>}
              />
            </div>
            <div className="category-block col-12 col-md-12 col-lg-3 col-xl-3 mb-2">
              <DetailBlock
                lbl={`Details URI: `}
                val={
                  <span className="fw-bold">
                    <CopyClipboard text={detailsURI} short={true} />
                  </span>
                }
              />
            </div>
            <div className="category-block col-12 col-md-12 col-lg-3 col-xl-3 mb-2">
              <DetailBlock
                lbl={`Company Approval: `}
                val={
                  <span className="fw-bold">
                    {buyerApproval ? "Yes" : "No"}
                  </span>
                }
              />
            </div>
            <div className="category-block col-12 col-md-12 col-lg-3 col-xl-3 mb-2">
              <DetailBlock
                lbl={`Talent Approval: `}
                val={
                  <span className="fw-bold">
                    {providerApproval ? "Yes" : "No"}
                  </span>
                }
              />
            </div>
            <div className="col-12 col-md-12 col-lg-3 col-xl-3 mb-2">
              {!userApproved && activeChangeOrder && <ApproveChangeOrder />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeOrderAccordionItem;
