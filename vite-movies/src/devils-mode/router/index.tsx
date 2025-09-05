import { BiWindowClose, BiWindows } from "react-icons/bi";
import { createHashRouter, Outlet } from "react-router-dom";
import { useAppStore } from "../../zustand/appState";
import { useEffect } from "react";
import { FaRegWindowMinimize } from "react-icons/fa6";
import MovieDetail from "../page/MovieDetail";
import Search from "../page/Search";
import FavouriteScreen from "../page/Favorite";
import Category from "../page/Category";
import Navbar from "../components/Navbar";
import HomePage from "../page/Home";
import VietSub from "../page/VietSub";
import VietSubDetails from "../page/VietsubDetail";
import Setting from "../../common/Setting";
import Error from "../../common/Error";
import Vlxx from "../page/Vlxx";
import Javhd from "../page/Javhd";
import Sextop1 from "../page/Sextop1";
import ScrollToTopButton from "../../common/FloatingButton";
import Viet69 from "../page/Viet69";
import Rell from "../page/Rell";
import Stories from "../page/Stories";
import StoriesDetail from "../page/StoriesDetail";
import AllHistory from "../page/AllHistory";
import Comic from "../page/Comic";
import ComicDetailPage from "../page/ComicDetail";
import AIButton from "../../common/AIButton";
import OldScreen from "../page/Old";
import OldMovieDetail from "../page/OldMovieDetail";
import EpornScreen from "../page/OfflineSearch";

const MainLayout = () => {
  const theme = useAppStore((state) => state.theme);
  const lightOff = useAppStore((state) => state.lightOff);
  useEffect(() => {
    document.getElementsByTagName("html")[0].setAttribute("data-theme", theme);
  }, []);

  const electron = (window as any).electron;
  const minimize = () => {
    electron.ipcRenderer.send("minimize");
  };

  const close = () => {
    electron.ipcRenderer.send("close");
  };

  const maximize = () => {
    electron.ipcRenderer.send("maximize");
  };

  return (
    <div className="w-full h-full">
      <div
        className="w-full flex flex-row items-center justify-end backdrop-blur-md"
        style={{
          zIndex: "9999",
          position: "sticky",
          top: 0,
          height: 40,
          backgroundColor: lightOff ? "#000" : "oklch(var(--b1))",
        }}
      >
        <div className="drag px-4 flex flex-row items-center justify-start backdrop:blur-md w-full flex-1 h-full "></div>
        <div
          className="cursor-pointer h-10 w-10 justify-center items-center flex  hover:bg-primary/10 "
          onClick={minimize}
        >
          <FaRegWindowMinimize
            className={` cursor-pointer ${lightOff && "text-white"} mb-3`}
          />
        </div>
        <div
          onClick={maximize}
          className="cursor-pointer h-10 w-10  justify-center items-center flex hover:bg-primary/10"
        >
          <BiWindows
            className={`cursor-pointer mt-3 ${lightOff && "text-white"} mb-3`}
          />
        </div>
        <div
          onClick={close}
          className="cursor-pointer h-10 w-10  justify-center items-center flex hover:bg-primary/10"
        >
          <BiWindowClose
            className={`cursor-pointer mt-3 ${lightOff && "text-white"} mb-3`}
          />
        </div>
      </div>
      <div
        className={`flex flex-row w-full ${
          lightOff ? "bg-black" : "bg-base-100"
        } `}
      >
        <ScrollToTopButton />
        <AIButton />
        <div className={`${lightOff && "invisible"}`}>
          <Navbar />
        </div>
        <div className={`flex flex-1 ${!lightOff && "pl-72"}`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const router = createHashRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },

      {
        path: "/movie/:id",
        element: <MovieDetail />,
      },
      {
        path: "/vietsub-detail/:id",
        element: <VietSubDetails />,
      },
      {
        path: "/search/:keyword",
        element: <Search />,
      },
      {
        path: "/favourite",
        element: <FavouriteScreen />,
      },
      {
        path: "/vietsub",
        element: <VietSub />,
      },
      {
        path: "/vlxx",
        element: <Vlxx />,
      },
      {
        path: "/javhd",
        element: <Javhd />,
      },
      {
        path: "/history",
        element: <AllHistory />,
      },
      {
        path: "/comic",
        element: <Comic />,
      },
      {
        path: "/viet69",
        element: <Viet69 />,
      },
      {
        path: "/sextop1",
        element: <Sextop1 />,
      },
      {
        path: "/rell",
        element: <Rell />,
      },
      {
        path: "/stories",
        element: <Stories />,
      },
      {
        path: "/old",
        element: <OldScreen />,
      },
      {
        path: "/search-offline",
        element: <EpornScreen />,
      },
      {
        path: "/old",
        element: <OldScreen />,
      },
      {
        path: "/old-video/:id",
        element: <OldMovieDetail />,
      },
      {
        path: "/stories-detail/:remote",
        element: <StoriesDetail />,
      },
      {
        path: "/comic-detail/:remote",
        element: <ComicDetailPage />,
      },
      {
        path: "/category/:category/:title/:keyword",
        element: <Category />,
      },
      {
        path: "*",
        element: <HomePage />,
      },
      {
        path: "/setting",
        element: <Setting />,
      },
    ],
    errorElement: <Error />,
  },
]);
export default router;
