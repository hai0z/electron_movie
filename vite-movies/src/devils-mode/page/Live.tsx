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
      <div className="flex justify-center items-center h-full w-full">
        <Loading />
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-lg">Không có stream nào đang online</p>
        <button className="btn btn-primary mt-4" onClick={getData}>
          Tải lại
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🔴 Live ({data.size})</h1>
        <button className="btn btn-sm" onClick={getData}>
          🔄 Tải lại
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
        {data.data.map((item: Daum) => (
          <div key={item.id} className="card bg-base-100 shadow">
            <figure>
              <img
                src={item.cover_image_url}
                alt={item.title}
                className="w-full h-40 object-cover"
              />
            </figure>
            <div className="card-body p-3">
              <h2 className="text-sm font-semibold line-clamp-2">
                {item.title}
              </h2>
              <p className="text-xs text-gray-500">{item.nick_name}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs">👀 {item.viewer_count}</span>
                <button
                  className="btn btn-primary btn-xs"
                  onClick={() => {
                    setSelected(item);
                    (
                      document.getElementById("live_modal") as HTMLDialogElement
                    )?.showModal();
                  }}
                >
                  Xem
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <dialog id="live_modal" className="modal">
        <div className="modal-box max-w-4xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>

          {selected && (
            <div>
              <h3 className="font-bold text-lg mb-2">{selected.title}</h3>
              <p className="text-sm mb-4">
                {selected.nick_name} • 👀 {selected.viewer_count}
              </p>

              <div className="aspect-video bg-black rounded">
                <ReactPlayer
                  url={selected.play_back_url}
                  height="100%"
                  width="100%"
                  playing
                />
              </div>
            </div>
          )}
        </div>
      </dialog>
    </div>
  );
};

export default Live;
