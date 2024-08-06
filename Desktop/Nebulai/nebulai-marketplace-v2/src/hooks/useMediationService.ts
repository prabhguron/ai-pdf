import mediationServiceABI from "@/abi/MediationService.json";
import marketPlaceABI from "@/abi/Marketplace.json";
import { usePublicClient } from "wagmi";
import { formatETHbalance } from "@/utils/helper";
import { ethers } from "ethers";
import deployment from "@/abi/deployment.json";
import { Abi, Address } from "viem";
import { MEDIATION_PHASE } from "@/utils/constants";
import { MarketContract } from "@/abi/contractTypes";
import moment from "moment";

const marketPlaceContract: MarketContract = {
  address: deployment.MARKETPLACE_CONTRACT as Address,
  abi: marketPlaceABI as Abi,
};
const MEDIATION_SERVICE_CONTRACT = deployment?.MEDIATION_SERVICE_CONTRACT as Address;
const mediationServiceContract = {
  address: MEDIATION_SERVICE_CONTRACT,
  abi: mediationServiceABI,
};

export type Phase  = 
  "Disclosure" | // evidence may be submitted (after paying mediation fee)
  "PanelSelection" | // panel is drawn randomly and drawn mediators may accept the case
  "Voting" | // mediators must commit votes
  "Reveal" | // mediators must reveal votes
  "Decision" | //all votes have been counted and a reveal is made
  "DefaultDecision" | // one party does not pay mediation fee, dispute is ruled in favor of paying party
  "Dismissed" | // case is invalid, Marketplace reverts to original project conditions
  "SettledExternally" // case was settled by change order in marketplace (mediation does not progress)


export interface Dispute {
  disputeId: BigInt;
  address: Address;
  projectId: BigInt;
  adjustedProjectFee: BigInt;
  providerStakeForfeit: BigInt;
  claimant: Address;
  respondent: Address;
  mediationFee: BigInt;
  feePaidClaimant: boolean;
  feePaidRespondent: boolean;
  disclosureStart: BigInt;
  selectionStart: BigInt;
  votingStart: BigInt;
  revealStart: BigInt;
  decisionRenderedDate: BigInt;
  isAppeal: boolean;
  granted: boolean;
  phase: number;
  evidence: string[];
  feesHeld: number;
}

export interface DisputeFormatted{
  disputeId: string;
  address: Address;
  projectId: string;
  adjustedProjectFee: string;
  providerStakeForfeit: string;
  claimant: Address;
  respondent: Address;
  mediationFee: string;
  mediationFeeRaw: string;
  feePaidClaimant: boolean;
  feePaidRespondent: boolean;
  disclosureStart: string;
  selectionStart: string;
  votingStart: string;
  votingStartRaw: string;
  revealStart: string;
  revealStartRaw: string;
  decisionRenderedDate: string;
  decisionRenderedDateRaw: string;
  isAppeal: boolean;
  granted: boolean;
  phase: number;
  phaseTxt: Phase;
  evidence: string[];
  APPEAL_PERIOD: number;
  DISCLOSURE_PERIOD: number;
  feesHeld: number;
}

const useMediationService = () => {
  const publicClient = usePublicClient();

  const getDispute = async (disputeId: string | null, format=false):Promise<Dispute | DisputeFormatted | null> => {
    if(!disputeId) return null;
    try {
        let data = await publicClient.readContract({
            address: mediationServiceContract?.address,
            abi: mediationServiceContract?.abi,
            functionName: "getDispute",
            args: [parseInt(disputeId)],
        });

        const appealPeriod = await publicClient.readContract({
          address: marketPlaceContract?.address,
          abi: marketPlaceContract?.abi,
          functionName: "APPEAL_PERIOD",
          args: [],
        });

        const disclosurePeriod = await publicClient.readContract({
          address: mediationServiceContract?.address,
          abi: mediationServiceContract?.abi,
          functionName: "DISCLOSURE_PERIOD",
          args: [],
        });

        let feesHeld = await publicClient.readContract({
            address: mediationServiceContract?.address,
            abi: mediationServiceContract?.abi,
            functionName: "getFeesHeld",
            args: [parseInt(disputeId)],
        });

        if(!format){
          return data as Dispute
        }
       
        const disputeDataFormatted = formatDisputeData(data as Dispute);
        disputeDataFormatted.APPEAL_PERIOD = appealPeriod as number
        disputeDataFormatted.DISCLOSURE_PERIOD = disclosurePeriod as number
        disputeDataFormatted.feesHeld = parseInt(feesHeld?.toString() ?? "0")
        return disputeDataFormatted;
    } catch (error) {
      console.log(error)
    }
    return null;
  };

  const formatDisputeData = (data: Dispute): DisputeFormatted =>{
    const formatted: DisputeFormatted = {
      feesHeld: 0,
      APPEAL_PERIOD: 0,
      DISCLOSURE_PERIOD: 0,
      disputeId: data?.disputeId.toString(),
      address: data?.address,
      projectId: data?.projectId.toString(),
      adjustedProjectFee: data?.adjustedProjectFee.toString(),
      providerStakeForfeit: data?.providerStakeForfeit.toString(),
      claimant: data?.claimant,
      respondent: data?.respondent,
      mediationFee: formatETHbalance(ethers.utils.formatEther(data?.mediationFee?.toString())),
      mediationFeeRaw :data?.mediationFee?.toString(),
      feePaidClaimant: data?.feePaidClaimant,
      feePaidRespondent: data?.feePaidRespondent,
      disclosureStart: data?.disclosureStart.toString(),
      selectionStart: data?.selectionStart.toString(),
      votingStartRaw: data?.votingStart.toString(),
      votingStart: data?.votingStart?.toString() !== "0" ? moment.unix(parseInt(data?.votingStart?.toString())).format("MMM Do YYYY"):"",
      revealStart: data?.revealStart?.toString() !== "0" ? moment.unix(parseInt(data?.revealStart?.toString())).format("MMM Do YYYY"):"",
      revealStartRaw: data?.revealStart.toString(),
      decisionRenderedDateRaw: data?.decisionRenderedDate?.toString(),
      decisionRenderedDate: data?.decisionRenderedDate?.toString() !== "0" ?  moment.unix(parseInt(data?.decisionRenderedDate?.toString())).format("MMM Do YYYY"):"",
      isAppeal: data?.isAppeal,
      granted: data?.granted,
      phase: data?.phase,
      phaseTxt: MEDIATION_PHASE[data?.phase],
      evidence: data?.evidence
    }
    return formatted;
  }

  return {
    getDispute
  }
};

export default useMediationService;
