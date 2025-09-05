import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Crown,
  Film,
  Heart,
  Settings,
  Video,
  User,
  Clock,
  CameraOff,
  Camera,
  Dices,
  Flame,
  Notebook,
  BookOpenText,
  FileVideoCamera,
  TvMinimalPlay,
  Search,
} from "lucide-react"; // icon đẹp
import SearchInput from "./SearchInput";
import RandomModal from "./RandomModal";
import { Movie } from "../types/vietsub";
import { useState } from "react";

const SidebarNavbar = () => {
  const pathName = useLocation().pathname;

  const isActive = (path: string) =>
    pathName === path || pathName.includes(path);

  const [data, setData] = useState<Movie>();
  const [loading, setLoading] = useState(true);

  const getRandomVideo = async () => {
    setLoading(true);
    const res = await fetch(
      `https://xxvnapi.com/api/chuyen-muc/jav-hd?page=${Math.floor(
        Math.random() * 48 + 1
      )}`
    );
    const data = await res.json();
    setData(data.movies[Math.floor(Math.random() * 49)]);
    setLoading(false);
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen w-64  border-r border-base-200 z-50 flex flex-col`}
    >
      {/* Logo */}
      <div className="px-6 border-b border-base-200 pt-10 py-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-primarys"
        >
          <Film className="w-6 h-6" />
          <span className="uppercase text-gradient">Movies Hub</span>
        </Link>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto px-4 py-3">
        <ul className="menu flex flex-col gap-2 menu-sm 2xl:menu-md">
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
              <Camera className="w-5 h-5 text-purple-500" />
              Có che
            </Link>
          </li>
          <li>
            <Link
              to="/category/1/Uncencored/null"
              className={isActive("/category/1/") ? "active font-bold" : ""}
            >
              <CameraOff className="w-5 h-5 text-green-500" />
              Không che
            </Link>
          </li>
          <li>
            <Link
              to="/category/2/Uncensored Leaked/null"
              className={isActive("/category/2/") ? "active font-bold" : ""}
            >
              <Video className="w-5 h-5 text-cyan-500" />
              Bị rò rỉ
            </Link>
          </li>
          <li>
            <Link
              to="/category/3/Chinese AV/null"
              className={isActive("/category/3/") ? "active font-bold" : ""}
            >
              <Film className="w-5 h-5 text-blue-500" />
              Trung Quốc
            </Link>
          </li>

          <li>
            <Link
              to="/category/7/Amateur/null"
              className={isActive("/category/7/") ? "active font-bold" : ""}
            >
              <User className="w-5 h-5 text-orange-500" />
              Nghiệp dư
            </Link>
          </li>

          <li>
            <Link
              to="rell"
              className={isActive("/rell") ? "active font-bold" : ""}
            >
              <Flame className="w-5 h-5 text-red-500" />
              Video Ngắn
            </Link>
          </li>
          <li>
            <Link
              to="/old"
              className={isActive("/old") ? "active font-bold" : ""}
            >
              <FileVideoCamera className="w-5 h-5 text-amber-500" />
              Video cổ
            </Link>
          </li>
          <li
            onClick={() => {
              (document.getElementById("video_modal_2") as any)?.showModal();
              getRandomVideo();
            }}
          >
            <div>
              <Dices className="w-5 h-5 text-pink-500" />
              Video ngẫu nhiên
            </div>
          </li>

          <li>
            <Link
              to="stories"
              className={isActive("/stories") ? "active font-bold" : ""}
            >
              <Notebook className="w-5 h-5 text-teal-500" />
              Truyện chữ
            </Link>
          </li>
          <li>
            <Link
              to="comic"
              className={isActive("/comic") ? "active font-bold" : ""}
            >
              <BookOpenText className="w-5 h-5 text-indigo-500" />
              Truyện tranh
            </Link>
          </li>

          <li>
            <Link
              to="/search-offline"
              className={isActive("/search-offline") ? "active font-bold" : ""}
            >
              <Search className="w-5 h-5 text-emerald-600" />
              Tìm kiếm vip
            </Link>
          </li>
        </ul>
      </nav>

      {/* Bottom actions */}
      <div className="px-6 py-2 border-t border-base-200 flex flex-col gap-4">
        <Link
          to="/favourite"
          className={`flex items-center gap-2 ${
            isActive("/favourite") ? "text-danger" : ""
          }`}
        >
          <Heart
            className="w-5 h-5"
            fill={isActive("/favourite") ? "red" : "none"}
          />
          <span className="text-sm">Yêu thích</span>
        </Link>
        <Link
          to="/history"
          className={`flex items-center gap-2 ${
            isActive("/history") ? "text-primarys" : ""
          }`}
        >
          <Clock className="w-5 h-5" />
          <span className="text-sm">Lịch sử</span>
        </Link>

        <Link
          to="/setting"
          className={`flex items-center gap-2 ${
            isActive("/setting") ? "text-accent " : ""
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-sm">Cài đặt</span>
        </Link>

        <SearchInput />
      </div>

      <RandomModal
        data={data!}
        onClose={() => setData(undefined)}
        loading={loading}
      />
    </div>
  );
};

export default SidebarNavbar;
