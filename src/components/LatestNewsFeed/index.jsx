import { useSelector } from "react-redux";
import ArticleCardHorizontal from "../ArticleCardHorizontal";

const LatestNewsFeed = () => {
    const { latestNewsLoading: loading, latestNewsData } = useSelector((state) => state.LatestNews);
    console.log(latestNewsData, "==>> latestNewsData");
    return (
        <div className="w-full lg:w-1/3">
            <h2 className="text-xl font-bold mb-4 text-slate-600">
                Latest News
            </h2>
            {loading ? (
                <div className="space-y-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-gray-200 h-20 rounded-lg mb-4"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {latestNewsData.map((article) => (
                        <ArticleCardHorizontal key={article.uri} article={article} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default LatestNewsFeed