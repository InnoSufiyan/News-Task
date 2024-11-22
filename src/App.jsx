import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { GrTechnology } from "react-icons/gr";
import { FaBusinessTime } from "react-icons/fa";
import { MdHealthAndSafety, MdOutlineSportsBasketball } from "react-icons/md";
import { IoMdMusicalNotes } from "react-icons/io";
import { GiMaterialsScience } from "react-icons/gi";
import CategoryFilter from "./components/CategoryFilter";
import DateFilter from "./components/DateFilter";
import { format } from "date-fns";
import SourceFilter from "./components/SourceFilter";
import { useDispatch, useSelector } from "react-redux";
import { newsFailed, newsPending, newsSuccess } from "./redux/reducers/newsSlice";
import NewsService from "./services/newsService";
import ArticleCard from "./components/ArticleCard";
import Pagination from "./components/Pagination";
import { sourcesFailed, sourcesPending, sourcesSuccess } from "./redux/reducers/sourcesSlice";

const ITEMS_PER_PAGE = 12;

const categories = [
  { id: "technology", icon: GrTechnology, name: "Technology" },
  { id: "business", icon: FaBusinessTime, name: "Business" },
  { id: "sports", icon: MdOutlineSportsBasketball, name: "Sports" },
  { id: "entertainment", icon: IoMdMusicalNotes, name: "Entertainment" },
  { id: "science", icon: GiMaterialsScience, name: "Science" },
  { id: "health", icon: MdHealthAndSafety, name: "Health" },
];


function App() {
  const dispatch = useDispatch();
  const { newsLoading: loading, newsData, newsCount, newsError } = useSelector((state) => state.News);
  const { sourcesLoading, sourcesData, sourcesError } = useSelector((state) => state.Sources);
  const [currentPage, setCurrentPage] = useState(1);
  const [latestLoading, setLatestLoading] = useState(true); // Pagination loading
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [source, setSource] = useState({ name: "Sources", id: "" });
  const [dateRange, setDateRange] = useState([
    null,
    null,
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, endDate] = dateRange;
  const handleSearch = (query) => {
    setCurrentPage(1);
    setSearchQuery(query);
  };
  const totalPages = Math.ceil(newsCount / ITEMS_PER_PAGE);

  const fetchNews = async () => {
    const formattedStartDate = startDate
      ? format(startDate, "yyyy-MM-dd")
      : undefined;
    const formattedEndDate = endDate
      ? format(endDate, "yyyy-MM-dd")
      : undefined;
    try {
      dispatch(newsPending());
      const res = await NewsService.getNews(searchQuery,
        selectedCategory,
        formattedStartDate,
        formattedEndDate,
        currentPage,
        source);
      console.log(res, "==>> res");
      dispatch(newsSuccess({
        data: res.articles,
        count: res.totalResults
      }));
    } catch (error) {
      dispatch(newsFailed({
        message: error.message
      }))
      toast.error("Failed to fetch news");
    }
  };

  const fetchSources = async () => {
    console.log("fetching sources ==>> ");
    dispatch(sourcesPending());
    try {
      const res = await NewsService.getSources();
      console.log(res, "==>> res");
      dispatch(sourcesSuccess({
        data: res.sources
      }));
    } catch (error) {
      dispatch(sourcesFailed({
        message: error.message
      }))
      toast.error("Failed to fetch sources");
    }
  };

  console.log(totalPages, "==>> totalPages");

  const handlePageChange = (page) => {
    console.log(page, "==>> page");
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    fetchNews();
  }, [searchQuery, currentPage, selectedCategory, startDate, endDate, source]);

  useEffect(() => {
    console.log("fetching sources");
    fetchSources();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Header
        onSearch={handleSearch}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />
      <Sidebar isOpen={isSidebarOpen} />

      <main className="transition-all duration-300 ease-in-out lg:ml-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-xl font-bold mb-2 text-slate-600">
            Top Categories
          </h2>
          {/*Filters Section  */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              setCurrentPage={setCurrentPage}
            />
            <div className="flex md:flex-nowrap flex-wrap gap-4 items-center justify-center">
              <SourceFilter source={source} sources={sourcesData} onSourceChange={setSource} />
              <DateFilter
                startDate={startDate}
                endDate={endDate}
                onDateChange={setDateRange}
              />
            </div>
          </div>
          <div className="flex flex-col lg:flex-row lg:space-x-6">
            {/* Main News Section */}
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-4 text-slate-600">
                All News
              </h2>
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-6 max-w-full">
                    {newsData.map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  )}
                </>
              )}
            </div>
            {/* Latest News Section */}
            <div className="w-full lg:w-1/3">
              <h2 className="text-xl font-bold mb-4 text-slate-600">
                Latest News
              </h2>
              {latestLoading ? (
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 h-20 rounded-lg mb-4"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* {latestArticles.map((article) => (
                    <ArticleCardHorizontal key={article.id} article={article} />
                  ))} */}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
