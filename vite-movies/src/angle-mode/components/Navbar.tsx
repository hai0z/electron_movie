import { Link, useLocation, useNavigate } from "react-router-dom";
import SearchInput from "./SearchInput";
import { countries, movieGenres } from "../service/MovieService";
import { FaChevronLeft, FaChevronRight, FaRegHeart } from "react-icons/fa";
// import { TbLayoutGrid, TbLayoutList } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { useAppStore } from "../../zustand/appState";
const Navbar = () => {
  const pathName = useLocation().pathname;
  const navigate = useNavigate();
  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      return;
    }
  };
  const { lightOff } = useAppStore();

  const goForward = () => {
    navigate(1);
  };
  return (
    <div
      className={`navbar bg-base-100 shadow-none backdrop-blur-md fixed z-50 bg-opacity-90 ${
        lightOff && "opacity-0 hidden"
      }`}
    >
      <div className="flex">
        <Link
          to={"/"}
          className="btn btn-ghost text-2xl text-primarys uppercase"
        >
          <span className="text-gradient">Movies Hub</span>
        </Link>
        <div className="flex gap-2 items-center ml-1">
          <div
            className={`btn btn-primary btn-xs btn-circle ${
              window.history.length == 1 && "btn-disabled"
            }`}
            onClick={goBack}
          >
            <FaChevronLeft />
          </div>
          <div
            className={`btn btn-primary btn-xs btn-circle ${
              window.history.length == 1 && "btn-disabled"
            }`}
            onClick={goForward}
          >
            <FaChevronRight />
          </div>
        </div>
      </div>
      <div className="navbar-center hidden lg:flex flex-1  justify-center">
        <ul className="menu menu-horizontal px-1 gap-1">
          <li>
            <Link to={"/"} className={pathName === "/" ? "active" : ""}>
              Trang chủ
            </Link>
          </li>
          <li>
            <Link
              to={"/category/6/" + null + "/" + "Phim đang chiếu"}
              className={pathName.includes("/category/6/") ? "active" : ""}
            >
              Đang chiếu
            </Link>
          </li>
          <li>
            <Link
              to={"/category/0/" + null + "/" + "Phim lẻ"}
              className={pathName.includes("/category/0/") ? "active" : ""}
            >
              Phim lẻ
            </Link>
          </li>
          <li>
            <Link
              to={"/category/1/" + null + "/" + "Phim bộ"}
              className={pathName.includes("/category/1/") ? "active" : ""}
            >
              Phim bộ
            </Link>
          </li>
          <li>
            <Link
              to={"/category/2/" + null + "/" + "Phim hoạt hình"}
              className={pathName.includes("/category/2/") ? "active" : ""}
            >
              Phim hoạt hình
            </Link>
          </li>
          <li>
            <div className="dropdown dropdown-hover dropdown-bottom">
              <summary>Thể loại</summary>
              <div
                tabIndex={0}
                className="dropdown-content bg-base-100 rounded-box z-[1] w-80 p-2 shadow "
              >
                <div>
                  {movieGenres.map((m, i) => {
                    return (
                      <Link
                        to={"/category/3/" + m.id + "/" + m.name}
                        key={i}
                        className="btn btn-ghost"
                      >
                        {m.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </li>
          <li>
            <div className="dropdown dropdown-hover dropdown-bottom">
              <summary tabIndex={0} role="button">
                Quốc gia
              </summary>
              <div
                tabIndex={0}
                className="dropdown-content bg-base-100 rounded-box z-[1] w-80 p-2 shadow"
              >
                <div>
                  {countries.map((m, i) => {
                    return (
                      <Link
                        to={"/category/4/" + m.id + "/" + m.name}
                        key={i}
                        className="btn btn-ghost"
                      >
                        {m.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div className="flex-none gap-4 mr-4">
        <Link to={"/favourite"} className="cursor-pointer">
          <FaRegHeart
            className="w-6 h-6"
            color={pathName === "/favourite" ? "red" : ""}
          />
        </Link>
        <Link to="/setting">
          <IoSettingsOutline className="cursor-pointer w-6 h-6" />
        </Link>
        <SearchInput />
      </div>
    </div>
  );
};

export default Navbar;
