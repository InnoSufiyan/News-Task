import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { useDispatch } from "react-redux";
import FilterBar from "./components/FilterBar";
import { fetchNewsThunk, fetchLatestNewsThunk } from "./redux/reducers/actions/fetchNews";
import NewsFeed from "./components/NewsFeed";
import LatestNewsFeed from "./components/LatestNewsFeed";


function App() {
  const dispatch = useDispatch();
  const [latestLoading, _] = useState(true); // Pagination loading
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  const fetchNews = async () => {
    dispatch(fetchNewsThunk()).unwrap().catch((err) => {
      console.log(err, "==>> err");
      toast.error("Failed to fetch news");
    })
    dispatch(fetchLatestNewsThunk()).unwrap().catch(() => toast.error("Failed to fetch latest news"))
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Header
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
          <FilterBar />


          <div className="flex flex-col lg:flex-row lg:space-x-6">
            {/* Main News Section */}
            <NewsFeed />

            {/* Latest News Section */}
            <LatestNewsFeed />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
