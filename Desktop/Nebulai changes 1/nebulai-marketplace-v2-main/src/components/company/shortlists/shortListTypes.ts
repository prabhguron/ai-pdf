import { WalletInfo } from "@/hooks/useWalletUtil";
import { Address } from "viem";

export interface ShortlistOfferApplication {
  applicationId: string;
  linkedWallets: WalletInfo[];
  talentUserId: string;
  telegramUsername: string;
}

type JobRequirements = string[];

export interface ShortlistOffer {
  applicationDeadline: string;
  applicationInfo: ShortlistOfferApplication;
  availability: string;
  companyImage: string;
  companyProfileId: {
    _id: string;
    profileImage: string;
    companyName: string;
  };
  compensation: number;
  projectReviewPeriod: number;
  created_at: Date;
  currencyType: string;
  escrowProjectId: string | null;
  existingOffer: boolean;
  isOfferSent: boolean;
  jobId: string;
  jobIdentifier: string;
  jobRequirements: JobRequirements;
  jobResources: string[];
  jobTitle: string;
  location: string;
  mainJobTitle: string;
  offerCreatedAt: Date;
  offerId: string;
  offerStatus: OfferStatus;
  postedOn: string;
  postedOnRaw: Date;
  providerStake: number;
  providerWalletAddress: Address;
  userId: {
    _id: string;
    companyName: string;
  };
  _id?: string;
}

type LinkedWalletOption = {
  value: Address;
  label: string;
};

export interface ApplicantOffer {
  offerId: string;
  applicationId: string;
  companyName: string;
  companyProfileImg: string;
  jobId: string;
  mainJobTitle: string;
  jobTitle: string;
  jobIdentifier: string;
  jobRequirementTxt: string;
  jobRequirements: JobRequirements;
  jobResources: DummyFile[];
  compensation: number;
  projectReviewPeriod: number;
  currencyType: string;
  dueDate: string;
  talentWalletAddress: Address;
  providerStake: number;
  existingOffer: boolean;
  isOfferSent: boolean;
  offerStatus: OfferStatus;
  escrowProjectId: string | null;
  telegramUsername: string;
  telegramUri: string;
  linkedWalletOptions: LinkedWalletOption[];
}

export interface DummyFile {
  name: string;
  size: 0;
  type: string;
  dummy: boolean;
}

export interface NewOffer {
  applicationId: string;
  offerIdentifier: string;
  status: OfferStatus;
  isOfferSent: boolean;
  jobTitle: string;
  jobRequirements: JobRequirements;
  jobResources: string[];
  providerWalletAddress: Address;
  providerStake: number;
  compensation: number;
  currencyType: string;
  dueDate: Date;
  metadataHash: string | null;
  transactionHash: string | null;
  escrowProjectId: string | null;
  _id?: string;
  created_at: Date;
  updated_at: Date;
}

export interface OfferForm {
    jobTitle: string;
    jobRequirements: JobRequirements;
    jobRequirementTxt: string;
    jobResources: string[];
    providerStake: string | number;
    compensation: string | number;
    currencyType: string;
    dueDate: string;
    talentWalletAddress: Address | string;
    projectReviewPeriod: string | number;
}


export interface CompanyJobInfo{
  _id: string;
  jobIdentifier: string;
  userId: {
    _id: string;
    companyName: string;
    telegramUsername: string;
  };
  companyProfileId:{
    _id: string;
    companyName: string;
    profileImage: string;
  };
  jobTitle: string;
  availability: string;
  location: string;
  compensation: string;
  currencyType: string;
  applicationDeadline: string;
  created_at: Date;
  shortlistedCount : number;
  mainJobTitle: string;
  postedOn: string;
  postedOnRaw: Date;
  companyImage: string;
}