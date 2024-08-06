import { createSlice } from "@reduxjs/toolkit";

interface TalentJobFlowStepVal {
    currentStep: number;
    steps: {
        step: number;
        title: string;
        smallTitle?: string;
        active: boolean;
        allowed: boolean;
    }[],
    jobData: AllJobItem | null,
    offerData: OfferMeta | null,
    txData: TxData | null,
    applicationListingHidden: boolean,
    jobApplicationStatus: ApplicationStatus | null,
    viewJobApplication: boolean
}

const initVal: TalentJobFlowStepVal = {
    currentStep: 1,
    steps: [
        {
            step: 1,
            title: 'Job',
            active: true,
            allowed: true
        },
        {
            step: 2,
            title: 'Review Offer',
            smallTitle: 'Offer',
            active: false,
            allowed: false
        },
        {
            step: 3,
            title: 'Contract',
            active: false,
            allowed: false
        },
    ],
    jobData: null,
    offerData: null,
    txData: null,
    applicationListingHidden: false,
    jobApplicationStatus: null,
    viewJobApplication:false
}

const talentJobFlowStepsSlice = createSlice({
    name: 'jobFlowSteps',
    initialState: initVal,
    reducers:{
        setStepTitle:(state, action) => {
            const {step, lbl} = action.payload
            const jobFlowStep = state.steps.find(s => s.step === step);
            if(jobFlowStep){
                jobFlowStep.title = lbl
            }
        },
        setStepAllowed:(state, action) => {
            const {step, allowed} = action.payload
            const jobFlowStep = state.steps.find(s => s.step === step);
            if(jobFlowStep){
                jobFlowStep.allowed = allowed
            }
        },
        updateFlowSteps: (state, action) => {
            state.steps = action?.payload;
        },
        nextFlowStep: (state) => {
            const totalSteps = state.steps.length
            const currentStep = state.currentStep;
            const nextStep = currentStep + 1;
            state.steps[nextStep - 1].active = true;
            state.currentStep = nextStep < totalSteps ? nextStep : state.currentStep;
        },
        goToStep:(state, action) =>{ 
            const goTo = action.payload;
            state.currentStep = goTo;
            state.steps = state.steps.map((step) => {
                if(step.step === 1) return step;
                if(step.step > goTo){
                    step.active = false;
                }else{
                    step.active = true;
                }
                return step;
            });
        },
        setStepDisabled:(state, action) => {
            state.steps[action.payload.step].allowed = action.payload.value;
        },
        setTalentJobFlowJobData:(state, action) => {
            state.jobData = action.payload
        },
        setTalentJobFlowOfferMetaTxData:(state, action) => {
            const offerMeta = action.payload?.meta ?? null;
            const offerDetails = action.payload?.offerDetails ?? null;
            state.offerData = {
                ...offerMeta,
                ...offerDetails
            };
            state.txData = action.payload?.txData ?? null;
        },
        setApplicationListingHidden:(state, action) => {
            state.applicationListingHidden = action.payload
        },
        setJobApplicationStatus:(state, action) => {
            state.jobApplicationStatus = action.payload
        },
        setViewJobApplication:(state, action) => {
            state.viewJobApplication = action.payload
        },
        setTalentFlowOfferStatus: (state: any, action) => {
            if (state.offerData?.offerStatus) {
              state.offerData.offerStatus = action?.payload;
            }
        },
        resetTalentJobFlowStepSlice: () => initVal
    }
});

export const {updateFlowSteps, goToStep, nextFlowStep, setStepDisabled, resetTalentJobFlowStepSlice, setTalentJobFlowJobData, setTalentJobFlowOfferMetaTxData, setApplicationListingHidden, setViewJobApplication, setStepTitle, setStepAllowed, setJobApplicationStatus, setTalentFlowOfferStatus} = talentJobFlowStepsSlice.actions;

export default talentJobFlowStepsSlice.reducer;