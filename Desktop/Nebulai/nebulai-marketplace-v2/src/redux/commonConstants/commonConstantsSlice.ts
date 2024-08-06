import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  walletConnected: false,
  onBoardingInProgress: false,
};

export const commonConstantsSlice = createSlice({
  name: "commonConstantsSlice",
  initialState,
  reducers: {
    setWalletConnected: (state, action) => {
      state.walletConnected = action.payload
    },
    resetCommonConstantSlice: () => initialState
  },
});

export const { setWalletConnected, resetCommonConstantSlice } = commonConstantsSlice.actions;
export default commonConstantsSlice.reducer;
