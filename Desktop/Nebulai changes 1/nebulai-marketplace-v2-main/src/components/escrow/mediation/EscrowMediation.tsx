"use client";
import React from "react";
import EscrowDisputeAction from "@/components/escrow/mediation/EscrowDisputeAction";
import { useQuery } from "@tanstack/react-query";
import useMediationService, {
  DisputeFormatted,
} from "@/hooks/useMediationService";
import PayMediationFeesAction from "@/components/escrow/mediation//PayMediationFeesAction";
import CopyClipboard from "@/components/common/CopyClipboard";
import { useAppSelector } from "@/redux/store";
import AppealDecision from "@/components/escrow/mediation/AppealDecision";
import WaiveAppeal from "@/components/escrow/mediation/WaiveAppeal";
import ResolveByMediation from "@/components/escrow/mediation/ResolveByMediation";
import ResolveDismissedCase from "@/components/escrow/mediation/ResolveDismissedCase";
import ProposeSettlement from "@/components/escrow/mediation/ProposeSettlement";
import { DetailBlock } from "@/components/escrow/ContractDetails";
import { BarLoader } from "react-spinners";
import RequestDefaultDecisionAction from "@/components/escrow/mediation/RequestDefaultDecisionAction";
import ReclaimMediationFeeAction from "./ReclaimMediationFeeAction";
import moment from "moment";

const EscrowMediation = () => {
  const disputeId = useAppSelector((state) => state.contractInfo.disputeId);
  const buyerAddr = useAppSelector((state) => state?.contractInfo?.contractDetails?.buyer);
  const { getDispute } = useMediationService();

  let {
    data: disputeData,
    isLoading: loadingDisputeData,
    isError,
  } = useQuery({
    queryKey: ["disputeData", disputeId?.toString()], // queryKey
    queryFn: () => {
      return getDispute(disputeId?.toString() || null, true);
    },
    cacheTime: Infinity,
    onError: (error) => {
      console.error(error);
    },
  });
  disputeData = disputeData as DisputeFormatted;
  
  const decisionRenderedDate: number = disputeData?.APPEAL_PERIOD; // Unix timestamp
  const appealPeriodSeconds: number = parseInt(disputeData?.decisionRenderedDateRaw); // 7 days in seconds
  // Convert decisionRenderedDate to moment object
  const decisionDate: moment.Moment = moment.unix(decisionRenderedDate);
  // Calculate end of appeal period
  const endAppealPeriod: moment.Moment = decisionDate.clone().add(appealPeriodSeconds, 'seconds');
  // Format end of appeal period to display date in desired format
  const formattedEndDate: string = endAppealPeriod.format('Do MMMM YYYY');

  const respondentLbl = `Respondent (${buyerAddr?.toLowerCase() === disputeData?.respondent?.toLowerCase() ? 'Company' : 'Talent'})`
  const claimantLbl = `Claimant (${buyerAddr?.toLowerCase() === disputeData?.claimant?.toLowerCase() ? 'Company' : 'Talent'})`

  if (loadingDisputeData) {
    return(
      <div className="d-flex justify-content-center p-8rem fw-bolder">
        <BarLoader color="#ab31ff" />
      </div>
    )
  }

  return (
    <>
      {disputeId && !loadingDisputeData && disputeData && (
        <div className="row">
          {disputeData?.projectId && (
            <div className="category-block col-12 col-md-12 col-lg-3 col-xl-3 mb-2">
              <DetailBlock lbl="Project ID" val={disputeData?.projectId} />
            </div>
          )}

          {disputeData?.disputeId && (
            <div className="category-block col-12 col-md-12 col-lg-3 col-xl-3 mb-2">
              <DetailBlock lbl="Dispute ID" val={disputeData?.disputeId} />
            </div>
          )}

          {disputeData?.phaseTxt && (
            <div className="category-block col-12 col-md-12 col-lg-3 col-xl-3 mb-2">
              <DetailBlock
                lbl="Phase"
                val={disputeData?.phaseTxt?.toUpperCase()}
              />
            </div>
          )}

          {disputeData?.mediationFee && (
            <div className="category-block col-12 col-md-12 col-lg-3 col-xl-3 mb-2">
              <DetailBlock
                lbl="Mediation Fees"
                val={disputeData?.mediationFee}
              />
            </div>
          )}

          {disputeData?.respondent && (
            <div className="category-block col-12 col-md-12 col-lg-3 col-xl-3 mb-2">
              <DetailBlock
                lbl={respondentLbl}
                val={
                  <CopyClipboard text={disputeData?.respondent} short={true} />
                }
              />
            </div>
          )}
          {disputeData?.claimant && (
            <div className="category-block col-12 col-md-12 col-lg-3 col-xl-3 mb-2">
              <DetailBlock
                lbl={claimantLbl}
                val={
                  <CopyClipboard text={disputeData?.claimant} short={true} />
                }
              />
            </div>
          )}

          {disputeData?.feePaidClaimant && (
            <div className="category-block col-12 col-md-12 col-lg-3 col-xl-3 mb-2">
              <DetailBlock
                lbl="Claimant Paid Fees"
                val={disputeData?.feePaidClaimant ? "Yes" : "No"}
              />
            </div>
          )}

          {disputeData?.feePaidRespondent && (
            <div className="category-block col-12 col-md-12 col-lg-3 col-xl-3 mb-2">
              <DetailBlock
                lbl="Respondent Paid Fees"
                val={disputeData?.feePaidRespondent ? "Yes" : "No"}
              />
            </div>
          )}

          {!!disputeData?.votingStart?.length && (
            <div className="category-block col-12 col-md-12 col-lg-3 col-xl-3 mb-2">
              <DetailBlock lbl="Voting Start" val={disputeData?.votingStart} />
            </div>
          )}
          {!!disputeData?.revealStart?.length && (
            <div className="category-block col-12 col-md-12 col-lg-3 col-xl-3 mb-2">
              <DetailBlock lbl="Reveal Start" val={disputeData?.revealStart} />
            </div>
          )}
          {!!disputeData?.decisionRenderedDate?.length && (
            <div className="category-block col-12 col-md-12 col-lg-3 col-xl-3 mb-2">
              <DetailBlock
                lbl="Decision Rendered Date"
                val={disputeData?.decisionRenderedDate}
              />
            </div>
          )}

          {disputeData?.isAppeal && (
            <div className="category-block col-12 col-md-12 col-lg-3 col-xl-3 mb-2">
              <DetailBlock
                lbl="Appeal"
                val={disputeData?.isAppeal ? "Yes" : "No"}
              />
            </div>
          )}
          {disputeData?.granted && (
            <div className="category-block col-12 col-md-12 col-lg-3 col-xl-3 mb-2">
              <DetailBlock
                lbl="Granted"
                val={disputeData?.granted ? "Yes" : "No"}
              />
            </div>
          )}
          {(appealPeriodSeconds !== 0 && formattedEndDate) && (
            <div className="category-block col-12 col-md-12 col-lg-3 col-xl-3 mb-2">
              <DetailBlock
                lbl="Time Left To Appeal Decision"
                val={formattedEndDate}
              />
            </div>
          )}
        </div>
      )}
      <div className="row p-3">
        <div className={`col-${disputeId && disputeData ? "12" : "12"}`}>
          <EscrowDisputeAction />
          {disputeId?.toString() !== "0" && (
            <>
              <ReclaimMediationFeeAction disputeData={disputeData} />
              <PayMediationFeesAction disputeData={disputeData} />
              <RequestDefaultDecisionAction disputeData={disputeData} />
              <AppealDecision disputeData={disputeData} />
              <WaiveAppeal disputeData={disputeData} />
              <ResolveByMediation disputeData={disputeData} />
              <ResolveDismissedCase disputeData={disputeData} />
              <ProposeSettlement disputeData={disputeData} />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default EscrowMediation;
