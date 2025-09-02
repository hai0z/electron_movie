import React, { useEffect, useState } from "react";
import SkeletonMovieCard from "../../common/SkeletonMovieCard";
import OtherCard from "../components/OtherCard";
import { Other, Post } from "../types/other";
import Pagination from "../components/Pagination";
import { useSearchParams } from "react-router-dom";

const theLoaiArr = [
  {
    cate_id: "34",
    cate_title: "JAV",
    cate_description:
      "JAV, tuyển chọn những bộ phim JAV có nội dung hay, mang đến nhiều cảm xúc, được SexTop1 lựa chọn cẩn thận.",
    cate_source: "sextop1",
    create_time: "2025-01-05 00:39:04",
  },
  {
    cate_id: "31",
    cate_title: "Hiếp Dâm",
    cate_description:
      "Tuyển tập phim sex hiếp dâm, những bộ phim xxx có nội dung cưỡng hiếp được tuyển chọn diễn viên xinh đẹp. Tất cả đều là diễn viên chuyên nghiệp thực hiện.",
    cate_source: "sextop1",
    create_time: "2025-01-05 00:35:49",
  },
  {
    cate_id: "32",
    cate_title: "Không Che",
    cate_description:
      "Phim sex JAV không che tuyển chọn diễn viên đẹp, có nội dung hay. Tổng hợp phim sex không che được cập nhật tại SEXTOP1.NET",
    cate_source: "sextop1",
    create_time: "2025-01-05 00:37:50",
  },
  {
    cate_id: "29",
    cate_title: "Loạn Luân",
    cate_description:
      "Tổng hợp phim sex loạn luân có nội dung hay, những bộ xxx gia đình lén lút loạn luân được tuyển chọn bởi SEXTOP1.NET",
    cate_source: "sextop1",
    create_time: "2025-01-05 07:27:22",
  },
  {
    cate_id: "35",
    cate_title: "Phim Sex HD",
    cate_description:
      "Tuyển chọn Phim Sex HD có nội dung được tuyển chọn hay nhất. Phim JAV HD được cập nhật hằng ngày với chất lượng tốt nhất.",
    cate_source: "sextop1",
    create_time: "2025-01-05 01:11:31",
  },
  {
    cate_id: "30",
    cate_title: "Sex Mỹ – Châu Âu",
    cate_description:
      "Phim sex Châu Âu là những bộ phim được đóng bởi những diễn viên người Mỹ, thường ngắn, không dài như JAV, nhưng lại không che và có chất lượng rất tốt, nữ diễn viên Mỹ xinh đẹp, thần thái tuyệt vời.",
    cate_source: "sextop1",
    create_time: "2025-01-05 07:29:21",
  },
  {
    cate_id: "33",
    cate_title: "Trung Quốc",
    cate_description:
      "Tuyển chọn phim sex Trung Quốc gái xinh hấp dẫn, những bộ phim được đầu tư công phu chẳng khác gì JAV, tuy hơi ngắn nhưng vẫn phê lắm",
    cate_source: "sextop1",
    create_time: "2025-01-05 00:38:29",
  },
  {
    cate_id: "28",
    cate_title: "Việt Sub",
    cate_description:
      "Xem phim sex việt sub tuyển chọn, các thể loại phim sex có nội dung hay được phụ đề tiếng việt do SexTop1 sưu tầm với chất lượng HD.",
    cate_source: "sextop1",
    create_time: "2025-01-05 07:27:07",
  },
  {
    cate_id: "36",
    cate_title: "XNXX",
    cate_description:
      "Xem phim sex XNXX chọn lọc chất lượng cao, phim XNXX.COM xem nhanh không bị chặn tại SEXTOP1",
    cate_source: "sextop1",
    create_time: "2025-01-05 01:12:51",
  },
  {
    cate_id: "37",
    cate_title: "Xvideos",
    cate_description:
      "Xem phim sex XVIDEOS được tuyển chọn có nội dung hay tại SEXTOP1. Những bộ phim XXX gái xinh hấp dẫn.",
    cate_source: "sextop1",
    create_time: "2025-01-05 01:13:41",
  },
];
const Sextop1 = () => {
  const [all, setAll] = React.useState({} as Other);

  const [loading, setLoading] = React.useState(true);

  const theLoai = theLoaiArr[0].cate_id;

  const currentPage = useSearchParams()[0].get("page") || 1;

  const pageSize = 50; // số item mỗi trang

  const startIndex = (+currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPosts = all?.posts?.slice(startIndex, endIndex) || [];

  const [post, setPost] = useState<Post>();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  const electron = (window as any).electron;

  const getByTheLoai = async (id: string) => {
    setLoading(true);

    electron.ipcRenderer.send("get-other-cate", {
      cate_ids: id,
      source: "sextop1",
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

  return (
    <div>
      <div className="mt-4 justify-center flex items-center sticky top-[40px] z-10 w-full  py-2">
        <Pagination
          page={+currentPage}
          total={Math.ceil(all?.posts?.length / pageSize) || 10}
          initialPage={1}
        />
      </div>
      <div className="flex items-center gap-4 px-6">
        <span className="text-3xl font-bold">SEXTOP1</span>

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

export default Sextop1;
