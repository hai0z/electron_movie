import { Link, useLocation, useNavigate } from "react-router-dom";
import SearchInput from "./SearchInput";
import { countries, movieGenres } from "../service/MovieService";
import { FaChevronLeft, FaChevronRight, FaRegHeart } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { useAppStore } from "../../zustand/appState";

const Navbar = () => {
  const pathName = useLocation().pathname;
  const navigate = useNavigate();
  const { lightOff } = useAppStore();

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    }
  };

  const goForward = () => {
    navigate(1);
  };

  return (
    <div
      className={`navbar fixed z-50 bg-base-100 bg-opacity-90 backdrop-blur-md  transition-all duration-300 ${
        lightOff ? "opacity-0 hidden" : "opacity-100"
      }`}
    >
      {/* Logo and Navigation Controls */}
      <div className="flex items-center">
        <Link
          to="/"
          className="btn btn-ghost text-2xl font-bold tracking-wider hover:scale-105 transition-transform"
        >
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Movies Hub
          </span>
        </Link>

        <div className="flex gap-3 items-center ml-2">
          <button
            className={`btn btn-primary btn-sm btn-circle hover:scale-110 transition-transform ${
              window.history.length <= 1 && "btn-disabled opacity-50"
            }`}
            onClick={goBack}
          >
            <FaChevronLeft className="w-4 h-4" />
          </button>
          <button
            className={`btn btn-primary btn-sm btn-circle hover:scale-110 transition-transform ${
              window.history.length <= 1 && "btn-disabled opacity-50"
            }`}
            onClick={goForward}
          >
            <FaChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Navigation Menu */}
      <div className="navbar-center hidden lg:flex flex-1 justify-center">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li>
            <Link
              to="/"
              className={`hover:text-primary transition-colors ${
                pathName === "/" ? "font-bold text-primary" : ""
              }`}
            >
              Trang chủ
            </Link>
          </li>
          <li>
            <Link
              to={"/category/6/null/Phim đang chiếu"}
              className={`hover:text-primary transition-colors ${
                pathName.includes("/category/6/")
                  ? "font-bold text-primary"
                  : ""
              }`}
            >
              Đang chiếu
            </Link>
          </li>
          <li>
            <Link
              to={"/category/0/null/Phim lẻ"}
              className={`hover:text-primary transition-colors ${
                pathName.includes("/category/0/")
                  ? "font-bold text-primary"
                  : ""
              }`}
            >
              Phim lẻ
            </Link>
          </li>
          <li>
            <Link
              to={"/category/1/null/Phim bộ"}
              className={`hover:text-primary transition-colors ${
                pathName.includes("/category/1/")
                  ? "font-bold text-primary"
                  : ""
              }`}
            >
              Phim bộ
            </Link>
          </li>
          <li>
            <Link
              to={"/category/2/null/Phim hoạt hình"}
              className={`hover:text-primary transition-colors ${
                pathName.includes("/category/2/")
                  ? "font-bold text-primary"
                  : ""
              }`}
            >
              Phim hoạt hình
            </Link>
          </li>

          {/* Genres Dropdown */}
          <li>
            <div className="dropdown dropdown-hover dropdown-bottom">
              <summary className="hover:text-primary transition-colors">
                Thể loại
              </summary>
              <div className="dropdown-content bg-base-100 rounded-xl z-[1] w-80 p-3 shadow-lg grid grid-cols-2 gap-2">
                {movieGenres.map((genre, i) => (
                  <Link
                    to={`/category/3/${genre.id}/${genre.name}`}
                    key={i}
                    className="btn btn-ghost btn-sm hover:bg-primary/10 transition-colors"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
            </div>
          </li>

          {/* Countries Dropdown */}
          <li>
            <div className="dropdown dropdown-hover dropdown-bottom">
              <summary className="hover:text-primary transition-colors">
                Quốc gia
              </summary>
              <div className="dropdown-content bg-base-100 rounded-xl z-[1] w-80 p-3 shadow-lg grid grid-cols-2 gap-2">
                {countries.map((country, i) => (
                  <Link
                    to={`/category/4/${country.id}/${country.name}`}
                    key={i}
                    className="btn btn-ghost btn-sm hover:bg-primary/10 transition-colors"
                  >
                    {country.name}
                  </Link>
                ))}
              </div>
            </div>
          </li>
        </ul>
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center gap-6 mr-4">
        <Link to="/favourite" className="hover:scale-110 transition-transform">
          <FaRegHeart
            className="w-6 h-6"
            color={pathName === "/favourite" ? "#ff4081" : "currentColor"}
          />
        </Link>
        <Link to="/setting" className="hover:scale-110 transition-transform">
          <IoSettingsOutline className="w-6 h-6" />
        </Link>
        <SearchInput />
      </div>
    </div>
  );
};

export default Navbar;
