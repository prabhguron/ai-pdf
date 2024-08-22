import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/authSlice";
import jobOfferSlice from "./jobOffer/jobOfferSlice";
import toggleSlice from "./toggle/toggleSlice";
import commonConstantsSlice from "./commonConstants/commonConstantsSlice";
import contractStepsSlice from "./contractSteps/contractStepsSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import contractInfoSlice from "./contractInfo/contractInfoSlice";
import jobFlowStepsSlice from "./jobFlowSteps/jobFlowStepsSlice";
import talentJobFlowStepsSlice from "./talentJobFlowSteps/talentJobFlowStepsSlice";
import getStartedStepsSlice from "./getStartedSteps/getStartedStepsSlice";

export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const store = configureStore({
    reducer: {
        auth: authSlice,
        commonConstants: commonConstantsSlice,
        toggle: toggleSlice,
        jobOffer: jobOfferSlice,
        contractSteps: contractStepsSlice,
        jobFlowSteps: jobFlowStepsSlice,
        talentJobFlowSteps: talentJobFlowStepsSlice,
        contractInfo: contractInfoSlice,
        getStartedSteps: getStartedStepsSlice
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
});

export type RootState = ReturnType<typeof store.getState>
