import { useNavigate } from "react-router-dom";
import { useAppStore } from "../zustand/appState";
import { useAppContext } from "../provider/AppProvider";
import { darkThemes, lightThemes } from "../constants/theme";

const Setting = () => {
  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);
  const navigate = useNavigate();

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

  // ✅ Export state
  const handleExport = () => {
    const state = useAppStore.getState();
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "appState.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // ✅ Import state
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedState = JSON.parse(event.target?.result as string);

        // ✅ Kiểm tra cấu trúc
        if (
          typeof importedState.theme !== "string" ||
          !["card", "list"].includes(importedState.viewMode) ||
          !["angle", "devil"].includes(importedState.appMode) ||
          !Array.isArray(importedState.otherLike) ||
          !Array.isArray(importedState.likeVideos) ||
          !Array.isArray(importedState.likeVietSubs)
        ) {
          throw new Error("File không hợp lệ!");
        }

        // Nếu ok thì setState
        useAppStore.setState(importedState, true);
        alert("Import thành công!");
      } catch (error) {
        alert("❌ File không hợp lệ hoặc bị lỗi!");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className={`px-6 ${appMode === "angle" ? "pt-20" : "pt-8"}`}>
      <div>
        <span className="text-3xl font-bold" onDoubleClick={changeMode}>
          Cài đặt
        </span>
      </div>

      <div className="mt-4">
        {/* Giao diện */}
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

        {/* Chế độ xem */}
        {/* <div className="bg-base-200 collapse collapse-arrow mt-4">
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
        </div> */}
      </div>

      {/* Hiện export / import nếu mode devil */}
      {appMode == "devil" && (
        <div className="bg-base-200 rounded-box  px-4 mt-4 py-4">
          <p className="text-lg font-bold">Sao lưu và khôi phục</p>

          <div className="mt-6 flex gap-4">
            <button
              onClick={handleExport}
              className="btn btn-sm btn-primary shadow-md"
            >
              Export Dữ liệu
            </button>

            <label className="btn btn-sm btn-secondary cursor-pointer">
              Import Dữ liệu
              <input
                type="file"
                accept="application/json"
                onChange={handleImport}
                hidden
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default Setting;
