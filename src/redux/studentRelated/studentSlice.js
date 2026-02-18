import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    studentsList: [],
    loading: false,
    error: null,
    response: null,
    statestatus: "idle",
    totalStudents: 0,
    totalPages: 0,
    currentPage: 1
};

const studentSlice = createSlice({
    name: 'student',
    initialState,
    reducers: {
        getRequest: (state) => {
            state.loading = true;
        },
        stuffDone: (state) => {
            state.loading = false;
            state.error = null;
            state.response = null;
            state.statestatus = "added";
        },
        getSuccess: (state, action) => {
            if (Array.isArray(action.payload)) {
                state.studentsList = action.payload;
                state.totalStudents = action.payload.length;
                state.totalPages = 1;
                state.currentPage = 1;
            } else {
                state.studentsList = action.payload.students;
                state.totalStudents = action.payload.total;
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
        underStudentControl: (state) => {
            state.loading = false;
            state.response = null;
            state.error = null;
            state.statestatus = "idle";
        },
        removeStudent: (state, action) => {
            state.studentsList = state.studentsList.filter(student => student._id !== action.payload);
        }
    },
});

export const {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    underStudentControl,
    stuffDone,
    removeStudent,
} = studentSlice.actions;

export const studentReducer = studentSlice.reducer;