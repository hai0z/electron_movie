import React, { Fragment, useEffect } from "react";
import { useAppStore } from "../zustand/appState";
interface AppProviderProps {
  children: React.ReactNode;
}

interface IAppContext {
  isAppModeChange: boolean;
  setIsAppModeChange: React.Dispatch<React.SetStateAction<boolean>>;
}
const AppContext = React.createContext({} as IAppContext);

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isAppModeChange, setIsAppModeChange] = React.useState(false);
  const setLightOff = useAppStore((state) => state.setLightOff);
  useEffect(() => {
    setLightOff(false);
  }, []);
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
