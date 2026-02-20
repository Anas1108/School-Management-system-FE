import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    complainsList: [],
    loading: false,
    error: null,
    response: null,
};

const complainSlice = createSlice({
    name: 'complain',
    initialState,
    reducers: {
        getRequest: (state) => {
            state.loading = true;
        },
        getSuccess: (state, action) => {
            state.complainsList = action.payload;
            state.loading = false;
            state.error = null;
            state.response = null;
        },
        getFailed: (state, action) => {
            state.response = action.payload;
            state.loading = false;
            state.error = null;
        },
        getError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteComplainSuccess: (state, action) => {
            state.complainsList = state.complainsList.filter(complain => complain._id !== action.payload);
            state.loading = false;
            state.error = null;
            state.response = "Deleted Successfully";
        },
    },
});

export const {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    deleteComplainSuccess
} = complainSlice.actions;

export const complainReducer = complainSlice.reducer;