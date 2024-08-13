import { useEffect, useState } from "react";
import m, { Category } from "./service/MovieService";
import { HomeResult } from "./types";
import { MovieCard1 } from "./components/MovieCard";
import { Link } from "react-router-dom";
import HomeSwiper from "./components/HomeSwiper";
const App = () => {
  const [home, setHome] = useState({} as HomeResult);
  const [phimLe, setPhimLe] = useState({} as HomeResult);
  const [phimBo, setPhimBo] = useState({} as HomeResult);
  const [phimHoatHinh, setPhimHoatHinh] = useState({} as HomeResult);
  const [loading, setLoading] = useState(true);

  const getMovies = async () => {
    setLoading(true);
    const [homeRes, phimLeRes, phimHoatHinhRes, phimBoRes] = await Promise.all([
      m.getAll(),
      m.getByCategory(Category.phim_le, 1),
      m.getByCategory(Category.hoat_hinh, 1),
      m.getByCategory(Category.phim_bo, 1),
    ]).finally(() => setLoading(false));

    setHome(homeRes);
    setPhimLe(phimLeRes);
    setPhimBo(phimBoRes);
    setPhimHoatHinh(phimHoatHinhRes);
  };
  useEffect(() => {
    getMovies();
  }, []);
  if (loading)
    return (
      <div className="text-center flex justify-center items-center h-screen">
        <span className="loading loading-spinner text-accent loading-lg"></span>
      </div>
    );
  return (
    <div className="flex w-full flex-col min-h-screen pt-16">
      <div>
        <div>
          <HomeSwiper data={home?.items} />
        </div>
        <div className="px-6">
          <div className="pt-4">
            <p className="text-4xl font-semibold text-base-content">Phim lẻ</p>
            <Link
              to={"/movie/popular"}
              className="btn btn-secondary w-fit btn-sm rounded-full my-3"
            >
              Xem thêm
            </Link>

            <div className="flex flex-wrap flex-row gap-4 mt-2">
              {phimLe?.items?.map((m) => (
                <MovieCard1 key={m.slug} m={m} />
              ))}
            </div>
          </div>
          <div className="pt-4">
            <p className="text-4xl font-semibold text-base-content">Phim bộ</p>
            <Link
              to={"/movie/popular"}
              className="btn btn-secondary w-fit btn-sm rounded-full my-3"
            >
              Xem thêm
            </Link>
            <div className="flex flex-wrap flex-row gap-4 mt-2">
              {phimBo?.items?.map((m) => (
                <MovieCard1 key={m.slug} m={m} />
              ))}
            </div>
          </div>
          <div className="pt-4">
            <p className="text-4xl font-semibold  text-base-content">
              Phim hoạt hình
            </p>
            <Link
              to={"/movie/popular"}
              className="btn btn-secondary w-fit btn-sm rounded-full my-3"
            >
              Xem thêm
            </Link>
            <div className="flex flex-wrap flex-row gap-4 mt-2">
              {phimHoatHinh?.items?.map((m) => (
                <MovieCard1 key={m.slug} m={m} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
