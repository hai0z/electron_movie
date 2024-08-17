import React, { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { HomeResult } from "../types";
import { MovieCard1 } from "../components/MovieCard";
import Pagination from "../components/Pagination";
import SkeletonMovieCard from "../../common/SkeletonMovieCard";

const Search = () => {
  const params = useParams();

  const electron = (window as any).electron;
  const page = useSearchParams()[0].get("page") || 1;

  const [loading, setLoading] = React.useState(true);

  const [searchResult, setSearchResult] = React.useState({} as HomeResult);

  const getSearchResult = async () => {
    setLoading(true);
    electron.ipcRenderer.send("search", {
      keyword: params.keyword,
      page: +page,
    });
    electron.ipcRenderer.on("search-result", (data: HomeResult) => {
      setSearchResult(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    getSearchResult();
  }, [params.keyword, page]);

  return (
    <div className="pt-20">
      <div>
        <div className="mt-4 justify-center flex items-center sticky top-[90px] z-10 w-full bg-base-100 bg-opacity-90 backdrop-blur-md py-2">
          <Pagination
            page={+page}
            total={searchResult?.pagecount}
            initialPage={+page}
          />
        </div>
        <span className="text-3xl font-bold px-6">
          Kết quả tìm kiếm cho: {params.keyword}
        </span>
        {!loading ? (
          <div className="flex flex-row flex-wrap gap-4 mt-4 px-6">
            {searchResult?.list?.map((item) => (
              <MovieCard1 m={item} key={item.id} />
            ))}
          </div>
        ) : (
          <div className="flex flex-row flex-wrap gap-4 mt-4 px-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <SkeletonMovieCard key={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
