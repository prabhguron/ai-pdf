import { ContractStatus } from "@/abi/contractTypes";
import { Phase } from "@/hooks/useMediationService";

export const SMALL_MOBILE_MAX_WIDTH = 1023;

export const applicationStatusOptions = [
  { value: "pending", label: "Pending" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
];

export const applicationStatusBadgeMap: { [key: string]: string } = {
  pending: "text-primary",
  shortlisted: "text-warning",
  accepted: "text-success",
  rejected: "text-danger",
};

export const applicationStatusColorMap: { [key: string]: string } = {
  pending: "blue",
  shortlisted: "orange",
  accepted: "green",
  rejected: "red",
};

export const applicationStatusBgColorMap: { [key: string]: string } = {
  pending: "primary",
  shortlisted: "warning",
  accepted: "success",
  rejected: "danger",
};

export const APPLICATION_STATUS = {
  PENDING: "pending",
  SHORTLISTED: "shortlisted",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
};

export const OFFER_STATUS: {
  [key: string]: OfferStatus;
} = {
  OFFERED: "offered",
  APPROVED: "approved",
  REJECTED: "rejected",
};

export const OFFER_STATUS_LABEL = {
  offered: "Offered",
  approved: "Approved",
  rejected: "Rejected",
};

export const ESCROW_STATUS: {
  [key: number]: ContractStatus;
} = {
  0: "Created", // project is created but has not been started - Escrow holds project fee
  1: "Cancelled", // project is withdrawn by buyer before provider begins work
  2: "Active", // provider has started work - Provider must stake in ESCROW to initiate this status
  3: "Discontinued", // either party quits - change order period begins
  4: "Completed", // provider claims project is complete
  5: "Approved", // buyer is satisfied and project fee is released to provider, Project is closed
  6: "Challenged", // buyer is unsatisfied and submits a Change Order - provider has a chance to accept OR go to mediation 
  7: "Disputed", // Change Order NOT accepted by provider -> Project goes to mediation
  8: "Appealed", // new mediation case is opened
  9: "Resolved_ChangeOrder", // escrow releases according to change order
  10: "Resolved_Mediation", // escrow releases according to dispute
  11: "Resolved_ReviewOverdue", // escrow releases according to original agreement
  12: "Resolved_MediationDismissed", // escrow releases according to original agreement
};

export const ESCROW_STATUS_MAP: Record<ContractStatus, number> = {
  "Created": 0,
  "Cancelled": 1,
  "Active": 2,
  "Discontinued": 3,
  "Completed": 4,
  "Approved": 5,
  "Challenged": 6,
  "Disputed": 7,
  "Appealed": 8,
  "Resolved_ChangeOrder": 9,
  "Resolved_Mediation": 10,
  "Resolved_ReviewOverdue": 11,
  "Resolved_MediationDismissed": 12
}

export const MEDIATION_PHASE:{
  [key: number]: Phase
} = {
  0: "Disclosure", // fees + evidence
  1: "PanelSelection", // drawing mediators
  2: "Voting", // mediators must commit votes
  3: "Reveal", // mediators must reveal votes
  4: "Decision",
  5: "DefaultDecision", // one party does not pay mediation fee, dispute is ruled in favor of paying party
  6: "Dismissed", // case is invalid, Marketplace reverts to original project conditions
  7: "SettledExternally",
};

export const PROFILE_WELCOME_TEXT: {
  [K in Role]: {
    'welcome': string;
    'wallet': string;
  }
} = {
  talent :{
    welcome: "Before you can fully utilize the platform to apply or bid for jobs or projects, it's important to create a comprehensive profile. Provide information about your skills, experience, and expertise to attract potential clients or employers.",
    wallet: "To ensure secure transactions, we utilize the power of blockchain technology. Connect your wallet to the platform, allowing you to send and receive funds securely through our Nebulai Escrow Smart Contract.",
  },
  company:{
    welcome: "Before you can start posting jobs and projects, it's important to create a comprehensive company profile. Provide information about your organization, its background, and the industry you operate in. This will help attract top talent and showcase your company's credibility.",
    wallet: "To ensure secure and transparent transactions, we leverage the power of blockchain technology. Connect your wallet to the platform, enabling seamless payment processing through our Nebulai Escrow Smart Contract. This way, you can issue payments to successful applicants with confidence."
  }
}

export const KYC_SUPPORTED_DOCUMENTS_OPTIONS:{
  value: 'ID_CARD' | 'PASSPORT' | 'DRIVERS' | 'RESIDENCE_PERMIT';
  label: string;
}[] = [
  {
    value: "ID_CARD",
    label: "ID Card",
  },
  {
    value: "PASSPORT",
    label: "Passport",
  },
  {
    value: "DRIVERS",
    label: "Driving License",
  },
  {
    value: "RESIDENCE_PERMIT",
    label: "Residence permit or registration document in the foreign city/country",
  },
];


export const KYC_REVIEW_STATUS_MAP: UserReviewStatusKYCConstantInterface = {
  init: 'Initial Registration Started',
  pending: 'Applicant Details Under Review',
  prechecked: 'KYC Review Started',
  completed: 'KYC Completed',
  onHold: 'Applicant Awaiting Final Decision / Verification'
};

export const profileWelcomeContent: {
  [K in Role]: WelcomeData;
} = {
  talent: {
    welcome:
      "Before you can fully utilize the platform to apply or bid for jobs or projects, it's important to create a comprehensive profile. Provide information about your skills, experience, and expertise to attract potential clients or employers.",
    wallet:
      "To ensure secure transactions, we utilize the power of blockchain technology. Connect your wallet to the platform, allowing you to send and receive funds securely through our Nebulai Escrow Smart Contract.",
    additionalSteps: [
      {
        title: "Explore Marketplace",
        icon: "flaticon-shopping-cart",
        link: "/marketplace",
        linkLbl: "Marketplace",
        description:
          "Ready to dive into the exciting world of opportunities? Explore our job or project listing and apply. Our Escrow Smart Contract will safeguard the transaction, ensuring both parties' trust and security.",
      },
    ],
  },
  company: {
    welcome:
      "Before you can start posting jobs and projects, it's important to create a comprehensive company profile. Provide information about your organization, its background, and the industry you operate in. This will help attract top talent and showcase your company's credibility.",
    wallet:
      "To ensure secure and transparent transactions, we leverage the power of blockchain technology. Connect your wallet to the platform, enabling seamless payment processing through our Nebulai Escrow Smart Contract. This way, you can issue payments to successful applicants with confidence.",
    additionalSteps: [
      {
        title: "Post your first job or project",
        icon: "flaticon-briefcase",
        link: "/post-job",
        linkLbl: "Post Job",
        description:
          "Ready to find the right talent for your company's needs? Post your first job or project listing, clearly outlining the requirements, responsibilities, and desired skills. Review the applications received from talented individuals, assess their qualifications, and select the best fit for your project.",
      },
    ],
  },
};