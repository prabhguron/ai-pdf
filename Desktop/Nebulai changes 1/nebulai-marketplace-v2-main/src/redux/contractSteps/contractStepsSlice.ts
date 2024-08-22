import { createSlice } from "@reduxjs/toolkit";


const initVal = {
    currentStep: 1,
    steps: [
        {
            step: 1,
            title: 'Send Offer',
            active: true,
            allowed: true
        },
        // {
        //     step: 2,
        //     title: 'Send Offer',
        //     active: false,
        //     allowed: false
        // },
        {
            step: 2,
            title: 'Create Contract',
            active: false,
            allowed: false
        }
    ],
    offerModalOpen: false
}

const contractStepsSlice = createSlice({
    name: 'contractSteps',
    initialState: initVal,
    reducers:{
        updateContractSteps: (state, action) => {
            state.steps = action?.payload;
        },
        nextContractStep: (state) => {
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
        setOfferModalOpen:(state, action) => {
            state.offerModalOpen = action.payload
        },
        resetContractStepSlice: () => initVal
    }
});

export const {updateContractSteps, goToStep, nextContractStep, setStepDisabled, resetContractStepSlice, setOfferModalOpen} = contractStepsSlice.actions;

export default contractStepsSlice.reducer;