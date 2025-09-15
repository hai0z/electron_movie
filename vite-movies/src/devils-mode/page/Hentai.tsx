import React, { useEffect } from "react";
import SkeletonMovieCard from "../../common/SkeletonMovieCard";
import Pagination from "../components/Pagination";
import { useSearchParams } from "react-router-dom";
import { Hentai } from "../types/Hentai";
import { HentaiMovieCard } from "../components/HentaiMovieCard";

interface IHentaiResult {
  data: Hentai[];
  page: number;
  totalPages: number;
  totalItems: number;
}

const HentaiPage = () => {
  const [all, setAll] = React.useState<IHentaiResult>({} as IHentaiResult);

  const [loading, setLoading] = React.useState(true);

  const currentPage = useSearchParams()[0].get("page") || 1;

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  const electron = (window as any).electron;

  const getHentai = async () => {
    setLoading(true);
    console.log("2342");
    electron.ipcRenderer.send("get-hentais", {
      page: +currentPage,
    });
  };

  useEffect(() => {
    getHentai();
    electron.ipcRenderer.on("hentai-data", (data: string) => {
      setAll(JSON.parse(data));
      setLoading(false);
    });
  }, [currentPage]);

  return (
    <div className="w-full">
      <div className="mt-4 justify-center flex bg-base-100 items-center sticky top-[40px] z-10 w-full  py-2">
        <Pagination
          page={+currentPage}
          total={all.totalPages}
          initialPage={1}
        />
      </div>
      <div className="flex items-center gap-4 px-6">
        <span className="text-3xl font-bold">HENTAI</span>
      </div>

      {!loading ? (
        <div className="flex flex-row flex-wrap gap-4 mt-4 px-6">
          {all?.data?.map((item) => (
            <HentaiMovieCard key={item.id} m={item as any} />
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

export default HentaiPage;
