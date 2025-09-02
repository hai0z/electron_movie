import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MediaList, MediaListVietSub } from "../components/MediaList";
import { HomeResult } from "../types";
import Loading from "../../common/Loading";
import React from "react";
import { VietSubResult } from "../types/vietsub";
import { Film, ShieldCheck, EyeOff, Eye, Clapperboard } from "lucide-react"; // icon

const HomePage = () => {
  const [_, setHome] = useState({} as HomeResult);
  const [cencored, setCencored] = useState({} as HomeResult);
  const [uncencored, setUncencored] = useState({} as HomeResult);
  const [uncencoredLeaked, setUncencoredLeaked] = useState({} as HomeResult);
  const [chinese, setChinese] = useState({} as HomeResult);
  const [loading, setLoading] = useState(true);
  const [all, setAll] = React.useState({} as VietSubResult);

  const getAll = async () => {
    setLoading(true);
    const res = await fetch("https://xxvnapi.com/api/phim-moi-cap-nhat?page=1");
    const data = await res.json();
    setAll(data);
    setLoading(false);
  };

  const electron = (window as any).electron;

  const getMovies = async () => {
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
        setHome({
          ...data.home,
          list: Array.from(
            new Map(
              data.home.list.map((item) => [item.movie_code, item])
            ).values()
          ).slice(0, 8),
        });
        setCencored({
          ...data.censored,
          list: Array.from(
            new Map(
              data.censored.list.map((item) => [item.movie_code, item])
            ).values()
          ).slice(0, 8),
        });
        setUncencored({
          ...data.uncensored,
          list: Array.from(
            new Map(
              data.uncensored.list.map((item) => [item.movie_code, item])
            ).values()
          ).slice(0, 8),
        });
        setUncencoredLeaked({
          ...data.uncensoredLeaked,
          list: Array.from(
            new Map(
              data.uncensoredLeaked.list.map((item) => [item.movie_code, item])
            ).values()
          ).slice(0, 8),
        });
        setChinese({
          ...data.chinese,
          list: Array.from(
            new Map(
              data.chinese.list.map((item) => [item.movie_code, item])
            ).values()
          ).slice(0, 8),
        });
      }
    );
  };

  useEffect(() => {
    getMovies();
    getAll();
  }, []);

  if (loading)
    return (
      <div className="flex w-full justify-center items-center">
        <Loading />
      </div>
    );

  return (
    <motion.div
      className="flex w-full flex-col min-h-screen pb-10 pr-4 mt-4 "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Banner */}
      <div className="relative w-full rounded-box h-64 bg-gradient-to-r from-primarys via-accent to-secondary flex items-center justify-center">
        <h1 className="text-white text-5xl font-bold drop-shadow-lg">
          🎬 Movie Hub
        </h1>
        <p className="absolute bottom-4 text-white/80">
          Enjoy the latest movies & updates
        </p>
      </div>

      <div>
        {/* New Update */}
        <div className="pt-6">
          <div className="flex items-center gap-2">
            <Film className="text-primary" />
            <p className="text-3xl font-semibold text-base-content">
              New Update
            </p>
          </div>
          <Link to={"/vietsub"} className="btn btn-secondary w-fit btn-sm my-3">
            Xem thêm
          </Link>
          <div className="flex flex-wrap flex-row gap-4 mt-2">
            {all?.movies?.slice(0, 8)?.map((item) => (
              <MediaListVietSub m={item as any} key={item.slug} />
            ))}
          </div>
        </div>

        {/* Censored */}
        <div className="pt-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-green-600" />
            <p className="text-3xl font-semibold text-base-content">Censored</p>
          </div>
          <Link
            to={"/category/0/Censored/null"}
            className="btn btn-secondary w-fit btn-sm my-3"
          >
            Xem thêm
          </Link>
          <div className="flex flex-wrap flex-row gap-4 mt-2">
            {cencored?.list?.map((m) => (
              <MediaList key={m.slug} m={m} />
            ))}
          </div>
        </div>

        {/* Uncensored */}
        <div className="pt-6">
          <div className="flex items-center gap-2">
            <EyeOff className="text-red-600" />
            <p className="text-3xl font-semibold text-base-content">
              Uncensored
            </p>
          </div>
          <Link
            to={"/category/1/Uncensored/null"}
            className="btn btn-secondary w-fit btn-sm my-3"
          >
            Xem thêm
          </Link>
          <div className="flex flex-wrap flex-row gap-4 mt-2">
            {uncencored?.list?.map((m) => (
              <MediaList key={m.slug} m={m} />
            ))}
          </div>
        </div>

        {/* Uncensored Leaked */}
        <div className="pt-6">
          <div className="flex items-center gap-2">
            <Eye className="text-yellow-500" />
            <p className="text-3xl font-semibold text-base-content">
              Uncensored Leaked
            </p>
          </div>
          <Link
            to={"/category/2/Uncensored Leaked/null"}
            className="btn btn-secondary w-fit btn-sm my-3"
          >
            Xem thêm
          </Link>
          <div className="flex flex-wrap flex-row gap-4 mt-2">
            {uncencoredLeaked?.list?.map((m) => (
              <MediaList key={m.slug} m={m} />
            ))}
          </div>
        </div>

        {/* Chinese */}
        <div className="pt-6">
          <div className="flex items-center gap-2">
            <Clapperboard className="text-indigo-500" />
            <p className="text-3xl font-semibold text-base-content">Chinese</p>
          </div>
          <Link
            to={"/category/3/Chinese/null"}
            className="btn btn-secondary w-fit btn-sm my-3"
          >
            Xem thêm
          </Link>
          <div className="flex flex-wrap flex-row gap-4 mt-2">
            {chinese?.list?.map((m) => (
              <MediaList key={m.slug} m={m} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HomePage;
