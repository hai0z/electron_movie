import { Fragment, StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import router from "./angle-mode/router/index.tsx";
import devilRouter from "./devils-mode/router/index.tsx";
import { useAppStore } from "./zustand/appState.ts";
import AppProvider, { useAppContext } from "./provider/AppProvider.tsx";
import { motion } from "framer-motion";
const AppRoot = () => {
  const appMode = useAppStore((state) => state.appMode);

  const theme = useAppStore((state) => state.theme);

  const { isAppModeChange, setIsAppModeChange } = useAppContext();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppModeChange(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [appMode]);

  if (isAppModeChange) {
    return (
      <motion.div
        className="min-h-screen w-full bg-base-100"
        data-theme={theme}
      >
        <motion.div className="h-screen w-full flex justify-center items-center">
          <span className="text-[69px]">
            {appMode === "angle" ? "😇" : "😈"}
          </span>
        </motion.div>
      </motion.div>
    );
  }
  return (
    <Fragment>
      <RouterProvider router={appMode === "angle" ? router : devilRouter} />
    </Fragment>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      <AppRoot />
    </AppProvider>
  </StrictMode>
);
