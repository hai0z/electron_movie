import React, { useEffect } from "react";
import { VietSubResult } from "../types/vietsub";
import Pagination from "../components/Pagination";
import { useNavigate, useSearchParams } from "react-router-dom";
import SkeletonMovieCard from "../../common/SkeletonMovieCard";
import { MediaListVietSub } from "../components/MediaList";

const theLoaiArr = [
  {
    id: "all",
    name: "Tất cả",
  },
  {
    id: "viet-nam-clip",
    name: "Việt Nam",
  },
  {
    id: "vietsub",
    name: "Việt sub",
  },
  {
    id: "chau-au",
    name: "Châu Âu",
  },
  {
    id: "trung-quoc",
    name: "Trung Quốc",
  },
  {
    id: "han-quoc-18-",
    name: "Hàn Quốc",
  },
  {
    id: "khong-che",
    name: "Không che",
  },
  {
    id: "jav-hd",
    name: "JAV HD",
  },
  {
    id: "hentai",
    name: "Hentai",
  },
];
const VietSub = () => {
  const [all, setAll] = React.useState({} as VietSubResult);

  const page = useSearchParams()[0].get("page") || 1;

  const [loading, setLoading] = React.useState(true);

  const theLoai = useSearchParams()[0].get("theLoai") || "all";
  const navigate = useNavigate();

  const getByTheLoai = async (id: string) => {
    setLoading(true);
    const res = await fetch(
      `https://xxvnapi.com/api/chuyen-muc/${id}?page=${page}`
    );
    const data = await res.json();
    setAll(data);
    setLoading(false);
  };
  const handleChangeTheLoai = async (id: string) => {
    navigate(`?page=1&theLoai=${id}`, { replace: true });
    if (id === "all") {
      getAll();
    } else {
      getByTheLoai(id);
    }
  };
  const getAll = async () => {
    setLoading(true);
    const res = await fetch(
      "https://xxvnapi.com/api/phim-moi-cap-nhat?page=" + page
    );
    const data = await res.json();
    setAll(data);
    setLoading(false);
  };
  useEffect(() => {
    if (theLoai === "all") {
      getAll();
    } else {
      getByTheLoai(theLoai);
    }
  }, [page]);

  return (
    <div className="pt-20">
      <div className="mt-4 justify-center flex items-center sticky top-[90px] z-10 w-full bg-base-100 bg-opacity-90 backdrop-blur-md py-2">
        <Pagination
          to={`theLoai=${theLoai}`}
          page={+page}
          total={all?.page?.last_page}
          initialPage={+page}
        />
      </div>
      <div className="flex items-center gap-4 px-6">
        <span className="text-3xl font-bold">VIP</span>
        <select
          className="select select-bordered select-sm w-full max-w-40"
          defaultValue={theLoai}
          onChange={(e) => handleChangeTheLoai(e.target.value)}
        >
          {theLoaiArr.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {!loading ? (
        <div className="flex flex-row flex-wrap gap-4 mt-4 px-6">
          {all?.movies?.map((item) => (
            <MediaListVietSub m={item as any} key={item.slug} />
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

export default VietSub;
