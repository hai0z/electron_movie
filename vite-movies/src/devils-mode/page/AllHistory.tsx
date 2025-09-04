import HistoryPage from "./History";
import StoriesHistory from "./StoriesHistory";
import { useSearchParams } from "react-router-dom";

const AllHistory = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const tab = searchParams.get("tab") || "watch";
  return (
    <div className="w-full flex flex-col">
      {/* Header Tabs */}
      <div className="flex border-b border-base-content sticky top-10 z-50 bg-base-100">
        <button
          onClick={() =>
            setSearchParams({
              tab: "watch",
            })
          }
          className={`px-4 py-2 font-medium ${
            tab === "watch"
              ? "border-b-2 border-primarys text-primarys "
              : "text-base-content"
          }`}
        >
          Lịch sử xem
        </button>
        <button
          onClick={() =>
            setSearchParams({
              tab: "read",
            })
          }
          className={`px-4 py-2 font-medium ${
            tab === "read"
              ? "border-b-2 border-primarys text-primarys"
              : "text-base-content"
          }`}
        >
          Lịch sử đọc
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 h-full p-4">
        {tab === "watch" && <HistoryPage />}
        {tab === "read" && <StoriesHistory />}
      </div>
    </div>
  );
};

export default AllHistory;
