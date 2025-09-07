import React, { Fragment, useEffect } from "react";
import { useAppStore } from "../zustand/appState";
import { useHistoryStore } from "../zustand/useHistoryStore";
import { useStoriesHistory } from "../zustand/useStoriesHistory";
import { motion } from "framer-motion";
interface AppProviderProps {
  children: React.ReactNode;
}

const ONE_MINUTE = 60_000;
interface IAppContext {
  isAppModeChange: boolean;
  setIsAppModeChange: React.Dispatch<React.SetStateAction<boolean>>;
}
const AppContext = React.createContext({} as IAppContext);

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isAppModeChange, setIsAppModeChange] = React.useState(false);

  const setLightOff = useAppStore((state) => state.setLightOff);

  const electron = (window as any).electron;

  const hydrated = useAppStore((state) => state.hydrated);

  const getUserData = () => {
    electron.ipcRenderer.send("get-user-data");
    electron.ipcRenderer.on("user-data", (data: any) => {
      localStorage.setItem("user", JSON.stringify(data));
    });
  };

  const syncData = () => {
    const safeAppData = JSON.parse(JSON.stringify(useAppStore.getState()));
    const safeReadHistory = JSON.parse(
      JSON.stringify(useStoriesHistory.getState().history)
    );
    const safeWatchHistory = JSON.parse(
      JSON.stringify(useHistoryStore.getState().history)
    );
    electron.ipcRenderer.send("sync-data", {
      appData: safeAppData,
      readHistory: safeReadHistory,
      watchHistory: safeWatchHistory,
    });
  };
  useEffect(() => {
    setLightOff(false);
    getUserData();
    syncData();
  }, []);

  useEffect(() => {
    syncData();
    electron.ipcRenderer.on("synced-data", (data: any) => {
      useAppStore.setState((state) => ({
        ...state,
        ...data.appData,
      }));
      useHistoryStore.setState((state) => ({
        ...state,
        history: data.watchHistory,
      }));
      useStoriesHistory.setState((state) => ({
        ...state,
        history: data.readHistory,
      }));

      const { name, userUid, lastSync } = data;

      localStorage.setItem(
        "user",
        JSON.stringify({
          name,
          userUid,
          lastSync,
        })
      );
    });

    const interval = setInterval(() => {
      syncData();
    }, ONE_MINUTE);

    // cleanup khi component unmount
    return () => clearInterval(interval);
  }, []);

  if (!hydrated) return null;

  return (
    <AppContext.Provider
      value={{
        isAppModeChange,
        setIsAppModeChange,
      }}
    >
      <Fragment>{children}</Fragment>
    </AppContext.Provider>
  );
};
export const useAppContext = () => React.useContext(AppContext);
export default AppProvider;
