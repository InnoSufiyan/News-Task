import { createSlice } from "@reduxjs/toolkit";
import { fetchLatestNewsThunk } from "./actions/fetchNews";

const initialState = {
    latestNewsLoading: false,
    latestNewsData: [],
    latestNewsError: "",
};

const LatestNewsSlice = createSlice({
    name: "LatestNews",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchLatestNewsThunk.pending, (state) => {
            state.latestNewsLoading = true;
        })
        builder.addCase(fetchLatestNewsThunk.fulfilled, (state, { payload }) => {
            console.log(payload, "==>> payload")
            state.latestNewsLoading = false;
            state.latestNewsData = payload.data;
            state.latestNewsError = "";
        })
        builder.addCase(fetchLatestNewsThunk.rejected, (state, { payload }) => {
            state.latestNewsLoading = false;
            state.latestNewsData = [];
            state.latestNewsError = payload.message;
        })
    }
});

const { reducer, actions } = LatestNewsSlice;

export default reducer;
