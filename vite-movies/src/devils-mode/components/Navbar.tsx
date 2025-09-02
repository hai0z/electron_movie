import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Crown,
  Film,
  Heart,
  Settings,
  Video,
  Star,
  User,
} from "lucide-react"; // icon đẹp
import SearchInput from "./SearchInput";

const SidebarNavbar = () => {
  const pathName = useLocation().pathname;

  const isActive = (path: string) =>
    pathName === path || pathName.includes(path);

  return (
    <div
      className={`fixed top-0 left-0 h-screen w-64  border-r border-base-200 z-50 flex flex-col`}
    >
      {/* Logo */}
      <div className="px-6 border-b border-base-200 py-10">
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-primary"
        >
          <Film className="w-6 h-6" />
          <span className="uppercase text-gradient">Movies Hub</span>
        </Link>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <ul className="menu flex flex-col gap-2">
          <li>
            <Link to="/" className={pathName === "/" ? "active font-bold" : ""}>
              <Home className="w-5 h-5 text-primarys" />
              Trang chủ
            </Link>
          </li>

          <li>
            <details>
              <summary className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                VIP
              </summary>
              <ul className="ml-6 mt-1 flex flex-col gap-1">
                <li>
                  <Link
                    to="/vietsub"
                    className={isActive("/vietsub") ? "active font-bold" : ""}
                  >
                    XXVN
                  </Link>
                </li>
                <li>
                  <Link
                    to="/vlxx"
                    className={isActive("/vlxx") ? "active font-bold" : ""}
                  >
                    VLXX
                  </Link>
                </li>
                <li>
                  <Link
                    to="/javhd"
                    className={isActive("/javhd") ? "active font-bold" : ""}
                  >
                    JAVHD
                  </Link>
                </li>
                <li>
                  <Link
                    to="/sextop1"
                    className={isActive("/sextop1") ? "active font-bold" : ""}
                  >
                    SEXTOP1
                  </Link>
                </li>
                <li>
                  <Link
                    to="/viet69"
                    className={isActive("/viet69") ? "active font-bold" : ""}
                  >
                    VIET69
                  </Link>
                </li>
              </ul>
            </details>
          </li>

          <li>
            <Link
              to="/category/0/Censored/null"
              className={isActive("/category/0/") ? "active font-bold" : ""}
            >
              <Star className="w-5 h-5 text-purple-500" />
              Censored
            </Link>
          </li>
          <li>
            <Link
              to="/category/1/Uncencored/null"
              className={isActive("/category/1/") ? "active font-bold" : ""}
            >
              <Video className="w-5 h-5 text-green-500" />
              Uncensored
            </Link>
          </li>
          <li>
            <Link
              to="/category/2/Uncensored Leaked/null"
              className={isActive("/category/2/") ? "active font-bold" : ""}
            >
              <Video className="w-5 h-5 text-red-500" />
              Leaked
            </Link>
          </li>
          <li>
            <Link
              to="/category/3/Chinese AV/null"
              className={isActive("/category/3/") ? "active font-bold" : ""}
            >
              <Film className="w-5 h-5 text-blue-500" />
              Chinese AV
            </Link>
          </li>

          <li>
            <Link
              to="/category/7/Amateur/null"
              className={isActive("/category/7/") ? "active font-bold" : ""}
            >
              <User className="w-5 h-5 text-orange-500" />
              Amateur
            </Link>
          </li>
        </ul>
      </nav>

      {/* Bottom actions */}
      <div className="px-6 py-4 border-t border-base-200 flex flex-col gap-4">
        <Link
          to="/favourite"
          className={`flex items-center gap-2 ${
            isActive("/favourite") ? "text-red-500" : ""
          }`}
        >
          <Heart
            className="w-6 h-6"
            fill={isActive("/favourite") ? "red" : "none"}
          />
          <span>Yêu thích</span>
        </Link>

        <Link
          to="/setting"
          className={`flex items-center gap-2 ${
            isActive("/setting") ? "text-primary font-bold" : ""
          }`}
        >
          <Settings className="w-6 h-6" />
          <span>Cài đặt</span>
        </Link>

        <SearchInput />
      </div>
    </div>
  );
};

export default SidebarNavbar;
