import { useParams, useSearchParams } from "react-router-dom";
import React, { useEffect } from "react";
import { HomeResult } from "../types";
import SkeletonMovieCard from "../../common/SkeletonMovieCard";
import Pagination from "../components/Pagination";
import { MediaList } from "../components/MediaList";

const CategoryScreens = () => {
  const params = useParams();
  const page = useSearchParams()[0].get("page") || 1;

  const electron = (window as any).electron;

  const [loading, setLoading] = React.useState(true);

  const [data, setData] = React.useState({} as HomeResult);

  const getMovies = async () => {
    setLoading(true);
    electron.ipcRenderer.send("get-by-category", {
      category: params.category,
      page,
      keyword: params.keyword,
    });

    electron.ipcRenderer.on("movie-category", (data: HomeResult) => {
      setData(data);
      console.log(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    getMovies();
  }, [params, page]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  return (
    <div className="pt-20">
      <div className="mt-4 justify-center flex items-center sticky top-[90px] z-10 w-full bg-base-100 bg-opacity-90 backdrop-blur-md py-2">
        <Pagination page={+page} total={data?.pagecount} initialPage={+page} />
      </div>
      <div className="px-6">
        <span className="text-3xl font-bold">{params.title}</span>
      </div>

      {!loading ? (
        <div className="flex flex-row flex-wrap gap-4 mt-4 px-6">
          {data?.list?.map((item) => (
            <MediaList m={item} key={item.slug} />
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
  );
};

export default CategoryScreens;
