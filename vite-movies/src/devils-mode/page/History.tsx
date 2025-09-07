import { Link } from "react-router-dom";
import { Clock, Play, Trash2 } from "lucide-react";
import { useHistoryStore } from "../../zustand/useHistoryStore";
import { useState } from "react";
import { Post } from "../types/other";
import OtherSourcemodal from "../components/OtherSourceModal";

function formatTime(seconds: number) {
  if (seconds < 60) {
    return `${seconds}s`;
  } else if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  } else {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
  }
}

const HistoryPage = () => {
  const { history, clearHistory, removeFromHistory } = useHistoryStore();

  const [post, setPost] = useState<Post>();
  const [confirmId, setConfirmId] = useState<string | null>(null); // id để xác nhận xoá

  return (
    <div className="p-6  h-full my-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Clock className="w-6 h-6 text-primarys" />
          Lịch sử đã xem
        </h1>
        {history.length > 0 && (
          <button
            onClick={() =>
              (document.getElementById("clear_all_modal") as any)?.showModal()
            }
            className="btn btn-error btn-sm"
          >
            Xoá tất cả
          </button>
        )}
      </div>
      {/* Content */}
      {history.length === 0 ? (
        <div className="alert alert-info shadow-lg w-full">
          <div>
            <Clock className="w-5 h-5" />
            <span>Chưa có lịch sử xem.</span>
          </div>
        </div>
      ) : (
        history
          .filter((item) => item.id !== undefined)
          .map((item) => (
            <div
              key={item.id}
              className="card card-side bg-base-200 shadow-sm hover:shadow-md transition hover:ring-1 ring-primarys w-full my-4"
            >
              <figure>
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-32 h-20 object-cover rounded-box"
                />
              </figure>
              <div className="card-body p-4 flex flex-row justify-between items-center w-full">
                <div className="flex items-center gap-3 flex-1">
                  <div>
                    <p className="font-semibold hover:underline ">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(item.watchedAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Đã xem trong {formatTime(item.stayIn!)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {item.type !== "other" && (
                    <Link
                      to={`${
                        item.type === "avdb"
                          ? `/movie/${item.id}`
                          : `/vietsub-detail/${item.id}`
                      }`}
                      className="btn btn-sm btn-primary flex items-center gap-1"
                    >
                      <Play className="w-4 h-4" />
                      Xem lại
                    </Link>
                  )}
                  {item.type === "other" && (
                    <button
                      onClick={() => {
                        setPost(item.otherData);
                        (
                          document.getElementById("video_modal") as any
                        )?.showModal();
                      }}
                      className="btn btn-sm btn-primary flex items-center gap-1"
                    >
                      <Play className="w-4 h-4" />
                      Xem lại
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setConfirmId(item.id);
                      (
                        document.getElementById("delete_modal") as any
                      )?.showModal();
                    }}
                    className="btn btn-sm btn-outline btn-error flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Xoá
                  </button>
                </div>
              </div>
            </div>
          ))
      )}

      {/* Modal xoá từng mục */}
      <dialog id="delete_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Xác nhận xoá</h3>
          <p>Bạn có chắc muốn xoá mục này khỏi lịch sử?</p>
          <div className="modal-action">
            <button
              onClick={() => {
                if (confirmId) removeFromHistory(confirmId);
                setConfirmId(null);
                (document.getElementById("delete_modal") as any)?.close();
              }}
              className="btn btn-error"
            >
              Xoá
            </button>
            <button
              onClick={() => {
                setConfirmId(null);

                (document.getElementById("delete_modal") as any)?.close();
              }}
              className="btn btn-outline"
            >
              Huỷ
            </button>
          </div>
        </div>
      </dialog>

      {/* Modal xoá tất cả */}
      <dialog id="clear_all_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Xác nhận xoá tất cả</h3>
          <p>Bạn có chắc muốn xoá toàn bộ lịch sử đã xem?</p>
          <div className="modal-action">
            <button
              onClick={() => {
                clearHistory();
                (document.getElementById("clear_all_modal") as any)?.close();
              }}
              className="btn btn-error"
            >
              Xoá tất cả
            </button>
            <button
              onClick={() =>
                (document.getElementById("clear_all_modal") as any)?.close()
              }
              className="btn btn-outline"
            >
              Huỷ
            </button>
          </div>
        </div>
      </dialog>

      {/* Modal khác */}
      <OtherSourcemodal post={post} onClose={() => setPost(undefined)} />
    </div>
  );
};

export default HistoryPage;
