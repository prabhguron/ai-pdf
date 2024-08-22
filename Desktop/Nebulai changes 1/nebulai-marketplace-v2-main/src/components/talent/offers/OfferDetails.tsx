"use client";
import { useQuery } from "@tanstack/react-query";
import OffersApi from "@/neb-api/OffersApi";
import React, { useEffect } from "react";
import PrepareContract from "./PrepareContract";
import LoaderCommon from "@/components/LoaderCommon";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import ContractCreatedMsg from "@/components/company/shortlists/infoMessage/ContractCreatedMsg";
import { setOfferInfo } from "@/redux/jobOffer/jobOfferSlice";
import { OFFER_STATUS } from "@/utils/constants";
import AcceptedOfferInfo from "./AcceptedOfferInfo";
import OfferMetadataView from "./OfferMetadataView";

const OfferDetails = ({
  fetchForOfferId = null,
  fetchJobInfo = false,
  displayOfferMetadata = true
}: {
  fetchForOfferId?: string | null;
  fetchJobInfo?: boolean | null;
  displayOfferMetadata?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const { getOfferMetadata } = OffersApi();
  const { user } = useAppSelector((state) => state.auth);
  const role = user?.role || "";
  const selectedTalentJobOffer = useAppSelector(
    (state) => state?.jobOffer.selectedTalentJobOffer
  );
  let jobId = selectedTalentJobOffer?.jobId ?? null;
  let offerId = selectedTalentJobOffer?.offerId ?? fetchForOfferId ?? "";
  let offerStatus =  selectedTalentJobOffer?.offerStatus ?? "";

  const { data, isLoading } = useQuery({
    queryFn: () =>
      getOfferMetadata(offerId, fetchJobInfo && jobId ? { jobId } : {}),
    cacheTime: Infinity,
    queryKey: ["offerMetadata", offerId],
  });

  const offerMetadata = data?.meta as OfferMeta;
  const companyJobInfo = data?.companyJobInfo ?? null;

  useEffect(() => {
    if (companyJobInfo) {
      dispatch(setOfferInfo(companyJobInfo));
    }
  }, [companyJobInfo, dispatch]);

  return (
    <div>
      {displayOfferMetadata && (
        <div className="accordion accordion-flush" id="OfferViewAccordion">
          <div className="accordion-item">
            <h2 className="accordion-header" id="metadata-headingOne">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#metadata-collapseOne"
                aria-expanded="false"
                aria-controls="metadata-collapseOne"
              >
                <h5 className="fw-bold">Offer Metadata 📜</h5>
              </button>
            </h2>
            <div
              id="metadata-collapseOne"
              className="accordion-collapse collapse show"
              aria-labelledby="metadata-headingOne"
              data-bs-parent="#OfferViewAccordion"
            >
              <div className="accordion-body">
                {isLoading ? (
                  <LoaderCommon />
                ) : (
                  <>
                   <OfferMetadataView offerMetadata={offerMetadata}/>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {!data?.txData?.escrowProjectId &&
        role === "company" &&
        offerId.length && (
          <div className="row">
            <div className="col-12">
              <PrepareContract offerId={offerId ?? ""} />
            </div>
          </div>
        )}

      {data?.txData?.escrowProjectId && role === "talent" && (
        <div className="row">
          <div className="col-12">
            <ContractCreatedMsg role="talent" escrowId={data?.txData?.escrowProjectId} />
          </div>
        </div>
      )}

      {offerStatus === OFFER_STATUS['APPROVED'] && !data?.txData?.escrowProjectId && role === "talent" && (
        <div className="row">
          <div className="col-12">
            <AcceptedOfferInfo/>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferDetails;
