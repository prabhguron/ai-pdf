import { ApplicantOffer, CompanyJobInfo } from "@/components/company/shortlists/shortListTypes";
import { JobSelect } from "@/components/talent/offers/jobOfferTypes";
import { createSlice } from "@reduxjs/toolkit";

interface JobOfferSlice {
  offerInfo: CompanyJobInfo | null;
  selectedShortlistedJob: ShortListedJob | null;
  selectedOfferInfoLoading: boolean;
  selectedOfferInfo: ApplicantOffer | null;

  selectedTalentJobOffer: JobSelect | null;
  selectedApplicantInfo: JobShortlistedApplicant | null;
}

const initVal: JobOfferSlice = {
  offerInfo: null,
  selectedOfferInfoLoading: false,
  selectedShortlistedJob: null,
  selectedOfferInfo: null,
  selectedTalentJobOffer:null,
  selectedApplicantInfo: null
};

const jobOfferSlice = createSlice({
  name: "jobOffer",
  initialState: initVal,
  reducers: {
    setOfferInfo: (state, action) => {
      state.offerInfo = action?.payload;
    },
    setOfferInfoStatus: (state: any, action) => {
      if (state.selectedTalentJobOffer !== null) {
        state.selectedTalentJobOffer.offerStatus = action?.payload;
      }
    },
    updateOfferInfo: (state, action) => {
      state.offerInfo = {
          ...state.offerInfo,
          ...action?.payload
      };
    },
    setSelectedShortlistedJob: (state, action) => {
      state.selectedShortlistedJob = action?.payload;
    },
    toggleSelectedOfferInfoLoading: (state) => {
      state.selectedOfferInfoLoading = !state.selectedOfferInfoLoading;
    },
    setSelectedOfferInfo: (state, action) => {
      state.selectedOfferInfo = action?.payload;
    },
    updateSelectedOfferInfo: (state, action) => {
        state.selectedOfferInfo = {
            ...state.selectedOfferInfo,
            ...action?.payload
        };
    },
    setOfferEscrow: (state: any, action) => {
      if (state.selectedOfferInfo !== null) {
        state.selectedOfferInfo.escrowProjectId = action.payload;
      }
    },
    setIsOfferSent: (state, action) => {
      if (state.selectedOfferInfo !== null) {
        state.selectedOfferInfo.isOfferSent = action.payload;
      }
    },
    setSelectedApplicantInfo: (state, action) => {
      state.selectedApplicantInfo = action?.payload;
    },
    setSelectedTalentJobOffer: (state, action) => {
      state.selectedTalentJobOffer = action?.payload;
    },
    resetJobOfferSlice: () => initVal,
  },
});

export const {
  setOfferInfo,
  setOfferInfoStatus,
  updateOfferInfo,
  setOfferEscrow,
  setSelectedShortlistedJob,
  toggleSelectedOfferInfoLoading,
  setSelectedOfferInfo,
  setIsOfferSent,
  updateSelectedOfferInfo,
  resetJobOfferSlice,
  setSelectedTalentJobOffer,
  setSelectedApplicantInfo
} = jobOfferSlice.actions;

export default jobOfferSlice.reducer;