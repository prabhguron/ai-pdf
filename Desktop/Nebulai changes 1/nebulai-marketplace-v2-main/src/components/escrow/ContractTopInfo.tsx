/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import InfoInner from "@/components/common/InfoInner";
import { GoFile, GoRows, GoCalendar } from "react-icons/go";
import { ESCROW_STATUS } from "@/utils/constants";
import { useAppSelector } from "@/redux/store";
import Image from "next/image";
import ContractInfoMessages from "./ContractInfoMessages";
import { PiCoinsLight } from "react-icons/pi";
import Link from "next/link";
import { formatIpfsURI } from "@/utils/helper";

const ContractTopInfo = () => {
  const role = useAppSelector((state) => state?.auth?.user?.role);
  const jobData = useAppSelector((state) => {
    if (role == "company") {
      return state.jobFlowSteps.jobData;
    } else {
      return state.talentJobFlowSteps.jobData;
    }
  });
  const contractId = useAppSelector((state) => state.contractInfo.contractId);
  const escrowData = useAppSelector(
    (state) => state.contractInfo.contractDetails
  );
  return (
    <>
      <div className="row px-4">{contractId && <ContractInfoMessages />}</div>
      <div className="row">
        <div className="category-block col-12 col-md-12 col-lg-4 col-xl-4 mb-2">
          {jobData?.jobTitle && jobData?.companyImage ? (
            <InfoInner
              iconSpanElement={
                <Image
                  src={jobData?.companyImage}
                  alt={jobData?.jobTitle}
                  width={50}
                  height={50}
                />
              }
              value={
                <Link
                  href={formatIpfsURI(escrowData?.detailsURI ?? "")}
                  target="_blank"
                >
                  {jobData?.jobTitle}{" "}
                  <span className="la la-external-link"></span>
                </Link>
              }
              label={jobData?.companyName}
            />
          ) : (
            <InfoInner
              iconSpanElement={<GoFile />}
              value={escrowData?.projectId ?? "-"}
              label="Contract ID"
            />
          )}
        </div>

        <div className="category-block col-12 col-md-12 col-lg-4 col-xl-4 mb-2">
          <InfoInner
            iconSpanElement={<GoRows />}
            value={
              typeof escrowData?.status !== "undefined" &&
              ESCROW_STATUS[escrowData?.status]
                ? ESCROW_STATUS[escrowData?.status]
                : "-"
            }
            label="Contract Status"
            toolTipText={
              <ul>
                <li>
                  Created: Project is set up, but work hasn't started yet, and
                  the project fee is held in escrow.
                </li>
                <li>
                  Cancelled: The project is withdrawn by the buyer before work
                  begins.
                </li>
                <li>
                  Active: Work has begun, and the provider must deposit funds in
                  escrow to activate this status.
                </li>
                <li>
                  Discontinued: Either party quits, and a change order period
                  begins.
                </li>
                <li>Completed: The provider claims the project is finished.</li>
                <li>
                  Approved: The buyer is satisfied, and the project fee is
                  released to the provider. The project is closed.
                </li>
              </ul>
            }
            toolTip
          />
        </div>

        <div className="category-block col-12 col-md-12 col-lg-4 col-xl-4 mb-2">
          <InfoInner
            iconSpanElement={<GoCalendar />}
            value={escrowData?.dueDate ?? "-"}
            label="Due Date"
          />
        </div>

        <div className="category-block col-12 col-md-12 col-lg-4 col-xl-4 mb-2">
          <InfoInner
            iconSpanElement={<span className="flaticon-money-1"></span>}
            value={`${escrowData?.projectFee ?? "-"} ${
              escrowData?.currencyType ?? ""
            }`}
            label="Compensation"
          />
        </div>

        <div className="category-block col-12 col-md-12 col-lg-4 col-xl-4 mb-2">
          <InfoInner
            iconSpanElement={<span className="flaticon-money-2"></span>}
            //value={escrowData?.nebulaiTxFee ?? "-"}
            value={`${escrowData?.nebulaiTxFee ?? "-"} ${
              escrowData?.currencyType ?? ""
            }`}
            label="Nebulai Service Fee"
          />
        </div>

        <div className="category-block col-12 col-md-12 col-lg-4 col-xl-4 mb-2">
          <InfoInner
            iconSpanElement={<PiCoinsLight/>}
            //value={escrowData?.nebulaiTxFee ?? "-"}
            value={`${escrowData?.providerStake ?? "-"} ${
              escrowData?.currencyType ?? ""
            }`}
            label="Talent Stake"
          />
        </div>
      </div>
    </>
  );
};

export default ContractTopInfo;
