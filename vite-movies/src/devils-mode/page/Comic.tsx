import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Pagination from "../components/Pagination";
import { Stories } from "../types/Story";
import Loading from "../../common/Loading";
import HentaiCard from "../components/HentaiCard";

const ComicPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const query = searchParams.get("q") || "";

  const [data, setData] = useState<Stories>();
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState(query);

  const getData = async () => {
    setLoading(true);

    const url = query
      ? `https://truyenx.link/sayhentai/channels/search?q=${encodeURIComponent(
          query
        )}&page=${page}&t=${Date.now()}`
      : `https://truyenx.link/sayhentai/channels?page=${page}&t=${Date.now()}`;

    const res = await fetch(url);
    const dt = await res.json();
    setData(dt);
    setLoading(false);
  };

  useEffect(() => {
    getData();
    window.scrollTo({
      left: 0,
      top: 0,
      behavior: "smooth",
    });
  }, [page, query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: keyword, page: "1" });
  };

  if (loading) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="pb-20 w-full h-full">
      {/* Search box */}
      <form
        onSubmit={handleSearch}
        className="flex justify-center mt-4 px-4 gap-2"
      >
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="input input-bordered w-full max-w-md"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Tìm kiếm
        </button>
        {query && (
          <button
            type="button"
            className="btn btn-outline btn-secondary"
            onClick={() => {
              setKeyword("");
              setSearchParams({ page: "1" }); // 👈 reset về data ban đầu
            }}
          >
            Clear
          </button>
        )}
      </form>

      {/* Pagination */}
      <div className="mt-4 justify-center flex items-center sticky top-[40px] z-10 w-full bg-base-100 py-2">
        <Pagination
          page={page}
          total={data?.load_more.pageInfo.last_page!}
          initialPage={page}
        />
      </div>

      {/* Content */}
      <div className="flex flex-row flex-wrap px-4 gap-4 pt-4">
        {data?.channels.map((stories) => (
          <HentaiCard key={stories.id} channel={stories} />
        ))}
      </div>
    </div>
  );
};

export default ComicPage;
