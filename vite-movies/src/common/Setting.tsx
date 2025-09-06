import { useNavigate } from "react-router-dom";
import { useAppStore } from "../zustand/appState";
import { useAppContext } from "../provider/AppProvider";
import { darkThemes, lightThemes } from "../constants/theme";
import { useEffect, useState } from "react";
import { useStoriesHistory } from "../zustand/useStoriesHistory";
import { useHistoryStore } from "../zustand/useHistoryStore";
import toast from "react-hot-toast";

const Setting = () => {
  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);
  const navigate = useNavigate();

  const deviceId = JSON.parse(localStorage.getItem("user")!).userUid;

  const [backupData, setBackupData] = useState<any>(null);

  const lastSync = JSON.parse(localStorage.getItem("user")!).lastSync;

  const lastBackup = JSON.parse(localStorage.getItem("last-backup")!) ?? "";

  const [lastBackupState, setLastBackupState] = useState(lastBackup);

  const setAppMode = useAppStore((state) => state.setAppMode);

  const appMode = useAppStore((state) => state.appMode);

  const { setIsAppModeChange } = useAppContext();

  const [msg, setMsg] = useState("");
  const [restoreId, setRestoreId] = useState("");

  const electron = (window as any).electron;

  function handleChangeTheme(themeName: string) {
    setTheme(themeName);
    document
      .getElementsByTagName("html")[0]
      ?.setAttribute("data-theme", themeName);
  }

  const handleCopy = async () => {
    try {
      const cleanId = deviceId?.replace(/^"|"$/g, "") || "";

      await navigator.clipboard.writeText(cleanId);
      toast("✅ Đã copy device_id vào clipboard");
    } catch (err) {
      toast("❌ Không thể copy device_id");
    }
  };

  const changeMode = () => {
    navigate("/");
    setIsAppModeChange(true);
    setAppMode(appMode === "angle" ? "devil" : "angle");
  };

  const handleExport = () => {
    const appData = useAppStore.getState();
    const watchHistory = useHistoryStore.getState().history;
    const readHistory = useStoriesHistory.getState().history;

    const exportData = {
      appData,
      watchHistory,
      readHistory,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "app_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // ✅ Import
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);

        // ✅ Kiểm tra cấu trúc cơ bản
        if (
          !imported.appData ||
          !Array.isArray(imported.watchHistory) ||
          !Array.isArray(imported.readHistory)
        ) {
          throw new Error("File không hợp lệ!");
        }

        // Gán lại state cho từng store
        useAppStore.setState((state) => ({
          ...state,
          ...imported.appData,
        }));
        useHistoryStore.setState((state) => ({
          ...state,
          history: imported.watchHistory,
        }));
        useStoriesHistory.setState((state) => ({
          ...state,
          history: imported.readHistory,
        }));

        toast("✅ Import thành công!");
      } catch (error) {
        toast("❌ File không hợp lệ hoặc bị lỗi!");
      }
    };
    reader.readAsText(file);
  };

  const handleBackUp = () => {
    console.log("ádsdf");
    const appData = useAppStore.getState();
    const watchHistory = useHistoryStore.getState().history;
    const readHistory = useStoriesHistory.getState().history;
    const backupData = {
      appData,
      watchHistory,
      readHistory,
    };
    electron.ipcRenderer.send("backup-data", JSON.stringify(backupData));
  };

  // ✅ Khôi phục bằng Device ID cũ
  const handleRestore = () => {
    if (!restoreId.trim()) {
      toast("⚠️ Vui lòng nhập Device ID hợp lệ");
      return;
    }
    electron.ipcRenderer.send("restore-data", restoreId);
  };

  useEffect(() => {
    electron.ipcRenderer.on("restore-data-respone", (data: any) => {
      if (data.success) {
        setBackupData(data.data);
      } else {
        setMsg(data.message);
      }
    });

    electron.ipcRenderer.on("backup-data-respone", () => {
      toast.success("Sao lưu thành công");
      localStorage.setItem("last-backup", JSON.stringify(new Date()));
      setLastBackupState(Date.now());
    });
  }, []);

  return (
    <div
      className={`px-6 ${
        appMode === "angle" ? "pt-20" : "pt-8"
      } bg-base-100 min-h-screen`}
    >
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
                      <p className={"block md:hidden"}>{t.name}</p>{" "}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export / Import */}
      {appMode == "devil" && (
        <div className="bg-base-200 rounded-box px-4 mt-4 py-4">
          <p className="text-lg font-bold">Sao lưu và khôi phục</p>
          <p>Đồng bộ lần cuối: {new Date(lastSync).toLocaleString("vi-VN")}</p>
          <div className="alert alert-success flex flex-col items-start gap-2 mt-2 text-success-content">
            <span className="font-semibold">📦 Export dữ liệu</span>
            <p className="text-sm">
              Xuất toàn bộ dữ liệu cấu hình, lịch sử và thông tin ứng dụng thành
              một file <code>.json</code>. Bạn có thể lưu trữ file này để khôi
              phục sau.
            </p>

            <span className="font-semibold">📂 Import dữ liệu</span>
            <p className="text-sm">
              Chọn file <code>.json</code> đã được export trước đó để khôi phục
              lại dữ liệu. Hãy chắc chắn rằng file đúng định dạng, nếu không sẽ
              không thể nhập được.
            </p>

            <p className="text-xs text-success-content">
              ⚠️ Lưu ý: Dữ liệu hiện tại sẽ bị ghi đè khi import.
            </p>

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

          <div className="alert alert-info flex flex-col items-start gap-2 mt-4 text-info-content">
            <span className="font-bold">Device ID của bạn</span>
            <span className="text-sm break-all">{deviceId}</span>
            <span className="text-xs ">
              Hãy ghi lại Device ID này để có thể backup/khôi phục dữ liệu khi
              chuyển thiết bị khác.
            </span>
            <span className="text-xs ">
              Ấn vào sao lưu dữ liệu ngay để ghi lại dữ liệu hiện tại.
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="btn btn-xs btn-outline mt-2"
              >
                Copy Device ID
              </button>
              <button
                onClick={() =>
                  (
                    document.getElementById(
                      "restore_modal"
                    ) as HTMLDialogElement
                  )?.showModal()
                }
                className="btn btn-xs btn-warning mt-2"
              >
                Khôi phục bằng device_id
              </button>
              <button
                onClick={handleBackUp}
                className="btn btn-xs btn-error mt-2"
              >
                Sao lưu dữ liệu ngay (lần cuối lúc:{" "}
                {lastBackupState !== ""
                  ? new Date(lastBackupState).toLocaleString("vn-VN")
                  : "no data"}
                )
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Modal khôi phục */}
      <dialog id="restore_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Khôi phục dữ liệu</h3>

          <p className="py-2 text-sm">
            Nhập Device ID cũ để khôi phục dữ liệu.
          </p>
          <input
            type="text"
            autoFocus
            value={restoreId}
            onChange={(e) => setRestoreId(e.target.value)}
            placeholder="Nhập Device ID..."
            className="input input-bordered w-full"
          />
          <p className="text-error my-1">{msg}</p>
          {backupData?.length >= 1 ? (
            <div className="my-4">
              <p className="text-lg font-bold mb-2">📦 Dữ liệu hiện có</p>

              <div className="grid gap-4 md:grid-cols-2">
                {backupData?.map((data: any) => (
                  <div
                    key={data._id}
                    className="card bg-base-200 shadow-md rounded-xl border border-base-300"
                  >
                    <div className="card-body p-4 flex flex-col justify-between">
                      <div>
                        <p className="text-sm text-gray-500">
                          Lần sao lưu gần nhất
                        </p>
                        <p className="font-semibold text-base">
                          {new Date(data.lastSync).toLocaleString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>

                      <div className="mt-3 flex justify-end">
                        <button
                          className="btn btn-sm btn-primarys rounded-lg"
                          onClick={() => {
                            useAppStore.setState((state) => ({
                              ...state,
                              ...data.appData,
                            }));
                            useHistoryStore.setState((state) => ({
                              ...state,
                              history: data.watchHistory ?? [],
                            }));
                            useStoriesHistory.setState((state) => ({
                              ...state,
                              history: data.readHistory ?? [],
                            }));

                            (
                              document.getElementById(
                                "restore_modal"
                              ) as HTMLDialogElement
                            )?.close();
                            setBackupData(null);
                            setRestoreId("");
                            setMsg("");
                            toast.success("Khôi phục thành công");
                          }}
                        >
                          🔄 Khôi phục
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="modal-action">
            <button className="btn btn-success" onClick={handleRestore}>
              Kiểm tra
            </button>
            <form method="dialog">
              <button
                className="btn"
                onClick={() => {
                  setBackupData(null);
                  setRestoreId("");
                  setMsg("");
                }}
              >
                Đóng
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Setting;
