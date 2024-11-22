import { getMethod } from "../utils/responseHandler.js"
import { newsApiKey } from "../config/constant";
class NewsService {
    constructor() { }

    static async getNews(query, category, fromDate, toDate, page = 1, source) {
        const params = {
            apiKey: newsApiKey,
            language: "en",
            pageSize: 12,
            page,
        }
        if (query) params.q = query;
        if (category && category !== "all") params.category = category;
        if (fromDate) params.from = fromDate;
        if (toDate) params.to = toDate;
        if (source.id) params.sources = source.id;
        return getMethod(`top-headlines`, params)
            .then(response => {
                console.log(response, "==>> response")
                if (response.data.status) {
                    return response.data;
                } else {
                    return Promise.reject(response.data);
                }
            })
            .catch(error => Promise.reject(error));
    }

    static async getSources() {
        console.log("==>> getting Sources")
        const params = {
            apiKey: newsApiKey,
        }

        return getMethod(`top-headlines/sources`, params)
            .then(response => {
                console.log(response, "==>> response")
                if (response.data.status) {
                    return response.data;
                } else {
                    return Promise.reject(response.data);
                }
            })
            .catch(error => Promise.reject(error));
    }
}

export default NewsService