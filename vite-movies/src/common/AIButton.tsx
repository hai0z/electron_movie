import { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Other, Post } from "../devils-mode/types/other";
import React from "react";
import OtherCard from "../devils-mode/components/OtherCard";
import OtherSourceModal from "../devils-mode/components/OtherSourceModal";

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

export default function AIButton() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  const [showAI, setShowAI] = useState(false);
  const [showTransition, setShowTransition] = useState(false); // 👈 thêm state
  const [loading, setLoading] = useState(false);

  const [randomPost, setRandomPost] = useState<Post[]>([]);
  const theLoai =
    theLoaiArr[Math.floor(Math.random() * theLoaiArr.length)].cate_id;

  const [post, setPost] = useState<Post>();
  const [all, setAll] = React.useState({} as Other);

  const electron = (window as any).electron;

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const fetchAI = async () => {
    setLoading(true);
    setAll({} as Other);
    try {
      electron.ipcRenderer.send("get-other-cate", {
        cate_ids: theLoai,
        source: "sextop1",
      });

      electron.ipcRenderer.on("other-cate", (data: Other) => {
        setAll(data);
        const random8 = data.posts.sort(() => 0.5 - Math.random()).slice(0, 8);
        setRandomPost(random8);
      });
    } catch (e) {
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  const openAI = () => {
    setShowTransition(true); // show hiệu ứng trước
    setTimeout(() => {
      setShowTransition(false);
      setShowAI(true);
      fetchAI();
    }, 1500); // chạy 1.5s rồi mở AI
  };

  if (location.pathname !== "/") return null;

  return (
    <>
      <OtherSourceModal post={post} onClose={() => setPost(undefined)} />

      {/* Hiệu ứng mở đầu */}
      <AnimatePresence>
        {showTransition && (
          <motion.div
            className="fixed inset-0 z-[1200] flex items-center justify-center bg-primarys"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              className="text-5xl font-bold text-white"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              ✨ AI Power Up!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay AI */}
      <AnimatePresence>
        {showAI && (
          <motion.div
            className="fixed inset-0 z-[1000] bg-gradient-to-br from-primarys via-accent to-neutral flex items-center justify-center overflow-hidden mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{
                background:
                  "linear-gradient(270deg, #a78bfa, #60a5fa, #34d399, #f472b6, #a78bfa)",
                backgroundSize: "400% 400%",
                filter: "blur(8px)", // làm glow
              }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 6,
                ease: "linear",
                repeat: Infinity,
              }}
            />
            {/* Background hiệu ứng */}

            {/* Content */}
            <div className="relative z-10 max-w-3xl text-center p-6">
              {loading && (
                <motion.h1
                  className="text-3xl font-bold text-white drop-shadow-xl animate-pulse"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 120 }}
                >
                  ✨ AI đang suy nghĩ...
                </motion.h1>
              )}

              {!loading && all && (
                <motion.div
                  className="backdrop-blur-md rounded-2xl p-6 "
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  <p className="text-2xl font-bold my-4 text-white">
                    Video dành cho bạn
                  </p>
                  <motion.div className="flex flex-row flex-wrap gap-4">
                    {randomPost.map((post) => (
                      <OtherCard
                        key={post.post_id}
                        m={post}
                        onClick={() => {
                          setPost(post);
                          (
                            document.getElementById("video_modal") as any
                          )?.showModal();
                        }}
                      />
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </div>

            {/* Nút đóng */}
            <button
              onClick={() => {
                setShowAI(false);
                setPost(undefined);
                setRandomPost([]);
              }}
              className="absolute top-12 right-6 btn btn-circle btn-sm bg-white/20 border-0 hover:bg-white/30"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <div
        className="tooltip tooltip-top fixed z-[999] transition-all duration-150"
        data-tip="Gợi ý video"
        style={{
          bottom: visible ? 96 : 40,
          right: 24,
        }}
      >
        <button
          onClick={openAI}
          className="btn btn-primary btn-circle shadow-lg"
        >
          <Sparkles className="w-5 h-5 text-primary-content animate-pulse" />
        </button>
      </div>
    </>
  );
}
