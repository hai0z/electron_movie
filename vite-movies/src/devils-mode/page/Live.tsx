import { useEffect, useState } from "react";
import { LiveRespone, Daum } from "../types/Live";
import ReactPlayer from "react-player";
import Loading from "../../common/Loading";
const Live = () => {
  const electron = (window as any).electron;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<LiveRespone>();
  const [selected, setSelected] = useState<Daum | null>(null);

  const getData = () => {
    setLoading(true);
    electron.ipcRenderer.send("get-live");

    electron.ipcRenderer.on("live-data", (res: LiveRespone) => {
      setData(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center h-full">
        <Loading />
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        😢 Không có stream nào đang online
      </div>
    );
  }

  return (
    <div className="px-6 w-full h-full">
      <h2 className="text-xl font-bold mb-4">
        🎥 Live đang phát ({data.size} streams)
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
        {data.data.map((item: Daum) => (
          <div
            key={item.id}
            className="card bg-base-200 shadow-sm rounded-2xl overflow-hidden"
          >
            <figure className="relative">
              <img
                src={item.cover_image_url}
                alt={item.title}
                className="w-full h-40 object-cover"
              />
              <span className="absolute bottom-2 right-2 bg-black/60 text-white  text-xs px-2 py-1 rounded-lg">
                👀 {item.viewer_count}
              </span>
            </figure>
            <div className="card-body p-4">
              <h3 className="font-semibold text-sm line-clamp-2">
                {item.title}
              </h3>
              <p className="text-xs text-gray-500">{item.nick_name}</p>
              <div className="mt-2">
                <button
                  onClick={() => {
                    setSelected(item);
                    (
                      document.getElementById("live_modal") as HTMLDialogElement
                    )?.showModal();
                  }}
                  className="btn btn-primary btn-sm w-full rounded-xl"
                >
                  Xem ngay
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal DaisyUI */}
      <dialog id="live_modal" className="modal">
        <div className="modal-box max-w-5xl">
          <form method="dialog">
            {/* nút đóng */}
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setSelected(null)}
            >
              ✕
            </button>
          </form>

          {selected && (
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-lg">{selected.title}</h3>
              <p className="text-sm text-gray-500">{selected.nick_name}</p>

              {/* Player video */}
              <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
                <ReactPlayer
                  url={selected.play_back_url}
                  height={"100%"}
                  width={"100%"}
                  playing
                />
              </div>
            </div>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setSelected(null)}>Đóng</button>
        </form>
      </dialog>
    </div>
  );
};

export default Live;
