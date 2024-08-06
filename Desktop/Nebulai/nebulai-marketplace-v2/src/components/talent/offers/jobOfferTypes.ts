import { Address } from "viem";

export interface JobSelect {
  applicationId?: string;
  jobId?: string;
  offerId?: string;
  label: string;
  value: string;
  offerStatus: OfferStatus;
}

export interface acceptOfferPayload {
  offerStatus: OfferStatus;
}

export interface JobOffer{
    companyImg: string;
    companyName: string;
    escrowProjectId: string;
    isOfferSent: boolean;
    mainJobId: string;
    mainJobIdentifier: string;
    mainJobTitle: string;
    metadataHash: string | null;
    offerCompensation: number;
    offerCreatedAt: string;
    offerCreatedAtRaw: Date;
    offerCurrencyType: string;
    offerDueDate: Date;
    offerId: string;
    offerIdentifier: string;
    offerJobRequirements: string[];
    offerJobResources: string[];
    offerJobTitle: string;
    offerStatus: OfferStatus;
    providerStake: number;
    providerWalletAddress: Address;
    talentTelegramUsername: string;
    transactionHash: string | null;
}