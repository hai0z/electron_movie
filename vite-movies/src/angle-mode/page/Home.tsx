import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BiError } from "react-icons/bi";
import { HomeResult } from "../types";
import m, { Category } from "../service/MovieService";
import HomeSwiper from "../components/HomeSwiper";
import MediaList from "../components/MediaList";
import Loading from "../../common/Loading";
const Home = () => {
  const [home, setHome] = useState({} as HomeResult);
  const [phimLe, setPhimLe] = useState({} as HomeResult);
  const [phimBo, setPhimBo] = useState({} as HomeResult);
  const [phimHoatHinh, setPhimHoatHinh] = useState({} as HomeResult);
  const [nowPlay, setNowPlay] = useState({} as HomeResult);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);

  const [error, setError] = useState(false);

  const getMovies = async () => {
    setLoading(true);
    try {
      const [homeRes, phimLeRes, phimHoatHinhRes, phimBoRes, nowPlayRes] =
        await Promise.all([
          m.getAll(),
          m.getByCategory(Category.phim_le, 1),
          m.getByCategory(Category.hoat_hinh, 1),
          m.getByCategory(Category.phim_bo, 1),
          m.getByCategory(Category.phim_dang_chieu, 1),
        ]).finally(() => {
          setLoading(false);
          setError(false);
        });

      setHome(homeRes as HomeResult);
      setPhimLe(phimLeRes as HomeResult);
      setPhimBo(phimBoRes as HomeResult);
      setPhimHoatHinh(phimHoatHinhRes as HomeResult);
      setNowPlay(nowPlayRes as HomeResult);
    } catch (error) {
      setModalOpen(true);
      setError(true);
    }
  };
  useEffect(() => {
    getMovies();
  }, []);

  if (loading) return <Loading />;

  return (
    <motion.div className="flex w-full flex-col min-h-screen pt-16 pb-10">
      {error ? (
        <div className="text-center flex justify-center items-center h-screen">
          <div className="flex flex-col justify-center items-center">
            <BiError className="w-24 h-24" color="primarys" />
            <p className="text-primarys text-center">
              Không thể tải được dữ liệu
            </p>
          </div>
        </div>
      ) : (
        <div>
          <div className="mt-1">
            <HomeSwiper data={home?.items} />
          </div>

          <div className="px-6">
            <div className="pt-4">
              <p className="text-4xl font-semibold text-base-content">
                Phim Đang chiếu
              </p>
              <Link
                to={"/category/6/" + null + "/" + "Phim đang chiếu"}
                className="btn btn-secondary w-fit btn-sm my-3"
              >
                Xem thêm
              </Link>

              <div className="flex flex-wrap flex-row gap-4 mt-2">
                {nowPlay?.items?.map((m) => (
                  <MediaList key={m.slug} m={m} />
                ))}
              </div>
            </div>
            <div className="pt-4">
              <p className="text-4xl font-semibold text-base-content">
                Phim lẻ
              </p>
              <Link
                to={"/category/0/" + null + "/" + "Phim lẻ"}
                className="btn btn-secondary w-fit btn-sm my-3"
              >
                Xem thêm
              </Link>

              <div className="flex flex-wrap flex-row gap-4 mt-2">
                {phimLe?.items?.map((m) => (
                  <MediaList key={m.slug} m={m} />
                ))}
              </div>
            </div>
            <div className="pt-4">
              <p className="text-4xl font-semibold text-base-content">
                Phim bộ
              </p>
              <Link
                to={"/category/1/" + null + "/" + "Phim lẻ"}
                className="btn btn-secondary w-fit btn-sm my-3"
              >
                Xem thêm
              </Link>
              <div className="flex flex-wrap flex-row gap-4 mt-2">
                {phimBo?.items?.map((m) => (
                  <MediaList key={m.slug} m={m} />
                ))}
              </div>
            </div>
            <div className="pt-4">
              <p className="text-4xl font-semibold  text-base-content">
                Phim hoạt hình
              </p>
              <Link
                to={"/category/2/" + null + "/" + "Phim lẻ"}
                className="btn btn-secondary w-fit btn-sm my-3"
              >
                Xem thêm
              </Link>
              <div className="flex flex-wrap flex-row gap-4 mt-2">
                {phimHoatHinh?.items?.map((m) => (
                  <MediaList key={m.slug} m={m} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <dialog
        id="my_modal_1"
        className={modalOpen ? "modal modal-open" : "modal"}
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Lỗi!</h3>
          <p className="py-4">
            Server quá tải vui lòng thử lại sau vài phút hoặc thử tải lại trang
          </p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-x-4">
              <button
                className="btn btn-primary"
                onClick={() => {
                  getMovies();
                  setModalOpen(false);
                }}
              >
                Tải lại
              </button>
              <button className="btn" onClick={() => setModalOpen(false)}>
                Đóng
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </motion.div>
  );
};

export default Home;
