import React, { useEffect, useState } from "react";
import SkeletonMovieCard from "../../common/SkeletonMovieCard";
import OtherCard from "../components/OtherCard";
import { Other, Post } from "../types/other";
import Pagination from "../components/Pagination";
import { useSearchParams } from "react-router-dom";
import OtherSourcemodal from "../components/OtherSourceModal";

const theLoaiArr = [
  {
    cate_id: "40",
    cate_title: "Phim Sex Censored",
    cate_description:
      "Phim sex Nhật Bản, xem sex jav full hd mới nhất 2025, phim sex hay chất lượng cao hd được nhiêu người xem nhất 2025, phim sex việt sub hay, jav việt sub, phim sex được diễn viên dâm đảng và xinh nhất đóng, xem jav diễn viên đẹp nội dung hay 2025",
    cate_source: "javhdz",
    create_time: "2025-07-20 02:11:15",
  },
  {
    cate_id: "39",
    cate_title: "Phim Sex Beauty",
    cate_description:
      "Phin sex gái đẹp Nhật Bản và châu Âu 2025, jav gái đẹp vú hồng lồn bóp nhìn là muốn đụ, sex em da trắng cực xinh đẹp và gợi tình 2025, phim sex trung quốc hay nhất, china av",
    cate_source: "javhdz",
    create_time: "2025-07-20 02:08:32",
  },

  {
    cate_id: "38",
    cate_title: "Phim Sex Uncensored",
    cate_description:
      "Phim sex Nhật Bản không che full HD 1080p 2025, jav không che mới nhất 2025, phim sex không che vietsub, sex full hd không che nhanh nhất, xem phim jav không che 100% xem rõ lồn đẹp xinh, nữ sinh không che cực phê",
    cate_source: "javhdz",
    create_time: "2025-07-20 02:08:32",
  },
];
const Javhd = () => {
  const [all, setAll] = React.useState({} as Other);

  const [loading, setLoading] = React.useState(true);

  const theLoai = theLoaiArr[0].cate_id;

  const currentPage = useSearchParams()[0].get("page") || 1;

  const pageSize = 50; // số item mỗi trang

  const startIndex = (+currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPosts = all?.posts?.slice(startIndex, endIndex) || [];

  const [post, setPost] = useState<Post>();

  const electron = (window as any).electron;

  const getByTheLoai = async (id: string) => {
    setLoading(true);

    electron.ipcRenderer.send("get-other-cate", {
      cate_ids: id,
      source: "javhdz",
    });

    electron.ipcRenderer.on("other-cate", (data: Other) => {
      setAll(data);
      console.log(data);
      setLoading(false);
    });
  };
  const handleChangeTheLoai = async (id: string) => {
    getByTheLoai(id);
  };

  useEffect(() => {
    getByTheLoai(theLoai);
  }, [theLoai]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);
  return (
    <div>
      <div className="mt-4 justify-center flex items-center sticky top-[40px] z-10 w-full py-2">
        <Pagination
          page={+currentPage}
          total={Math.ceil(all?.posts?.length / pageSize) || 10}
          initialPage={1}
        />
      </div>
      <div className="flex items-center gap-4 px-6">
        <span className="text-3xl font-bold">JAVHD</span>

        <select
          className="select select-bordered select-sm w-full max-w-40"
          defaultValue={theLoai}
          onChange={(e) => handleChangeTheLoai(e.target.value)}
        >
          {theLoaiArr.map((item) => (
            <option key={item.cate_title} value={item.cate_id}>
              {item.cate_title}
            </option>
          ))}
        </select>
      </div>

      {!loading ? (
        <div className="flex flex-row flex-wrap gap-4 mt-4 px-6">
          {currentPosts?.map((item) => (
            <OtherCard
              key={item.post_id}
              m={item as any}
              onClick={() => {
                setPost(item);
                (document.getElementById("video_modal") as any)?.showModal();
              }}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-row flex-wrap gap-4 mt-4 px-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonMovieCard key={i} />
          ))}
        </div>
      )}

      <OtherSourcemodal post={post} onClose={() => setPost(undefined)} />
    </div>
  );
};

export default Javhd;
