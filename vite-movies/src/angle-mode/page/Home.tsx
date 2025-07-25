import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BiError } from "react-icons/bi";
import m, { Category } from "../service/MovieService";
import HomeSwiper from "../components/HomeSwiper";
import MediaList from "../components/MediaList";
import Loading from "../../common/Loading";
import { useQuery } from "@tanstack/react-query";

const Home = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [error] = useState(false);

  const { data: home, isLoading: loading } = useQuery({
    queryKey: ["home"],
    queryFn: () => m.getAll(),
  });
  const { data: phimLe } = useQuery({
    queryKey: ["phimLe"],
    queryFn: () => m.getByCategory(Category.phim_le, 1),
  });
  const { data: phimBo } = useQuery({
    queryKey: ["phimBo"],
    queryFn: () => m.getByCategory(Category.phim_bo, 1),
  });
  const { data: phimHoatHinh } = useQuery({
    queryKey: ["phimHoatHinh"],
    queryFn: () => m.getByCategory(Category.hoat_hinh, 1),
  });
  const { data: nowPlay } = useQuery({
    queryKey: ["nowPlay"],
    queryFn: () => m.getByCategory(Category.phim_dang_chieu, 1),
  });

  if (loading) return <Loading />;

  return (
    <motion.div className="flex  flex-col min-h-screen pt-16 pb-10 bg-base-100">
      {error ? (
        <div className="hero min-h-screen">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <BiError className="w-24 h-24 mx-auto text-error" />
              <h1 className="text-2xl font-bold text-error mt-4">Lỗi!</h1>
              <p className="py-6">Không thể tải được dữ liệu</p>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div>
            <HomeSwiper data={home?.items!} />
          </div>

          <div className="px-4 lg:px-6">
            <div className="pt-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-4xl font-bold text-base-content">
                  Phim Đang chiếu
                </h2>
                <Link
                  to={"/category/6/" + null + "/" + "Phim đang chiếu"}
                  className="btn btn-primary btn-sm"
                >
                  Xem thêm
                </Link>
              </div>
              <div className="flex flex-row flex-wrap gap-4">
                {nowPlay?.items?.map((m) => (
                  <MediaList key={m.slug} m={m} />
                ))}
              </div>
            </div>

            <div className="divider my-8"></div>

            <div className="pt-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-4xl font-bold text-base-content">
                  Phim lẻ
                </h2>
                <Link
                  to={"/category/0/" + null + "/" + "Phim lẻ"}
                  className="btn btn-primary btn-sm"
                >
                  Xem thêm
                </Link>
              </div>
              <div className="flex flex-row flex-wrap gap-4">
                {phimLe?.items?.map((m) => (
                  <MediaList key={m.slug} m={m} />
                ))}
              </div>
            </div>

            <div className="divider my-8"></div>

            <div className="pt-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-4xl font-bold text-base-content">
                  Phim bộ
                </h2>
                <Link
                  to={"/category/1/" + null + "/" + "Phim bộ"}
                  className="btn btn-primary btn-sm"
                >
                  Xem thêm
                </Link>
              </div>
              <div className="flex flex-row flex-wrap gap-4">
                {phimBo?.items?.map((m) => (
                  <MediaList key={m.slug} m={m} />
                ))}
              </div>
            </div>

            <div className="divider my-8"></div>

            <div className="pt-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-4xl font-bold text-base-content">
                  Phim hoạt hình
                </h2>
                <Link
                  to={"/category/2/" + null + "/" + "Phim hoạt hình"}
                  className="btn btn-primary btn-sm"
                >
                  Xem thêm
                </Link>
              </div>
              <div className="flex flex-row flex-wrap gap-4">
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
        className={`modal ${modalOpen ? "modal-open" : ""}`}
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
                  window.location.reload();
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
