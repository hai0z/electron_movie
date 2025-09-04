import { useSearchParams } from "react-router-dom";
import React, { useEffect } from "react";
import { HomeResult } from "../types";
import SkeletonMovieCard from "../../common/SkeletonMovieCard";
import Pagination from "../components/Pagination";
import { MovieCard1 } from "../components/MovieCard";

const OldScreen = () => {
  const page = useSearchParams()[0].get("page") || 1;

  const electron = (window as any).electron;

  const [loading, setLoading] = React.useState(true);

  const [data, setData] = React.useState({} as HomeResult);

  const getMovies = async () => {
    setLoading(true);
    electron.ipcRenderer.send("get-old", page);

    electron.ipcRenderer.on("old-data", (data: HomeResult) => {
      setData(data);
      setLoading(false);
      console.log(data);
    });
  };

  useEffect(() => {
    getMovies();
  }, [page]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);

  return (
    <div>
      <div className="mt-4 justify-center flex items-center sticky top-[40px] z-10 w-full bg-base-100 py-2">
        <Pagination page={+page} total={data?.pagecount} initialPage={+page} />
      </div>
      <div className="px-6">
        <span className="text-3xl font-bold">Old Video (6tr video)</span>
      </div>
      {!loading ? (
        <div className="flex flex-row flex-wrap gap-4 mt-4 px-6">
          {data?.list?.map((item, i) => (
            <MovieCard1 m={item as any} key={i} type="old" />
          ))}
        </div>
      ) : (
        <div className="flex flex-row flex-wrap gap-4 mt-4 px-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonMovieCard key={i} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OldScreen;
