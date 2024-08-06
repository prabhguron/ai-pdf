interface LoginInput {
  message?: string;
  signature?: string;
  email?: string;
  password?: string;
  wallet?: boolean;
}

interface LoginResponse {
  status: string;
  accessToken?: string | null;
  msg: string;
}

interface User {
  isEmailVerified: boolean;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  companyName?: string | null;
  userName: string | null;
  role: Role | "";
  telegramUsername?: string | null;
  linkedWallets?: any[];
}

interface UserProfileCommon {
  profileCompleted: boolean;
  walletLinked: boolean;
  wallets: string[] | null;
  profileImage: string;
  email: string;
  userId: string;
}

interface CompanyProject {
  name: string;
  description: string;
  projectImages?: string[] | File[];
  projectsImages?: string[] | File[];
  url: string;
  _id?: string;
}

interface CaseStudy {
  clientName: string;
  description: string;
  caseStudiesImages?: string[] | File[];
  url: string;
  _id?: string;
}

interface TeamMember {
  name: string;
  jobTitle: string;
  bio: string;
  _id?: string;
}

interface Partnership {
  name: string;
  partnershipsImages: string[] | File[];
  url: string;
  _id?: string;
}

interface Testimonial {
  clientName: string;
  description: string;
  testimonialsImages: string[] | File[];
  _id?: string;
}

interface SocialNetwork {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  discord?: string;
  website?: string;
}

interface CompanyUserProfile {
  technologies: string[];
  socialNetwork: SocialNetwork;
  projects?: CompanyProject[];
  caseStudies?: CaseStudy[];
  teamMembers?: TeamMember[];
  partnerships?: Partnership[];
  testimonials?: Testimonial[];
  companyName: string;
  created_at: string;
  updated_at: string;
  industry: string;
  location: string;
  size: number;
  description: string;
  telegramUsername: string;
  email?: string;
  profileImage?: string;
}

// ------ TALENT --------

interface TalentSkill {
  skill: string;
  yearsOfExperience: number;
  _id?: string;
}

interface TalentProject {
  name: string;
  startYear: number;
  endYear: number;
  description: string;
  _id?: string;
}

interface TalentCertificate {
  name: string;
  description: string;
  certificatesImages: (string | File)[];
  startYear: number;
  endYear: number;
  _id?: string;
}

interface TalentEducation {
  college: string;
  courseName: string;
  startYear: number;
  endYear: number;
  _id?: string;
}

interface TalentWorkExp {
  jobTitle: string;
  companyName: string;
  startYear: number;
  endYear: number;
  description: string;
  _id?: string;
}

interface TalentUserProfile {
  socialNetwork: SocialNetwork;
  bio: string;
  fullName: string;
  jobTitle: string;
  languages: string[];
  phone: string;
  location: string;
  skills: TalentSkill[];
  projects: TalentProject[];
  certificates: TalentCertificate[];
  education: TalentEducation[];
  workExperiences: TalentWorkExp[];
  overAllWorkExperience: number;
  profileTags: string[];
  telegramUsername: string;
  email?: string;
  profileImage?: string;
  rating: number;
  userId: string;
  ratingRequests: string[];
}

type EmptyUserProfile = {};

type UseProfile =
  | UserProfileCommon
  | CompanyUserProfile
  | TalentUserProfile
  | EmptyUserProfile;
interface AuthState {
  loading: boolean;
  walletLoading: boolean;
  walletLoadingMsg: string | null;
  loadingUserData: boolean;
  loadingUserProfile: boolean;
  accessToken: string | null;
  user: User | null;
  userProfile: UseProfile | null;
  userProfileComplete: boolean;
  useWalletLinked: boolean;
  errorMsg: any;
}

interface UpdatePasswordInput {
  currentPassword: string;
  newPassword: string;
}

type ProfileRatingError = {
  statusCode: number;
  status: string;
  isOperational: boolean;
};

interface GetProfileRatingResponse {
  status: "success" | "error";
  rating?: number;
  ratingRequests?: string[];
  error?: ProfileRatingError;
  message?: string;
  stack?: string;
}

type Role = "company" | "talent";

type OfferStatus = "offered" | "approved" | "rejected";

type ApplicationStatus = "pending" | "shortlisted" | "accepted" | "rejected";

interface TalentRegistrationFormInit {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
}

interface CompanyRegistrationFormInit {
  companyName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
  industry: string;
  size: string;
  location: string;
  primaryContactName: string;
  roleInCompany: string;
  roleInCompanyOther: string;
  contactPhone: string;
  contactEmail: string;
}

interface TalentApplication {
  applicationId: string;
  status: string;
  smartContractInitiated: boolean;
  jobId: string;
  talentProfileId: string;
  jobTitle: string;
  companyName: string;
  talentFullName: string;
  talentId: string;
  companyUserId: string;
  submittedAt: string;
  submittedAtRaw: Date;
}

interface CompanyProfileInfo {
  _id: string;
  profileImage: string;
  companyName: string;
}

interface UserIdInfo {
  _id: string;
  companyName: string;
  telegramUsername?: string;
}

interface Job {
  companyImage: string;
  companyTelegram?: string;
  jobTitle: string;
  location: string;
  companyProfileId: CompanyProfileInfo;
  userId: UserIdInfo;
  postedOn: Date;
  postedOnRaw: string;
  compensation: string;
  currencyType: string;
  contractType: string;
  experienceLevel: string;
  jobDescriptionFormatted: string;
  skillsRequired: string[];
  applicationDeadline: string;
  alreadyApplied: boolean;
  isActive: boolean;
}

interface PostJob {
  jobTitle: string;
  location: string;
  skillsRequired: any[];
  experienceLevel: string;
  jobDescription: string;
  jobDescriptionFormatted: string;
  availability: string;
  compensation: string;
  currencyType: string;
  contractType: string;
  applicationDeadline: string;
  contactInformation: string;
  jobDesc: string;
  _id?: string;
}

interface AllJobItem {
  companyName: string;
  companyImage: string;
  shortlistedCount: number;
  applicantCount?: number;
  jobTitle: string;
  mainJobTitle: string;
  location: string;
  companyProfileId: CompanyProfileInfo;
  userId: UserIdInfo;
  postedOn: Date;
  postedOnRaw: string;
  compensation: string;
  currencyType: string;
  contractType: string;
  experienceLevel: string;
  jobDescriptionFormatted: string;
  skillsRequired: string[];
  applicationDeadline: string;
  alreadyApplied: boolean;
  isActive: boolean;
  _id?: string;
  smartContractInitiatedCount?: number;
}

interface GetAllJobsResponse {
  nextPage: number | null;
  totalCount: number;
  jobs: AllJobItem[] | [];
}

interface TalentAllAppliedJobsParams {
  forUser?: boolean;
  forCompany?: boolean;
  forCompanyJob?: boolean;
  jobId?: string;
  userId?: string;
  limit?: number;
  skip: number;
}

interface TalentAllAppliedReturn {
  allApplications: TalentApplication | [];
  totalCount: number;
  nextPage: boolean | null;
}

interface CompanyInfo {
  socialNetwork: SocialNetwork;
  technologies: string[];
  projects: CompanyProject[];
  caseStudies: CaseStudy[];
  teamMembers: TeamMember[];
  partnerships: Partnership[];
  testimonials: Testimonial[];
  created_at: Date;
  updated_at: Date;
  companyName: string;
  description: string;
  email: string;
  industry: string;
  location: string;
  size: number;
  profileImage: string;
}

interface TalentInfo {
  socialNetwork: SocialNetwork;
  languages: string[];
  profileTags: string[];
  skills: TalentSkill[];
  projects: TalentProject[];
  certificates: TalentCertificate[];
  workExperiences: TalentWorkExp[];
  education: TalentEducation[];
  created_at: Date;
  updated_at: Date;
  bio: string;
  email: string;
  fullName: string;
  jobTitle: string;
  location: string;
  overAllWorkExperience: number;
  phone: string;
  profileImage: string;
  rating: number;
}

interface CompanyProjectFormInit {
  name: string;
  url: string;
  description: string;
  projectsImages: string[] | File[] | undefined;
  _id?: string;
}

interface OfferMeta {
  identifier: string;
  offerIdentifier: string;
  title: string;
  compensation: number;
  projectReviewPeriod: number;
  currencyType: string;
  providerWalletAddress: string;
  providerStake: number;
  talent: string;
  company: string;
  requirements: string[];
  resources: string[];
  dueDate: Date;
  offerStatus?: string;
  offerId?: string;
  isOfferSent?: boolean;
  smartContractInitiated?: boolean;
  talentTelegramUsername?: string;
  offerJobTitle?: string;
  companyName?: string;
}

interface TxData {
  metadataHash: string;
  transactionHash: string;
  escrowProjectId: string;
}

interface ShortListedJob {
  applicationId: string;
  jobId: string;
  value: string;
  label: string;
}

interface JobShortlistedApplicant {
  applicationId: string;
  status: ApplicationStatus;
  jobId: string;
  smartContractInitiated: boolean;
  talentProfileId: string;
  talentFullName: string;
  talentJobTitle: string;
  talentProfileImg: sting;
  talentId: string;
  submittedAt: string;
  submittedAtRaw: Date;
  offerId: string | null;
  escrowProjectId: string | null;
  offerStatus: OfferStatus | null;
  isOfferSent: boolean;
}

interface GetAllJobsShortlistedApplicantsResponse {
  nextPage: number | null;
  totalCount: number;
  jobs: JobShortlistedApplicant[] | [];
}

interface FetchUserReturn {
  data: {
    companyName: string;
    email: string;
    firstName: string;
    isEmailVerified: boolean;
    lastName: string;
    role: Role;
    telegramUsername: string;
    userName: string;
    linkedWallets: any[];
  };
  accessToken: string;
}

interface AllTalentProfileItem {
  fullName: string;
  jobTitle: string;
  location: string;
  avatar: string;
  created_at: string;
  projectsDone: number;
  rating: number;
  profileTags: string[];
  userId: string;
  _id: string;
}

interface GetAllTalentProfilesResponse {
  nextPage: number | null;
  totalCount: number;
  profiles: AllTalentProfileItem[] | [];
}

type UserReviewStatusKYC =
  | "notstarted"
  | "init"
  | "pending"
  | "prechecked"
  | "queued"
  | "completed"
  | "onHold";

type UserKYCDecision = "FINAL" | "RETRY";

type UserKYCResult = "PENDING" | "GREEN" | "RED";

interface UserReviewStatusKYCConstantInterface {
  [key: UserReviewStatusKYC]: string;
}

type WelcomeData = {
  welcome: string;
  wallet: string;
  additionalSteps: {
    title: string;
    icon: string;
    link: string;
    linkLbl: string;
    description: string;
  }[];
};
interface RetryInfo {
  comment: string;
  country: string;
  idDocType: string;
}

interface TokenOption {
  value: string;
  label: string;
  imgSrc: string;
  imgAlt: string;
}
