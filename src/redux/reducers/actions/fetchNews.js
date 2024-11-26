import { createAsyncThunk } from '@reduxjs/toolkit';
import NewsService from '../../../services/newsService';


export const fetchNewsThunk = createAsyncThunk("News/fetchNews", async (_, { getState, rejectWithValue }) => {
    const { filters } = getState();
    try {

        const response = await NewsService.getNews(
            {
                query: filters.searchQuery,
                category: filters.selectedCategory,
                fromDate: filters.dateRange[0],
                toDate: filters.dateRange[1],
                page: filters.currentPage,
                source: filters.apiSource
            }
        );
        return {
            data: response.articles,
            count: response.totalResults
        };
    } catch (error) {
        console.log(error, "==>> error")
        return rejectWithValue(error.message);
    }
})
export const fetchLatestNewsThunk = createAsyncThunk("News/fetchLatestNews", async (_, { getState, rejectWithValue }) => {
    try {
        const response = await NewsService.getLatestNews();
        return {
            data: response.results
        };
    } catch (error) {
        return rejectWithValue(error.message);
    }
}) 