import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    teachersList: [],
    teacherDetails: [],
    loading: false,
    error: null,
    response: null,
    totalTeachers: 0,
    totalPages: 0,
    currentPage: 1
};

const teacherSlice = createSlice({
    name: 'teacher',
    initialState,
    reducers: {
        getRequest: (state) => {
            state.loading = true;
        },
        doneSuccess: (state, action) => {
            state.teacherDetails = action.payload;
            state.loading = false;
            state.error = null;
            state.response = null;
        },
        getSuccess: (state, action) => {
            if (Array.isArray(action.payload)) {
                state.teachersList = action.payload;
                state.totalTeachers = action.payload.length;
                state.totalPages = 1;
                state.currentPage = 1;
            } else {
                state.teachersList = action.payload.teachers;
                state.totalTeachers = action.payload.total;
                state.totalPages = action.payload.pages;
                state.currentPage = action.payload.page;
            }
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
        postDone: (state) => {
            state.loading = false;
            state.error = null;
            state.response = null;
        },
        removeTeacherFromList: (state, action) => {
            state.teachersList = state.teachersList.filter(teacher => teacher._id !== action.payload);
            state.loading = false;
        }
    },
});

export const {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    doneSuccess,
    postDone,
    removeTeacherFromList
} = teacherSlice.actions;

export const teacherReducer = teacherSlice.reducer;