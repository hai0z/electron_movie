import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createHashRouter, Outlet, RouterProvider } from "react-router-dom";
import "./index.css";
import Navbar from "./components/Navbar.tsx";
import MovieDetail from "./page/MovieDetail.tsx";
import { FaRegWindowMinimize, FaRegWindowRestore } from "react-icons/fa6";
import { FaRegWindowClose } from "react-icons/fa";
import Search from "./page/Search.tsx";
import Category from "./page/Category.tsx";
const MainLayout = () => {
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
          backgroundColor: "oklch(var(--b1)/0.9)",
        }}
      >
        <div className="drag px-4 flex flex-row items-center justify-start backdrop:blur-md w-full flex-1 h-full "></div>
        <div
          className="cursor-pointer h-10 w-10 justify-center items-center flex  hover:bg-primary/10 "
          onClick={minimize}
        >
          <FaRegWindowMinimize />
        </div>
        <div
          onClick={maximize}
          className="cursor-pointer h-10 w-10  justify-center items-center flex hover:bg-primary/10"
        >
          <FaRegWindowRestore className="cursor-pointer" />
        </div>
        <div
          onClick={close}
          className="cursor-pointer h-10 w-10  justify-center items-center flex hover:bg-primary/10"
        >
          <FaRegWindowClose />
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
        element: <App />,
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
        path: "/category/:category/:slug/:title",
        element: <Category />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
