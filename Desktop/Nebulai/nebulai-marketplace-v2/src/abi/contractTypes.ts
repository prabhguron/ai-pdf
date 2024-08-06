import { Abi, Address } from "viem";

export type ContractStatus =
  | "Created" // project is created but has not been started - Escrow holds project fee
  | "Cancelled" // project is withdrawn by buyer before provider begins work
  | "Active" // provider has started work - Provider must stake in ESCROW to initiate this status
  | "Discontinued" // either party quits - change order period begins
  | "Completed" // provider claims project is complete
  | "Approved" // buyer is satisfied and project fee is released to provider | Project is closed
  | "Challenged" // buyer requests full or partial refund via Change Order - provider has a chance to accept OR go to aribtration
  | "Disputed" // Change Order NOT accepted by provider -> Project goes to mediation
  | "Appealed" // new mediation case is opened
  | "Resolved_ChangeOrder" // escrow releases according to change order
  | "Resolved_Mediation" // escrow releases funds according to mediationService dispute
  | "Resolved_ReviewOverdue" // escrow releases according to original agreement
  | "Resolved_MediationDismissed"; // escrow releases according to original agreement

export type ProjectActionBtn =
  | "approve"
  | "activate"
  | "cancel"
  | "complete"
  | "delinquent";

export interface MarketContract {
  address: Address;
  abi: Abi;
}

export interface Project {
  projectId: BigInt;
  buyer: Address;
  provider: Address;
  escrow: Address;
  paymentToken: Address;
  projectFee: BigInt;
  providerStake: BigInt;
  dueDate: BigInt;
  reviewPeriodLength: BigInt;
  dateCompleted: BigInt;
  changeOrderPeriodInitiated: BigInt;
  nebulaiTxFee: BigInt;
  status: number;
  detailsURI: string;
}

export interface ProjectFormatted {
  projectId: string;
  buyer: Address;
  provider: Address;
  escrow: Address;
  paymentToken: Address;
  projectFee: string;
  providerStake: string;
  dueDate: string;
  reviewPeriodLength: string;
  reviewPeriodLengthRaw: string;
  dateCompleted: string;
  changeOrderPeriod: number;
  changeOrderPeriodInitiatedRaw: string;
  changeOrderPeriodInitiated: string;
  nebulaiTxFee: string;
  status: number;
  detailsURI: string;
  dueDateRaw: string;
  projectFeeRaw: string;
  providerStakeRaw: string;
  nebulaiTxFeeRaw: string;
  currencyType: string;
}


export interface ChangeOrder{
  projectId: BigInt;
  dateProposed: BigInt;
  proposedBy: Address;
  adjustedProjectFee: BigInt;
  providerStakeForfeit: BigInt;
  buyerApproval: boolean;
  providerApproval: boolean;
  detailsURI: string;
  active: boolean;
}

export interface ChangeOrderFormatted{
  projectId: string;
  dateProposed: string;
  dateProposedRaw: string;
  proposedBy: Address;
  adjustedProjectFee: string;
  adjustedProjectFeeRaw: string;
  providerStakeForfeit: string;
  providerStakeForfeitRaw: string;
  buyerApproval: boolean;
  providerApproval: boolean;
  detailsURI: string;
  active: boolean;
}