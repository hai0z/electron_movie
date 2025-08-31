import React, { useEffect, useState } from "react";
import SkeletonMovieCard from "../../common/SkeletonMovieCard";
import OtherCard from "../components/OtherCard";
import { Other, Post } from "../types/other";
import Pagination from "../components/Pagination";
import { useSearchParams } from "react-router-dom";

const theLoaiArr = [
  {
    cate_id: "25",
    cate_title: "JAV",
    cate_description:
      "JAV, Tổng hợp những bộ phim JAV nội dung cực kích thích được VLXX tuyển chọn mới nhất.",
    cate_source: "vlxx",
    create_time: "2025-01-01 16:15:45",
  },
  {
    cate_id: "22",
    cate_title: "Phim cấp 3",
    cate_description:
      "Phim cap 3, xem phim cấp 3 hay nhất 2015, download phim cấp 3 tuyển chọn chất lượng HD.",
    cate_source: "vlxx",
    create_time: "2025-01-01 13:44:47",
  },

  {
    cate_id: "18",
    cate_title: "Phim sex không che",
    cate_description:
      "Phim sex không che, xem phim sex làm tình cực hay không che bao rõ nét.",
    cate_source: "vlxx",
    create_time: "2025-01-01 13:43:45",
  },
  {
    cate_id: "17",
    cate_title: "Phim sex Vietsub",
    cate_description:
      "Phim sex Vietsub, kho phim JAV phụ đề Việt có nội dung hay do VLXX biên dịch và sưu tầm.",
    cate_source: "vlxx",
    create_time: "2025-01-01 13:43:00",
  },

  {
    cate_id: "20",
    cate_title: "Sex học sinh",
    cate_description: "Phim sex học sinh.",
    cate_source: "vlxx",
    create_time: "2025-01-01 13:44:21",
  },
  {
    cate_id: "23",
    cate_title: "Sex Mỹ - Châu Âu",
    cate_description:
      "Tuyển tập phim sex Châu Âu, xem sex Châu Âu chất lượng HD có nội dung hay tại VLXX.",
    cate_source: "vlxx",
    create_time: "2025-01-01 13:44:48",
  },
  {
    cate_id: "21",
    cate_title: "Vụng trộm - Ngoại tình",
    cate_description:
      "Phim vụng trộm, xem phim sex vụng trộm hay, sex lén lút ngoại tình hấp dẫn.",
    cate_source: "vlxx",
    create_time: "2025-01-01 13:44:23",
  },
];
const Vlxx = () => {
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
      source: "vlxx",
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
      <div className="mt-4 justify-center flex items-center sticky top-[40px] z-10 w-full bg-base-100 bg-opacity-90 backdrop-blur-md py-2">
        <Pagination
          page={+currentPage}
          total={Math.ceil(all?.posts?.length / pageSize)}
          initialPage={1}
        />
      </div>
      <div className="flex items-center gap-4 px-6">
        <span className="text-3xl font-bold">VLXX</span>

        <select
          className="select select-bordered select-sm w-full max-w-40"
          defaultValue={theLoai}
          onChange={(e) => handleChangeTheLoai(e.target.value)}
        >
          {theLoaiArr.map((item) => (
            <option key={item.cate_id} value={item.cate_id}>
              {item.cate_title}
            </option>
          ))}
        </select>
      </div>

      {!loading ? (
        <div className="flex flex-row flex-wrap gap-4 mt-4 px-6">
          {currentPosts?.map((item) => (
            <OtherCard
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

      <dialog id="video_modal" className="modal">
        <div className="modal-box max-w-5xl w-full p-0 overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 border-b">
            <h3 className="font-bold text-lg line-clamp-1">
              {post?.post_title}
            </h3>
          </div>

          {/* Iframe player */}
          <div className="w-full aspect-video bg-black">
            <iframe
              src={post?.post_stream}
              title={post?.post_title}
              className="w-full h-full"
              allowFullScreen
            />
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t flex justify-between items-center">
            <span className="text-sm opacity-70">{post?.post_actor}</span>
            <form method="dialog">
              <button className="btn btn-sm" onClick={() => setPost(undefined)}>
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Vlxx;
