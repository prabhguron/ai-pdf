import { WalletInfo } from "@/hooks/useWalletUtil";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

type StepInfo = {
  step: number;
  stepKey: string;
  title: string;
  icon: string;
  active: boolean;
  allowed: boolean;
  completed: boolean;
};

type ProfileStat = {
  status: string;
  role: string;
  profileCompleted: boolean;
  incompleteFields: string[];
  walletLinked: boolean;
  wallets: WalletInfo[];
  isOnboardingComplete: boolean;
  isOnboardingStarted: boolean;
  userKycCompleted: boolean;
  userKYCReviewStatus: UserReviewStatusKYC;
  userKYCDecision: UserKYCDecision | null ;
  userKYCResult: UserKYCResult;
  retryKYC: boolean;
  retryKYCInfo: RetryInfo | null;
  walletBalance?: any;
};

export type StepKeyOptions = "completeProfile" | /* "linkWallet" | */ "userKyc";

type StepKeyInfo = {
  [key in StepKeyOptions]: StepInfo;
};

interface GetStartedStepInterface {
  currentStep: number;
  steps: {
    [key in Role]: StepKeyInfo;
  };
  profileStat: ProfileStat | null;
}

const commonSteps: StepKeyInfo = {
  completeProfile: {
    step: 1,
    stepKey: "completeProfile",
    title: "Complete Profile",
    icon: "FaUserAlt",
    active: true,
    allowed: true,
    completed: false,
  },
  // linkWallet: {
  //   step: 2,
  //   stepKey: "linkWallet",
  //   title: "Link Wallet",
  //   icon: "FaWallet",
  //   active: false,
  //   allowed: false,
  //   completed: false,
  // },
  userKyc: {
    step: 2,
    stepKey: "userKyc",
    title: "KYC",
    icon: "FaUserShield",
    active: false,
    allowed: false,
    completed: false,
  },
};

const defaultProfileStat: ProfileStat = {
  status: "",
  role: "",
  profileCompleted: false,
  incompleteFields: [],
  walletLinked: false,
  isOnboardingComplete: false,
  isOnboardingStarted: false,
  userKycCompleted: false,
  userKYCReviewStatus: 'notstarted',
  userKYCDecision: null,
  retryKYC: false,
  retryKYCInfo: null,
  userKYCResult: 'PENDING',
  wallets: [],
};

const initVal: GetStartedStepInterface = {
  currentStep: 1,
  steps: {
    talent: { ...commonSteps },
    company: { ...commonSteps },
  },
  profileStat: defaultProfileStat,
};

export const validateGetStartedUserProfile = createAsyncThunk(
  "getStarted/validateProfile",
  async () => {
    const accessToken = localStorage.getItem("NEB_ACC");
    if (accessToken) {
      try {
        const result = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/validate-profile`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const {
          status,
          profileCompleted,
          wallets,
          walletLinked,
          role,
          isOnboardingComplete,
          isOnboardingStarted,
          incompleteFields,
          userKycCompleted,
          userKYCReviewStatus,
          userKYCDecision,
          userKYCResult,
          retryKYC,
          retryKYCInfo
        } = result.data;
        return {
          status,
          profileCompleted,
          wallets,
          walletLinked,
          role,
          isOnboardingComplete,
          isOnboardingStarted,
          incompleteFields,
          userKycCompleted,
          userKYCReviewStatus,
          userKYCDecision,
          userKYCResult,
          retryKYC,
          retryKYCInfo
        };
      } catch (error) {
        return null;
      }
    }
  }
);

const getStartedStepsSlice = createSlice({
  name: "getStartedSteps",
  initialState: initVal,
  extraReducers: (builder) => {
    //validate user profile
    builder.addCase(validateGetStartedUserProfile.pending, (state) => {
      if(state.profileStat?.isOnboardingStarted){
        state.profileStat = state.profileStat;
      }else{
        state.profileStat = defaultProfileStat;
      }
    });
    builder.addCase(
      validateGetStartedUserProfile.fulfilled,
      (state, action) => {
        state.profileStat = action?.payload || defaultProfileStat;
        const allSteps = { ...state.steps };

        const role = action?.payload?.role as Role;

        if (action?.payload?.profileCompleted) {
          allSteps[role].completeProfile.allowed = true;
          allSteps[role].completeProfile.completed = true;
          allSteps[role].userKyc.allowed = true;
          if (!action?.payload?.incompleteFields.length) {
            allSteps[role].completeProfile.active = false;
            //allSteps[role].linkWallet.active = true;
            allSteps[role].userKyc.active = true;
            state.currentStep = 2;
          }
        }

        // if (action?.payload?.walletLinked) {
        //   allSteps[role].linkWallet.allowed = true;
        //   allSteps[role].linkWallet.completed = true;
        // }

        // if (
        //   action?.payload?.profileCompleted 
        //   // && action?.payload?.walletLinked
        // ) {
        //   allSteps[role].userKyc.allowed = true;
        // }

        if (action?.payload?.userKycCompleted) {
          allSteps[role].userKyc.allowed = true;
          allSteps[role].userKyc.completed = true;
        }
        state.steps = allSteps;
      }
    );
    builder.addCase(validateGetStartedUserProfile.rejected, (state, action) => {
      state.profileStat = defaultProfileStat;
    });
  },
  reducers: {
    updateStep: (state, action) => {
      state.steps = action?.payload;
    },
    nextStep: (state, action) => {
      const role: Role = action.payload;
      const stepKeys = Object.keys(state.steps[role]);
      const totalSteps = stepKeys.length;
      const currentStep = state.currentStep;
      const nextStep = currentStep + 1;

      let stepKey = Object.values(state.steps[role]).find(
        (step) => step.step === nextStep
      )?.stepKey as StepKeyOptions;
      if (stepKey) {
        state.steps[role][stepKey].active = true;
        state.steps[role][stepKey].allowed = true;
        state.currentStep =
          nextStep <= totalSteps ? nextStep : state.currentStep;
      }
    },
    goToStep: (state, action) => {
      const { role, step: goTo } = action.payload;
      state.currentStep = goTo;
      const allSteps = state.steps;
      Object.values(allSteps[role as Role]).map((step) => {
        if (step.step === 1) return step;
        if (step.step > goTo) {
          step.active = false;
        } else {
          step.active = true;
        }
        return step;
      });
      state.steps = allSteps;
    },
    setProfileStateWalletLinked: (state, action) => {
      if (state.profileStat) {
        state.profileStat.walletLinked = true;
        state.profileStat.wallets.push(action.payload);
        // if(action.payload?.role){
        //     // state.steps[action.payload?.role as Role].linkWallet.allowed = true;
        //     // state.steps[action.payload?.role as Role].linkWallet.completed = true;
        //     state.steps[action.payload?.role as Role].userKyc.allowed = true;
        // }
      }
    },
    setOnBoardingStarted: (state, action) => {
      if (state.profileStat) {
        state.profileStat.isOnboardingStarted = action.payload;
      }
    },
    setOnBoardingComplete: (state, action) => {
      if (state.profileStat) {
        state.profileStat.isOnboardingComplete = action.payload;
      }
    },
    setKYCPending: (state) => {
      if (state.profileStat) {
        state.profileStat.userKYCResult = 'PENDING';
        state.profileStat.userKYCReviewStatus = 'pending';
        state.profileStat.userKYCDecision = null;
      }
    },
    resetGStepSlice: () => initVal,
  },
});

export const {
  updateStep,
  nextStep,
  goToStep,
  setProfileStateWalletLinked,
  setOnBoardingStarted,
  setOnBoardingComplete,
  setKYCPending,
  resetGStepSlice,
} = getStartedStepsSlice.actions;

export default getStartedStepsSlice.reducer;
