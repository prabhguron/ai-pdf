import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    menu: false,
    chatSidebar: false,
    loadingOverlay: false,
};

export const toggleSlice = createSlice({
    name: "toggle",
    initialState,
    reducers: {
        menuToggle: (state) => {
            state.menu = !state.menu;
        },
        chatSidebarToggle: (state) => {
            state.chatSidebar = !state.chatSidebar;
        },
        setLoadingOverlay: (state, action) =>{
            state.loadingOverlay = action.payload;
        }
    },
});

export const { menuToggle, chatSidebarToggle, setLoadingOverlay } = toggleSlice.actions;
export default toggleSlice.reducer;
