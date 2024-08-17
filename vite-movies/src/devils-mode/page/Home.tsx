import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MediaList } from "../components/MediaList";
import { HomeResult } from "../types";
import HomeSwiper from "../components/HomeSwiper";
import Loading from "../../common/Loading";
const HomePage = () => {
  const [home, setHome] = useState({} as HomeResult);
  const [cencored, setCencored] = useState({} as HomeResult);
  const [uncencored, setUncencored] = useState({} as HomeResult);
  const [uncencoredLeaked, setUncencoredLeaked] = useState({} as HomeResult);
  const [chinese, setChinese] = useState({} as HomeResult);
  const [loading, setLoading] = useState(true);

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
        console.log(data);
        setHome({
          ...data.home,
          list: Array.from(
            new Map(
              data.home.list.map((item) => [item.movie_code, item])
            ).values()
          ).slice(0, 10),
        });
        setCencored({
          ...data.censored,
          list: Array.from(
            new Map(
              data.censored.list.map((item) => [item.movie_code, item])
            ).values()
          ).slice(0, 10),
        });
        setUncencored({
          ...data.uncensored,
          list: Array.from(
            new Map(
              data.uncensored.list.map((item) => [item.movie_code, item])
            ).values()
          ).slice(0, 10),
        });
        setUncencoredLeaked({
          ...data.uncensoredLeaked,
          list: Array.from(
            new Map(
              data.uncensoredLeaked.list.map((item) => [item.movie_code, item])
            ).values()
          ).slice(0, 10),
        });
        setChinese({
          ...data.chinese,
          list: Array.from(
            new Map(
              data.chinese.list.map((item) => [item.movie_code, item])
            ).values()
          ).slice(0, 10),
        });
        setLoading(false);
      }
    );
  };
  useEffect(() => {
    getMovies();
  }, []);

  if (loading) return <Loading />;
  return (
    <motion.div
      className="flex w-full flex-col min-h-screen pt-16 pb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2.5 }}
    >
      <div>
        <div className="mt-1">
          <HomeSwiper data={home?.list} />
        </div>

        <div className="px-6">
          <div className="pt-4">
            <p className="text-4xl font-semibold text-base-content">Censored</p>
            <Link
              to={"/category/0/" + "Censored" + "/" + null}
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
          <div className="pt-4">
            <p className="text-4xl font-semibold text-base-content">
              Uncensored
            </p>
            <Link
              to={"/category/1/" + "Uncensored" + "/" + null}
              className="btn btn-secondary w-fit btn-sm  my-3"
            >
              Xem thêm
            </Link>
            <div className="flex flex-wrap flex-row gap-4 mt-2">
              {uncencored?.list?.map((m) => (
                <MediaList key={m.slug} m={m} />
              ))}
            </div>
          </div>
          <div className="pt-4">
            <p className="text-4xl font-semibold  text-base-content">
              Uncensored Leaked
            </p>
            <Link
              to={"/category/2/" + "Uncensored Leaked" + "/" + null}
              className="btn btn-secondary w-fit btn-sm  my-3"
            >
              Xem thêm
            </Link>
            <div className="flex flex-wrap flex-row gap-4 mt-2">
              {uncencoredLeaked?.list?.map((m) => (
                <MediaList key={m.slug} m={m} />
              ))}
            </div>
          </div>
          <div className="pt-4">
            <p className="text-4xl font-semibold  text-base-content">Chinese</p>
            <Link
              to={"/category/3/" + "Chinese/" + null}
              className="btn btn-secondary w-fit btn-sm  my-3"
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
      </div>
    </motion.div>
  );
};

export default HomePage;
