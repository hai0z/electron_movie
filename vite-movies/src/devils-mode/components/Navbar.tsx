import { Link, useLocation, useNavigate } from "react-router-dom";
import SearchInput from "./SearchInput";
import { FaRegHeart } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { useAppStore } from "../../zustand/appState";
const Navbar = () => {
  const pathName = useLocation().pathname;
  const navigate = useNavigate();
  const lightOff = useAppStore((state) => state.lightOff);
  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      return;
    }
  };

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
          <div className="flex gap-2">
            <span className="text-gradient">Movies Hub</span>
          </div>
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
              to={"/vietsub"}
              className={pathName.includes("/vietsub") ? "active" : ""}
            >
              VIP
            </Link>
          </li>
          <li>
            <Link
              to={"/category/0/" + "Censored/" + null}
              className={pathName.includes("/category/0/") ? "active" : ""}
            >
              Censored
            </Link>
          </li>
          <li>
            <Link
              to={"/category/1/" + "Uncencored/" + null}
              className={pathName.includes("/category/1/") ? "active" : ""}
            >
              Uncencored
            </Link>
          </li>
          <li>
            <Link
              to={"/category/2/" + "Uncensored Leaked/" + null}
              className={pathName.includes("/category/2/") ? "active" : ""}
            >
              Uncensored Leaked
            </Link>
          </li>
          <li>
            <Link
              to={"/category/3/" + "Chinese AV/" + null}
              className={pathName.includes("/category/3/") ? "active" : ""}
            >
              Chinese AV
            </Link>
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
