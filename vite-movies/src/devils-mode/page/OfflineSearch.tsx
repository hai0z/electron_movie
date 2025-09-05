import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { VietSubCard } from "../components/VietSubCard";
import { Search, X, ChevronLeft } from "lucide-react";
import Pagination from "../components/Pagination";
const electron = (window as any).electron;

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get("q") || ""; // lấy từ
  // URL
  const page = searchParams.get("page") || "1"; // lấy từ URL

  const action = searchParams.get("action") || "0"; // lấy từ URL

  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(false);

  // Hàm search
  const handleSearch = () => {
    console.log("vai lozz");

    if (!query.trim()) return;

    setLoading(true);

    electron.ipcRenderer.send("offline-search", {
      q: query,
      page: Number(page),
      limit: 50,
    });

    // ⚡ dùng once để tránh lặp listener
    electron.ipcRenderer.on("offline-search-result", (data: any) => {
      setResults(JSON.parse(data));
      console.log(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (action === "1") {
      handleSearch();
    }
  }, []);

  useEffect(() => {
    handleSearch();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);

  return (
    <div className="p-6 w-full h-full">
      {/* search bar */}
      <div className="sticky top-10 z-50 bg-base-100">
        <div className="flex items-center gap-2 mb-2 py-2">
          {/* nút quay lại */}
          <button
            onClick={() => navigate(-1)}
            className="btn btn-ghost btn-circle"
            title="Quay lại"
          >
            <ChevronLeft />
          </button>

          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Nhập tên phim hoặc diễn viên..."
              value={query}
              onChange={(e) => setSearchParams({ q: e.target.value })}
              className="input input-bordered w-full pl-10 pr-10 rounded-2xl"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            {/* nút xóa */}
            {query && (
              <button
                onClick={() => setSearchParams({ q: "" })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                title="Xóa"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <button
            onClick={handleSearch}
            className={`btn btn-primary rounded-2xl px-6 ${
              loading ? "loading" : ""
            }`}
          >
            {loading ? "Đang tìm..." : "Tìm"}
          </button>
        </div>
        <div className=" bg-base-100 w-full flex justify-center items-center pb-2">
          {results?.movies?.length >= 1 && (
            <Pagination
              to={`q=${query}`}
              initialPage={+page}
              total={results?.page?.last_page}
              page={+page}
            />
          )}
        </div>
      </div>

      {/* results */}
      {!loading && results?.movies?.length > 0 && (
        <h2 className="text-lg font-semibold mb-4">
          🔎 Kết quả tìm thấy: {results?.page?.total} phim
        </h2>
      )}

      <div className="flex flex-row flex-wrap gap-4 px-6">
        {results?.movies?.map((movie: any) => (
          <VietSubCard m={movie} key={movie.id} />
        ))}
      </div>
    </div>
  );
}
