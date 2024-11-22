import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    newsLoading: false,
    newsData: [],
    newsCount: 0,
    newsError: "",
};

const NewsSlice = createSlice({
    name: "News",
    initialState,
    reducers: {
        newsPending: (state) => {
            state.newsLoading = true;
        },
        newsSuccess: (state, { payload }) => {
            console.log(payload, "==>> payload")
            state.newsLoading = false;
            state.newsData = payload.data;
            state.newsCount = payload.count;
            state.newsError = "";
        },
        newsFailed: (state, { payload }) => {
            state.newsLoading = false;
            state.newsData = [];
            state.newsError = payload.message;
        },
    },
});

const { reducer, actions } = NewsSlice;

export const {
    newsPending,
    newsSuccess,
    newsFailed,
} = actions;

export default reducer;
