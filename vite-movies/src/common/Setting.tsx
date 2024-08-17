import { useNavigate } from "react-router-dom";
import { useAppStore } from "../zustand/appState";
import { useAppContext } from "../provider/AppProvider";
import { darkThemes, lightThemes } from "../constants/theme";
const Setting = () => {
  const theme = useAppStore((state) => state.theme);

  const setTheme = useAppStore((state) => state.setTheme);

  const navigate = useNavigate();

  const viewMode = useAppStore((state) => state.viewMode);

  const setViewMode = useAppStore((state) => state.setViewMode);

  const setAppMode = useAppStore((state) => state.setAppMode);

  const appMode = useAppStore((state) => state.appMode);

  const { setIsAppModeChange } = useAppContext();

  function handleChangeTheme(themeName: string) {
    setTheme(themeName);
    document
      .getElementsByTagName("html")[0]
      ?.setAttribute("data-theme", themeName);
  }
  const changeMode = () => {
    navigate("/");

    setIsAppModeChange(true);
    setAppMode(appMode === "angle" ? "devil" : "angle");
  };

  return (
    <div className="px-6 pt-20">
      <div>
        <span className="text-3xl font-bold" onDoubleClick={changeMode}>
          Cài đặt
        </span>
      </div>
      <div className="mt-4">
        <div className="bg-base-200 collapse collapse-arrow">
          <input type="checkbox" className="peer" />
          <div className="collapse-title">
            <p className="text-xl font-bold">Giao diện</p>
            <p className="mt-2">Tuỳ chình giao diện cho ứng dụng</p>
          </div>
          <div className="collapse-content">
            <div>
              <span className="text-lg font-semibold">Sáng</span>
              <div className="flex flex-row flex-wrap gap-4 mt-2">
                {lightThemes.map((t) => {
                  return (
                    <div
                      data-theme={t.name}
                      className="flex gap-2 bg-transparent"
                      key={t.name}
                    >
                      <input
                        onChange={() => handleChangeTheme(t.name)}
                        type="radio"
                        name="radio-1"
                        className="radio radio-primary md:tooltip hover:bg-primarys"
                        data-tip={t.name}
                        checked={theme === t.name}
                      />
                      <p className={"block md:hidden"}>{t.name}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-4">
              <span className="text-lg font-semibold">Tối</span>
              <div className="flex flex-row flex-wrap gap-4 mt-2">
                {darkThemes.map((t) => {
                  return (
                    <div
                      data-theme={t.name}
                      className="flex gap-2 bg-transparent"
                      key={t.name}
                    >
                      <input
                        onChange={() => handleChangeTheme(t.name)}
                        type="radio"
                        name="radio-1"
                        className="radio radio-primary md:tooltip hover:bg-primarys"
                        data-tip={t.name}
                        checked={theme === t.name}
                      />
                      <p className={"block md:hidden"}>{t.name}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-base-200 collapse collapse-arrow mt-4">
          <input type="checkbox" className="peer" />
          <div className="collapse-title">
            <p className="text-xl font-bold">Chế độ xem</p>
            <p className="mt-2">Tuỳ chỉnh chế độ xem</p>
          </div>
          <div className="collapse-content">
            <div>
              <div className="flexflex-col gap-4">
                <div
                  className="flex gap-2 bg-transparent w-fit my-2 cursor-pointer"
                  key={0}
                  onClick={() => setViewMode("card")}
                >
                  <input
                    onChange={() => setViewMode("card")}
                    type="radio"
                    name="radio-2"
                    checked={viewMode === "card"}
                    className="radio radio-primary hover:bg-primarys"
                  />
                  <p className={"hidden md:block"}>Lưới</p>
                </div>
                <div
                  className="flex gap-2 cursor-pointer w-fit"
                  key={1}
                  onClick={() => setViewMode("list")}
                >
                  <input
                    onChange={() => setViewMode("list")}
                    type="radio"
                    name="radio-2"
                    checked={viewMode === "list"}
                    className="radio radio-primary  hover:bg-primarys"
                  />
                  <p className={"hidden md:block"}>Danh sách</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
