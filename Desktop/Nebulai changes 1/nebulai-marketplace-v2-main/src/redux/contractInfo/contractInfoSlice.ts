import { ProjectFormatted } from "@/abi/contractTypes";
import { ContractOption } from "@/components/escrow/AllContractsDropdown";
import { ChangeOrderFormatted } from "@/abi/contractTypes";
import { createSlice } from "@reduxjs/toolkit";

interface ContractInfoSlice {
  contractId: string | null;
  offerId: string | null;
  disputeId: string | null;
  contractDetails: ProjectFormatted | null;
  changeOrderAvailable: boolean;
  changeOrders: ChangeOrderFormatted[] | null;
  changeOrdersCount: number;
  contractSelectedOption: ContractOption | null;
  contractModalOpen: boolean;
  canRaiseDispute: boolean;
}

const initVal: ContractInfoSlice = {
  contractId: null,
  offerId: null,
  disputeId: null,
  contractDetails: null,
  changeOrderAvailable: false,
  changeOrdersCount: 0,
  changeOrders: null,
  contractSelectedOption: null,
  contractModalOpen: false,
  canRaiseDispute: false,
};

const contractInfoSlice = createSlice({
  name: "contractInfo",
  initialState: initVal,
  reducers: {
    setContractID: (state, action) => {
      state.contractId = action.payload;
    },
    setOfferID: (state, action) => {
      state.offerId = action.payload;
    },
    setDisputeID: (state, action) => {
      state.disputeId = action.payload;
    },
    setChangeOrderAvailable: (state, action) => {
      state.changeOrderAvailable = action.payload;
    },
    setChangeOrders: (state, action) => {
      state.changeOrders = action.payload;
    },
    setChangeOrdersCount: (state, action) => {
      state.changeOrdersCount = action.payload;
    },
    setContractDetails: (state, action) => {
      state.contractDetails = action?.payload;
    },
    setContractStatus: (state, action) => {
      if(typeof state.contractDetails?.status !== "undefined"){
        state.contractDetails.status = action?.payload;
      }
    },
    setSelectedContractOption: (state, action) => {
      state.contractSelectedOption = action?.payload;
    },
    setContractModalOpen: (state, action) => {
      state.contractModalOpen = action.payload;
    },
    setCanRaiseDispute: (state, action) => {
      state.canRaiseDispute = action.payload;
    },
    resetContractInfoSlice: () => initVal,
  },
});

export const {
  setContractID,
  setOfferID,
  setDisputeID,
  setContractDetails,
  setContractStatus,
  setChangeOrderAvailable,
  setChangeOrders,
  setChangeOrdersCount,
  setCanRaiseDispute,
  setSelectedContractOption,
  setContractModalOpen,
  resetContractInfoSlice,
} = contractInfoSlice.actions;

export default contractInfoSlice.reducer;