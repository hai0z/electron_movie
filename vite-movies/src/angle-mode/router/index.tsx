import { BiWindowClose, BiWindows } from "react-icons/bi";
import { createHashRouter, Outlet } from "react-router-dom";
import { useAppStore } from "../../zustand/appState";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import { FaRegWindowMinimize } from "react-icons/fa6";
import MovieDetail from "../page/MovieDetail";
import FavouriteScreen from "../page/Favorite";
import Category from "../page/Category";
import Search from "../page/Search";
import Home from "../page/Home";
import Setting from "../../common/Setting";
import Error from "../../common/Error";

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
          height: 25,
          backgroundColor: lightOff ? "#000000" : "oklch(var(--b1)/0.9)",
        }}
      >
        <div className="drag px-4 flex flex-row items-center justify-start backdrop:blur-md w-full flex-1 h-full "></div>
        <div
          className="cursor-pointer h-10 w-10 justify-center items-center flex  hover:bg-primary/10 "
          onClick={minimize}
        >
          <FaRegWindowMinimize
            className={`cursor-pointer ${lightOff && "text-white"}`}
          />
        </div>
        <div
          onClick={maximize}
          className="cursor-pointer h-10 w-10  justify-center items-center flex hover:bg-primary/10"
        >
          <BiWindows
            className={`cursor-pointer mt-3 ${lightOff && "text-white"}`}
          />
        </div>
        <div
          onClick={close}
          className="cursor-pointer h-10 w-10  justify-center items-center flex hover:bg-primary/10"
        >
          <BiWindowClose
            className={`cursor-pointer mt-3 ${lightOff && "text-white"}`}
          />
        </div>
      </div>
      <Navbar />
      <Outlet />
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
        element: <Home />,
      },
      {
        path: "/movie/:id",
        element: <MovieDetail />,
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
        path: "/category/:category/:slug/:title",
        element: <Category />,
      },
      {
        path: "*",
        element: <Home />,
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
