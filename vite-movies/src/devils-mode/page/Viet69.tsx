import React, { useEffect, useState } from "react";
import SkeletonMovieCard from "../../common/SkeletonMovieCard";
import OtherCard from "../components/OtherCard";
import { Other, Post } from "../types/other";
import Pagination from "../components/Pagination";
import { useSearchParams } from "react-router-dom";
import OtherSourcemodal from "../components/OtherSourceModal";

const theLoaiArr = [
  {
    cate_id: "3",
    cate_title: "Châu Âu",
    cate_description:
      "Phim sex châu âu là thể loại phim có nội dung kích dục cực mạnh, sex mỹ châu âu được diễn xuất bởi các diễn viên đến từ USA, những pha làm tình mạnh mẽ và chân thực nhất hiện nay.",
    cate_source: "lenlut",
    create_time: "2025-01-01 12:08:24",
  },
  {
    cate_id: "9",
    cate_title: "Gái Xinh",
    cate_description:
      "Tuyển chọn Phim Sex Gái Xinh hay nhất, xem Phim Sex Gái Xinh nhanh nhất mà không bị chặn.",
    cate_source: "lenlut",
    create_time: "2025-01-01 12:17:55",
  },

  {
    cate_id: "13",
    cate_title: "Học Sinh",
    cate_description:
      "Phim sex học sinh là thể loại sex cực hay, sex học sinh, sinh viên địt nhau song quay lại, những bộ phim này được ưa chuộng khắp nơi trên toàn thế giới hiện nay.",
    cate_source: "lenlut",
    create_time: "2025-01-01 12:20:01",
  },
  {
    cate_id: "1",
    cate_title: "JAV",
    cate_description:
      "Jav là từ khóa viết tắt của phim sex jav hd Nhật, với những em gái chân dài và dày dặn kinh nghiệm làm tình, jav hd được yêu thích và tìm kiếm nhiều nhất hiện nay.",
    cate_source: "lenlut",
    create_time: "2025-01-01 12:06:16",
  },
  {
    cate_id: "6",
    cate_title: "Không Che",
    cate_description:
      "Xem phim sex không che chất lượng tốt nhất, sex không che hàng ngày giúp bạn thỏa mãn được tình dục với những tư thế làm tình một cách sung sướng nhất.",
    cate_source: "lenlut",
    create_time: "2025-01-01 12:12:31",
  },
  {
    cate_id: "12",
    cate_title: "Thủ Dâm",
    cate_description:
      "Xem phim sex Tự Sướng online mới nhất, phim xxx Tự Sướng địt gái cực hấp dẫn, rõ nét tại LenLut.vc",
    cate_source: "lenlut",
    create_time: "2025-01-01 12:19:50",
  },
  {
    cate_id: "2",
    cate_title: "Trung Quốc",
    cate_description:
      "Phim sex trung quốc với những cảnh quay được đầu tư công phu nhất, xem sex trung quốc làm tình đẳng cấp mang lại cảm giác sung sướng khi xem.",
    cate_source: "lenlut",
    create_time: "2025-01-01 12:07:55",
  },
  {
    cate_id: "4",
    cate_title: "Việt Nam",
    cate_description:
      "Phim sex việt nam tuyển chọn những em gái hàng ngon xịn nhất, clip sex Việt làm tình chân thực cùng với những em teen mới lớn được tuyển chọn mỗi ngày.",
    cate_source: "lenlut",
    create_time: "2025-01-01 12:08:56",
  },
  {
    cate_id: "11",
    cate_title: "Viet69",
    cate_description:
      "Xem phim sex Viet69 online mới nhất, phim xxx Viet69 địt gái cực hấp dẫn, rõ nét tại LenLut.vc",
    cate_source: "lenlut",
    create_time: "2025-01-01 12:19:09",
  },
  {
    cate_id: "5",
    cate_title: "Vietsub",
    cate_description:
      "Tuyển chọn Phim Sex Vietsub hay nhất, xem Phim Sex Vietsub nhanh nhất mà không bị chặn.",
    cate_source: "lenlut",
    create_time: "2025-01-01 12:11:50",
  },
  {
    cate_id: "10",
    cate_title: "VLXX",
    cate_description:
      "VLXX là trang web tổng hợp phim sex, những bộ phim sex vlxx.com được chúng tôi chọn lọc và cập nhật liên tục tại đây cho anh em xem hoàn toàn free.",
    cate_source: "lenlut",
    create_time: "2025-01-01 12:18:41",
  },
  {
    cate_id: "14",
    cate_title: "Vụng Trộm",
    cate_description:
      "Phim sex vụng trộm, làm tình lén lút mang lại cảm xúc sung sướng cho người xem, với những cảnh quay địt nhau vụng trộm hay nhất, lén lút làm tình cực phê hiện nay.",
    cate_source: "lenlut",
    create_time: "2025-01-01 12:20:05",
  },
  {
    cate_id: "7",
    cate_title: "XNXX",
    cate_description:
      "Tổng hợp phim sex XNXX hay nhất, kho phim sex XNXX.COM chất lượng, sex xnxx mới nhất với đủ các thể loại khác nhau xem nhanh không hề có quảng cáo.",
    cate_source: "lenlut",
    create_time: "2025-01-01 12:13:12",
  },
  {
    cate_id: "8",
    cate_title: "Xvideos",
    cate_description:
      "Tổng hợp những bộ phim xvideos mới nhất làm tình cực sướng, xxx không phân biệt độ tuổi với những pha làm tình chân thực nhất từ trước đến nay.",
    cate_source: "lenlut",
    create_time: "2025-01-01 12:15:24",
  },
];
const Viet69 = () => {
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
      source: "lenlut",
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
      <div className="mt-4 justify-center flex bg-base-100 items-center sticky top-[40px] z-10 w-full py-2">
        <Pagination
          page={+currentPage}
          total={Math.ceil(all?.posts?.length / pageSize) || 10}
          initialPage={1}
        />
      </div>
      <div className="flex items-center gap-4 px-6">
        <span className="text-3xl font-bold">VIET69</span>

        <select
          className="select select-bordered select-sm w-full max-w-40 my-2"
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

export default Viet69;
