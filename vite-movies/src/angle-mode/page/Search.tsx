import React, { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { HomeResult } from "../types";
import m from "../service/MovieService";
import { MovieCard1 } from "../components/MovieCard";
import Pagination from "../components/Pagination";
import SkeletonMovieCard from "../../common/SkeletonMovieCard";

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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pt-24 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <h1 className="text-4xl font-bold text-white bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Search Results for:{" "}
              <span className="text-transparent">{params.keyword}</span>
            </h1>
            <div className="w-full max-w-2xl">
              <Pagination
                page={+page}
                total={searchResult?.paginate?.total_page}
                initialPage={+page}
              />
            </div>
          </div>

          <div className="mt-8">
            {!loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {searchResult?.items?.map((item) => (
                  <div className="transform hover:scale-105 transition-transform duration-200">
                    <MovieCard1 m={item} key={item.slug} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div className="transform hover:scale-105 transition-transform duration-200">
                    <SkeletonMovieCard key={i} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
