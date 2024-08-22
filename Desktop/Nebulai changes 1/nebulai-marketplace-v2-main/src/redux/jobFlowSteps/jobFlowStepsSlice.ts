import { createSlice } from "@reduxjs/toolkit";

interface JobFlowStepVal {
    currentStep: number;
    steps: {
        step: number;
        title: string;
        smallTitle?: string;
        active: boolean;
        allowed: boolean;
    }[],
    jobData: AllJobItem | null,
    jobListingHidden: boolean,
    viewJob: boolean,
    applicantCount: number
}

const initVal: JobFlowStepVal = {
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
            title: 'Applicants(0)',
            active: false,
            allowed: false
        },
        {
            step: 3,
            title: 'Shortlist / Contract',
            smallTitle: 'Contract',
            active: false,
            allowed: false
        },
        // {
        //     step: 4,
        //     title: 'Contract',
        //     active: false,
        //     allowed: true
        // }
    ],
    jobData: null,
    applicantCount: 0,
    jobListingHidden: false,
    viewJob:false
}

const jobFlowStepsSlice = createSlice({
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
        setJobFlowJobData:(state, action) => {
            state.jobData = action.payload
        },
        setJobListingHidden:(state, action) => {
            state.jobListingHidden = action.payload
        },
        setViewJob:(state, action) => {
            state.viewJob = action.payload
        },
        resetJobFlowStepSlice: () => initVal
    }
});

export const {updateFlowSteps, goToStep, nextFlowStep, setStepDisabled, resetJobFlowStepSlice, setJobFlowJobData, setJobListingHidden, setViewJob, setStepTitle,setStepAllowed} = jobFlowStepsSlice.actions;

export default jobFlowStepsSlice.reducer;