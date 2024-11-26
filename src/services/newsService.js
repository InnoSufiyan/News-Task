import { getMethod } from "../utils/responseHandler.js"
import { newsApiKey, newsApiUrl, newyorkApiUrl, newyorkApiKey, guardianApiUrl, guardianApiKey } from "../config/constant";
import { format } from "date-fns";
class NewsService {
    constructor() { }

    static async getNews({ query, category, fromDate, toDate, page = 1, source }) {
        console.log(source, "==>> source")
        let url = "";
        let relativesUrl = "";
        let params = {};
        if (source == "NewsAPI") {
            url = newsApiUrl;
            relativesUrl = "top-headlines";
            params = {
                apiKey: newsApiKey,
                language: "en",
                pageSize: 12,
                page,
            }
            if (query) params.q = query;
            if (category && category !== "all") params.category = category;
            if (fromDate) params.from = format(fromDate, "yyyy-MM-dd");
            if (toDate) params.to = format(toDate, "yyyy-MM-dd");

            return getMethod(url, relativesUrl, params)
                .then(response => {
                    console.log(response, "==>> response")
                    if (response.data.status) {
                        console.log(response.data, "==>> response.data.articles")
                        return response.data;
                    } else {
                        return Promise.reject(response.data);
                    }
                })
                .catch(error => Promise.reject(error));
        }

        if (source == "The Guardian") {
            url = guardianApiUrl;
            relativesUrl = "search";
            params = {
                "api-key": guardianApiKey,
                language: "en",
                "page-size": 12,
                page
            }
            if (query) params.q = query;
            if (category && category !== "all") params.section = category;
            if (fromDate) params.fromDate = format(fromDate, "yyyy-MM-dd");
            if (toDate) params.toDate = format(toDate, "yyyy-MM-dd");

            return getMethod(url, relativesUrl, params)
                .then(response => {
                    console.log(response, "==>> responsewwwwweeee")
                    if (response.status) {
                        console.log(response.data.response.results, "==>> response.data.response.results")
                        return {
                            articles: response.data.response.results.map((article) => {
                                return {
                                    id: article.id,
                                    title: article.webTitle,
                                    description: article.fields?.bodyText?.substring(0, 200) || '',
                                    source: {
                                        name: 'TheGuardian',
                                    },
                                    author: article.fields?.byline || undefined,
                                    publishedAt: article.webPublicationDate,
                                    urlToImage: article.fields?.thumbnail || '',
                                    category: article.sectionName
                                }
                            }),
                            totalResults: response.data.response.total
                        }
                    } else {
                        return Promise.reject(response.data);
                    }
                })
                .catch(error => Promise.reject(error));
        }

        if (source == "New York Times") {
            url = newyorkApiUrl;
            relativesUrl = "search/v2/articlesearch.json";
            params = {
                "api-key": newyorkApiKey,
            }

            if (query) params.q = query;
            if (category && category !== "all") params.fq = `news_desk:("${category}")`;
            if (fromDate) params.begin_date = format(fromDate, "yyyyMMdd");
            if (toDate) params.end_date = format(toDate, "yyyyMMdd");


            return getMethod(url, relativesUrl, params)
                .then(response => {
                    console.log(response, "==>> responsewwwwweeee")
                    if (response.data.status) {
                        console.log(response.data.response.docs, "==>> response.data.response.docs")
                        return {
                            articles: response.data.response.docs.map((article) => {
                                return {
                                    id: article.web_url,
                                    title: article.headline.main,
                                    description: article.abstract || '',
                                    source: {
                                        name: 'NewYorkTimes',
                                    },
                                    author: article.byline?.original?.replace('By ', '') || undefined,
                                    publishedAt: article.pub_date,
                                    urlToImage: article.multimedia?.[0]?.url ?
                                        `https://www.nytimes.com/${article.multimedia[0].url}` : '',
                                    category: undefined
                                }
                            }),
                            totalResults: response.data.response.meta.hits
                        }
                    } else {
                        return Promise.reject(response.data);
                    }
                })
                .catch(error => Promise.reject(error));
        }

    }

    static async getLatestNews() {
        const params = {
            "api-key": newyorkApiKey,
        }
        return getMethod(newyorkApiUrl, `topstories/v2/world.json`, params)
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