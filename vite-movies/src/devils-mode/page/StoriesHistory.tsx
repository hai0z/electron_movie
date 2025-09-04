import { Clock, Trash2 } from "lucide-react";
import { useStoriesHistory } from "../../zustand/useStoriesHistory";
import ChannelItem from "../components/ChanelCard";
import HentaiCard from "../components/HentaiCard";
import { useState } from "react";

const StoriesHistory = () => {
  const { history, removeHistory, clearHistory } = useStoriesHistory();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  if (history.length === 0) {
    return (
      <div className="p-6 h-full my-4 text-center text-gray-500">
        Chưa có lịch sử đọc nào
      </div>
    );
  }

  // Phân loại lịch sử
  const directoryHistory = history.filter(
    (item) => item.channel.type === "directory"
  );
  const otherHistory = history.filter(
    (item) => item.channel.type !== "directory"
  );

  return (
    <div className="p-6 h-full my-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Clock className="w-6 h-6 text-primarys" />
          Lịch sử đã đọc
        </h1>
        <button
          onClick={() =>
            (document.getElementById("clear_all_modal") as any)?.showModal()
          }
          className="btn btn-sm btn-error"
        >
          Xoá tất cả
        </button>
      </div>

      {/* Directory */}
      {directoryHistory.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">📖 Truyện Tranh</h2>
          <div className="flex flex-row flex-wrap gap-4">
            {directoryHistory.map((item) => (
              <div
                key={item.channel.id}
                className="flex  justify-between gap-3 relative"
              >
                <HentaiCard
                  channel={item.channel}
                  chap={item.lastChap}
                  position={item.position}
                />
                <button
                  onClick={() => {
                    setConfirmId(item.channel.id);
                    (
                      document.getElementById("delete_modal") as any
                    )?.showModal();
                  }}
                  className="btn absolute top-2 right-2 btn-error flex items-center gap-1 btn-xs"
                >
                  <Trash2 className="w-4 h-4" />
                  Xoá
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Các loại khác */}
      {otherHistory.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">📖 Truyện chữ</h2>
          <div className="flex flex-col gap-4">
            {otherHistory.map((item) => (
              <div
                key={item.channel.id}
                className="flex items-center justify-between gap-3 relative"
              >
                <ChannelItem
                  channel={item.channel}
                  chap={item.lastChap}
                  position={item.position}
                />
                <button
                  onClick={() => {
                    setConfirmId(item.channel.id);
                    (
                      document.getElementById("delete_modal") as any
                    )?.showModal();
                  }}
                  className="btn btn-sm btn-outline btn-error flex items-center gap-1 absolute right-4 top-4"
                >
                  <Trash2 className="w-4 h-4" />
                  Xoá
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal xoá từng item */}
      <dialog id="delete_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Xác nhận xoá</h3>
          <p>Bạn có chắc muốn xoá truyện này khỏi lịch sử không?</p>
          <div className="modal-action">
            <button
              onClick={() => {
                if (confirmId) removeHistory(confirmId);
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
          <p>Bạn có chắc muốn xoá toàn bộ lịch sử đã đọc không?</p>
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
    </div>
  );
};

export default StoriesHistory;
