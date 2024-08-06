import CopyClipboard from "@/components/common/CopyClipboard";
import FileResourcesList from "@/components/common/FileResourcesList";
import { shortStr } from "@/utils/helper";
import React from "react";

const OfferMetadataView = ({
  offerMetadata,
}: {
  offerMetadata: OfferMeta | null;
}) => {
  return (
    <>
      {offerMetadata ? (
        <div className="row mt-2">
          <div className="col-12 col-lg-6">
            <div className="sidebar-widget company-widget mb-0 pb-0 mb-lg-2 p-lg-2">
              <div className="widget-title d-none"></div>
              <div className="widget-content pb-0 pb-lg-auto">
                <ul className="company-info mt-0">
                  <li>
                    Offer Identifier:{" "}
                    <span className="fw-bold text-black">
                      {offerMetadata?.offerIdentifier}
                    </span>
                  </li>
                  <li>
                    Identifier:{" "}
                    <span className="fw-bold text-black">
                      {offerMetadata?.identifier}
                    </span>
                  </li>
                  <li>
                    Title:{" "}
                    <span className="fw-bold text-black">
                      {offerMetadata?.title}
                    </span>
                  </li>
                  <li>
                    Compensation:{" "}
                    <span className="fw-bold text-black">
                      {offerMetadata?.compensation}
                    </span>
                  </li>
                  <li>
                    Review Period:{" "}
                    <span className="fw-bold text-black">
                      {`${offerMetadata.projectReviewPeriod} day${offerMetadata?.projectReviewPeriod !== 1 ? "s" : ""}`}
                    </span>
                  </li>
                  <li>
                    Currency Type:{" "}
                    <span className="fw-bold text-black">
                      {offerMetadata?.currencyType?.toUpperCase()}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="sidebar-widget company-widget text-break pt-0 p-lg-2">
              <div className="widget-content">
                <ul className="company-info mt-0">
                  <li>
                    Provider Wallet:{" "}
                    {/* <span className="fw-bold text-black d-none d-sm-block">
                                    {offerMetadata?.providerWalletAddress}
                                  </span>
                                  <span className="fw-bold text-black d-block d-sm-none">
                                    {shortAddress(
                                      offerMetadata?.providerWalletAddress
                                    )}
                                  </span> */}
                    <span className="fw-bold text-black">
                      <CopyClipboard
                        text={offerMetadata?.providerWalletAddress}
                        short={true}
                      />
                    </span>
                  </li>
                  <li>
                    Talent:{" "}
                    <span className="fw-bold text-black d-none d-sm-block">
                      {offerMetadata?.talent}
                    </span>
                    <span className="fw-bold text-black d-block d-sm-none">
                      {shortStr(offerMetadata?.talent)}
                    </span>
                  </li>
                  <li>
                    Company:{" "}
                    <span className="fw-bold text-black d-none d-sm-block">
                      {offerMetadata?.company}
                    </span>
                    <span className="fw-bold text-black d-block d-sm-none">
                      {shortStr(offerMetadata?.company)}
                    </span>
                  </li>
                </ul>
                <h5>Requirements:</h5>
                <ul className="list-style-four mt-2">
                  {offerMetadata?.requirements?.map((req, idx) => (
                    <li key={idx} className={"mb-0"}>
                      {req}
                    </li>
                  ))}
                </ul>

                <h5 className="mt-4 mb-4">Resources:</h5>
                <FileResourcesList resources={offerMetadata?.resources} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center p-11rem fw-bolder">
          No Offer Details Found 📃
        </div>
      )}
    </>
  );
};

export default OfferMetadataView;
