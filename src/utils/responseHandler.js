import axios from "axios";

export const getMethod = async (newsApiUrl, relativesUrl, params = {}) => {
    try {
        const response = axios.get(`${newsApiUrl}/${relativesUrl}`, { params })
        return response;
    } catch (error) {
        // Let the error propagate naturally after handling specific cases
        throw error;
    }
};