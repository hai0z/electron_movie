import { Link, useLocation } from "react-router-dom";
import SearchInput from "./SearchInput";
import { countries, movieGenres } from "../service/MovieService";

const Navbar = () => {
  const pathName = useLocation().pathname;

  return (
    <div className="navbar bg-base-100 shadow-md backdrop-blur-md fixed z-50 bg-opacity-90">
      <div className="flex">
        <Link
          to={"/"}
          className="btn btn-ghost text-2xl text-accent uppercase font-mono"
        >
          Movies Hub
        </Link>
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
      <div className="flex-none gap-4">
        <label className="swap swap-rotate">
          <input
            type="checkbox"
            className="theme-controller"
            value="halloween"
          />
          <svg
            className="swap-off h-8 w-8 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
          </svg>
          <svg
            className="swap-on h-8 w-8 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
          </svg>
        </label>
        <SearchInput />
      </div>
    </div>
  );
};

export default Navbar;
