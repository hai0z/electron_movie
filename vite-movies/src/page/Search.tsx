import React, { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { HomeResult } from "../types";
import m from "../service/MovieService";
import { MovieCard1 } from "../components/MovieCard";
import Pagination from "../components/Pagination";
import SkeletonMovieCard from "../components/SkeletonMovieCard";

const Search = () => {
  const params = useParams();

  const page = useSearchParams()[0].get("page") || 1;

  const [loading, setLoading] = React.useState(true);

  const [searchResult, setSearchResult] = React.useState({} as HomeResult);

  const getSearchResult = async () => {
    setLoading(true);
    const res = await m.search(params.keyword!, +page).finally(() => {
      setLoading(false);
    });
    setSearchResult(res);
    setLoading(false);
  };

  useEffect(() => {
    getSearchResult();
  }, [params.keyword, page]);

  return (
    <div className="pt-20 px-6">
      <div>
        <div>
          <div className="mt-4 justify-center flex items-center">
            <Pagination
              page={+page}
              total={searchResult?.paginate?.total_page}
              initialPage={+page}
            />
          </div>
          <span className="text-3xl font-bold">
            Kết quả tìm kiếm cho: {params.keyword}
          </span>
        </div>
        {!loading ? (
          <div className="flex flex-row flex-wrap gap-4 mt-4">
            {searchResult?.items?.map((item) => (
              <MovieCard1 m={item} key={item.slug} />
            ))}
          </div>
        ) : (
          <div className="flex flex-row flex-wrap gap-4 mt-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="my-4">
                <SkeletonMovieCard />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
