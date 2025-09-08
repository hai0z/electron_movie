import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MediaList, MediaListVietSub } from "../components/MediaList";
import { HomeResult } from "../types";
import Loading from "../../common/Loading";
import React from "react";
import { VietSubResult } from "../types/vietsub";
import LZString from "lz-string";

import {
  Film,
  ShieldCheck,
  EyeOff,
  Eye,
  Clapperboard,
  Star,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import { useDailyStore } from "../../zustand/dailyVideoStore";
import DailyCard from "../components/DailyCard";
import NotificationBell from "../components/NotiBell";
import RestoreModal from "../components/RestoreModal";
import MaybeYouLike from "../components/MaybeYouLike";

const CACHE_KEY_HOME = "home_cache";
const CACHE_KEY_VIETSUB = "vietsub_cache";
const CACHE_TTL = 1000 * 60 * 30; // cache 30 phút

const HomePage = () => {
  const [_, setHome] = useState({} as HomeResult);
  const [cencored, setCencored] = useState({} as HomeResult);
  const [uncencored, setUncencored] = useState({} as HomeResult);
  const [uncencoredLeaked, setUncencoredLeaked] = useState({} as HomeResult);
  const [chinese, setChinese] = useState({} as HomeResult);
  const [loading, setLoading] = useState(false);
  const [all, setAll] = React.useState({} as VietSubResult);
  const userName = JSON.parse(localStorage.getItem("user")!).name;

  const { generateDaily, generateMaybeLike } = useDailyStore();
  const electron = (window as any).electron;

  const getAll = async () => {
    try {
      // check cache
      const cache = localStorage.getItem(CACHE_KEY_VIETSUB);
      if (cache) {
        const parsed = JSON.parse(LZString.decompress(cache));
        if (Date.now() - parsed.timestamp < CACHE_TTL) {
          setAll(parsed.data);
          setLoading(false);
          return;
        }
      }
      setLoading(true);

      const res = await fetch(
        "https://xxvnapi.com/api/phim-moi-cap-nhat?page=1"
      );
      const data = await res.json();
      setAll({
        ...data,
        movies: data.movies.slice(0, 8),
      });
      localStorage.setItem(
        CACHE_KEY_VIETSUB,
        LZString.compress(
          JSON.stringify({
            data: {
              ...data,
              movies: data.movies.slice(0, 8),
            },
            timestamp: Date.now(),
          })
        )
      );
    } catch (err) {
      console.error("Lỗi load vietsub:", err);
    }
  };

  const getMovies = async () => {
    // check cache
    const cache = localStorage.getItem(CACHE_KEY_HOME);
    if (cache) {
      const parsed = JSON.parse(LZString.decompress(cache));
      if (Date.now() - parsed.timestamp < CACHE_TTL) {
        setDataFromHome(parsed.data);
        setLoading(false);
        return;
      }
    }
    setLoading(true);
    electron.ipcRenderer.send("get-devil-home");
    electron.ipcRenderer.on(
      "home-data",
      (data: {
        home: HomeResult;
        censored: HomeResult;
        uncensored: HomeResult;
        uncensoredLeaked: HomeResult;
        chinese: HomeResult;
      }) => {
        setDataFromHome(data);
        localStorage.setItem(
          CACHE_KEY_HOME,
          LZString.compress(JSON.stringify({ data, timestamp: Date.now() }))
        );
        setTimeout(() => setLoading(false), 500);
      }
    );
  };

  const setDataFromHome = (data: {
    home: HomeResult;
    censored: HomeResult;
    uncensored: HomeResult;
    uncensoredLeaked: HomeResult;
    chinese: HomeResult;
  }) => {
    setHome({
      ...data.home,
      list: uniqueByCode(data.home.list).slice(0, 8),
    });
    setCencored({
      ...data.censored,
      list: uniqueByCode(data.censored.list).slice(0, 8),
    });
    setUncencored({
      ...data.uncensored,
      list: uniqueByCode(data.uncensored.list).slice(0, 8),
    });
    setUncencoredLeaked({
      ...data.uncensoredLeaked,
      list: uniqueByCode(data.uncensoredLeaked.list).slice(0, 8),
    });
    setChinese({
      ...data.chinese,
      list: uniqueByCode(data.chinese.list).slice(0, 8),
    });
  };

  const uniqueByCode = (arr: any[]) =>
    Array.from(new Map(arr.map((item) => [item.movie_code, item])).values());

  useEffect(() => {
    getMovies();
    getAll();
    generateDaily();
    generateMaybeLike();
    window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  if (loading)
    return (
      <div className="flex w-full justify-center items-center min-h-screen">
        <div className="text-center">
          <Loading />
          <p className="mt-4 text-base-content/70">Đang tải nội dung...</p>
        </div>
      </div>
    );

  return (
    <motion.div
      className="flex w-full flex-col min-h-screen pb-10 pr-4 mt-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.75 }}
    >
      {/* Welcome Banner with Gradient */}
      <RestoreModal />
      <motion.div
        className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl p-6 mb-6 border border-primary/10"
        variants={sectionVariants}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-base-content mb-2">
              Chào mừng {userName} trở lại! 🎬
            </h1>
            <p className="text-base-content/70 text-lg">
              Khám phá thế giới điện ảnh với những bộ phim mới nhất
            </p>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <div className="hidden md:block">
              <Sparkles className="w-16 h-16 text-primarys animate-pulse" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Daily Card with enhanced styling */}
      <motion.div className="mb-8" variants={sectionVariants}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
            <Star className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-base-content">
            Đề xuất hôm nay
          </h2>
        </div>
        <DailyCard />
      </motion.div>
      {/* maybe like */}
      <MaybeYouLike />

      <div>
        <motion.div className="mb-12" variants={sectionVariants}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Film className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-base-content">
                  Cập nhật mới
                </h3>
                <p className="text-base-content/60">
                  Những bộ phim mới nhất được cập nhật
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-primary">
              <Link
                to={"/vietsub"}
                className="btn btn-primary btn-outline btn-sm gap-2 mb-6 group hover:scale-105 transition-transform"
              >
                <PlayCircle className="w-4 h-4 group-hover:animate-pulse" />
                Xem tất cả
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap flex-row gap-4 mt-2">
            {all?.movies?.map((item) => (
              <MediaListVietSub m={item as any} key={item.slug} />
            ))}
          </div>
        </motion.div>

        {/* Enhanced Censored Section */}
        <motion.div className="mb-12" variants={sectionVariants}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-base-content">
                  Nội dung an toàn
                </h3>
                <p className="text-base-content/60">Phim đã được kiểm duyệt</p>
              </div>
            </div>
            <Link
              to={"/category/0/Censored/null"}
              className="btn btn-success btn-outline gap-2 mb-6 btn-sm group hover:scale-105 transition-transform"
            >
              <PlayCircle className="w-4 h-4 group-hover:animate-pulse" />
              Xem thêm
            </Link>
          </div>

          <div className="flex flex-wrap flex-row gap-4 mt-2">
            {cencored?.list?.map((m) => (
              <MediaList key={m.slug} m={m} />
            ))}
          </div>
        </motion.div>

        {/* Enhanced Uncensored Section */}
        <motion.div className="mb-12" variants={sectionVariants}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg">
                <EyeOff className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-base-content">
                  Nội dung không kiểm duyệt
                </h3>
                <p className="text-base-content/60">
                  Dành cho khán giả trưởng thành
                </p>
              </div>
            </div>
            <Link
              to={"/category/1/Uncensored/null"}
              className="btn btn-error btn-outline gap-2 btn-sm mb-6 group hover:scale-105 transition-transform"
            >
              <PlayCircle className="w-4 h-4 group-hover:animate-pulse" />
              Xem thêm
            </Link>
          </div>

          <div className="flex flex-wrap flex-row gap-4 mt-2">
            {uncencored?.list?.map((m) => (
              <MediaList key={m.slug} m={m} />
            ))}
          </div>
        </motion.div>

        {/* Enhanced Uncensored Leaked Section */}
        <motion.div className="mb-12" variants={sectionVariants}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-base-content">
                  Nội dung rò rỉ
                </h3>
                <p className="text-base-content/60">Những bộ phim độc quyền</p>
              </div>
            </div>
            <Link
              to={"/category/2/Uncensored Leaked/null"}
              className="btn btn-warning btn-outline btn-sm gap-2 mb-6 group hover:scale-105 transition-transform"
            >
              <PlayCircle className="w-4 h-4 group-hover:animate-pulse" />
              Xem thêm
            </Link>
          </div>

          <div className="flex flex-wrap flex-row gap-4 mt-2">
            {uncencoredLeaked?.list?.map((m) => (
              <MediaList key={m.slug} m={m} />
            ))}
          </div>
        </motion.div>

        {/* Enhanced Chinese Section */}
        <motion.div className="mb-12" variants={sectionVariants}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                <Clapperboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-base-content">
                  Phim Trung Quốc
                </h3>
                <p className="text-base-content/60">
                  Tinh hoa điện ảnh phương Đông
                </p>
              </div>
            </div>
            <Link
              to={"/category/3/Chinese/null"}
              className="btn btn-info btn-sm btn-outline gap-2 mb-6 group hover:scale-105 transition-transform"
            >
              <PlayCircle className="w-4 h-4 group-hover:animate-pulse" />
              Xem thêm
            </Link>
          </div>

          <div className="flex flex-wrap flex-row gap-4 mt-2">
            {chinese?.list?.map((m) => (
              <MediaList key={m.slug} m={m} />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer CTA */}
    </motion.div>
  );
};

export default HomePage;
