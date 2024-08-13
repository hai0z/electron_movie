import { useParams, useSearchParams } from "react-router-dom";
import m, { Category } from "../service/MovieService";
import React, { useEffect } from "react";
import { HomeResult } from "../types";
import SkeletonMovieCard from "../components/SkeletonMovieCard";
import { MovieCard1 } from "../components/MovieCard";
import Pagination from "../components/Pagination";

const CategoryScreens = () => {
  const params = useParams();
  const page = useSearchParams()[0].get("page") || 1;

  const [loading, setLoading] = React.useState(true);

  const [data, setData] = React.useState({} as HomeResult);

  const getMovies = async () => {
    setLoading(true);
    const res = await m
      .getByCategory(+params.category! as Category, +page, params.slug)
      .finally(() => {
        setLoading(false);
      });
    console.log(res);
    setData(res);
  };

  useEffect(() => {
    getMovies();
  }, [params, page]);

  console.log(params.category);
  return (
    <div className="px-6 pt-20">
      <div className="mt-4 justify-center flex items-center">
        <Pagination
          page={+page}
          total={data?.paginate?.total_page}
          initialPage={+page}
        />
      </div>
      <div>
        <span className="text-3xl font-bold">{params.title}</span>
      </div>

      {!loading ? (
        <div className="flex flex-row flex-wrap gap-4 mt-4">
          {data?.items?.map((item) => (
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
  );
};

export default CategoryScreens;
