"use client";
import React from "react";
import CopyClipboard from "@/components/common/CopyClipboard";
import { useAppSelector } from "@/redux/store";
import _ from "lodash";

export const DetailBlock = ({
  val,
  lbl,
}: {
  val: string | React.ReactNode;
  lbl: string;
}) => {
  return (
    <div className="job-block mb-1">
      <div className="inner-box py-2 text-break">
        <p className="fw-bold mb-1">{lbl}</p>
        <h6 className="fw-bold">{val}</h6>
      </div>
    </div>
  );
};

const ContractDetails = () => {
  const escrowData = useAppSelector(
    (state) => state.contractInfo.contractDetails
  );
  const changeOrderAvailable = useAppSelector(
    (state) => state.contractInfo.changeOrderAvailable
  );
  const { user } = useAppSelector((state) => state.auth);

  const role: Role | "" = user?.role || "";
  const walletAddress =
    role === "company" ? escrowData?.buyer : escrowData?.provider;
  const linkedWallets = user?.linkedWallets ?? [];
  const walletInfo = _.find(linkedWallets, {
    address: walletAddress?.toLowerCase(),
  });
  const walletName = walletInfo ? `(${walletInfo.name})` : "";

  return (
    <div className="px-2">
      <div className="row">
        <div className="category-block col-12 col-md-12 col-lg-3 col-xl-3 mb-2">
          {escrowData?.provider && (
            <DetailBlock
              lbl={`Talent Wallet ${role === "talent" ? walletName : ""}`}
              val={<CopyClipboard text={escrowData?.provider} short={true} />}
            />
          )}
        </div>
        <div className="category-block col-12 col-md-12 col-lg-3 col-xl-3 mb-2">
          {escrowData?.buyer && (
            <DetailBlock
              lbl={`Company Wallet ${role === "company" ? walletName : ""}`}
              val={<CopyClipboard text={escrowData?.buyer} short={true} />}
            />
          )}
        </div>
        <div className="category-block col-12 col-md-12 col-lg-3 col-xl-3 mb-2">
          {escrowData?.escrow && (
            <DetailBlock
              lbl="Escrow"
              val={<CopyClipboard text={escrowData?.escrow} short={true} />}
            />
          )}
        </div>
        <div className="category-block col-12 col-md-12 col-lg-3 col-xl-3 mb-2">
          {escrowData?.reviewPeriodLength && (
            <DetailBlock
              lbl="Review Period Length"
              val={escrowData?.reviewPeriodLength}
            />
          )}
        </div>
      </div>
      <div className="row">
        {/* <div className="category-block col-lg-3 col-md-3 col-sm-12 mb-2">
          {escrowData?.detailsURI && (
            <DetailBlock
              lbl="Details URI"
              val={<CopyClipboard text={escrowData?.detailsURI} short={true} />}
            />
          )}
        </div> */}
        {/* <div className="category-block col-lg-3 col-md-3 col-sm-12 mb-2">
          {escrowData?.providerStake && (
            <DetailBlock lbl="Provider Stake" val={escrowData?.providerStake} />
          )}
        </div> */}
        {/* <div className="category-block col-lg-3 col-md-3 col-sm-12 mb-2">
          {escrowData?.reviewPeriodLength && (
            <DetailBlock
              lbl="Review Period Length"
              val={escrowData?.reviewPeriodLength}
            />
          )}
        </div> */}

        {changeOrderAvailable && (
          <div className="category-block col-lg-12 col-md-12 col-sm-12 mb-2">
            {escrowData?.changeOrderPeriodInitiated && (
              <DetailBlock
                lbl="Change Order Initiated"
                val={escrowData?.changeOrderPeriodInitiated}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractDetails;
