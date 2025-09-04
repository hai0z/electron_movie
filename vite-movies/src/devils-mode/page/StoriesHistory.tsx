import { Clock, Trash2 } from "lucide-react";
import { useStoriesHistory } from "../../zustand/useStoriesHistory";
import ChannelItem from "../components/ChanelCard";

const StoriesHistory = () => {
  const { history, removeHistory, clearHistory } = useStoriesHistory();

  if (history.length === 0) {
    return (
      <div className="p-6 h-full my-4 text-center text-gray-500">
        Chưa có lịch sử đọc nào
      </div>
    );
  }

  return (
    <div className="p-6 h-full my-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Clock className="w-6 h-6 text-primary" />
          Lịch sử đã đọc
        </h1>
        <button onClick={() => clearHistory()} className="btn btn-sm btn-error">
          Xóa tất cả
        </button>
      </div>
      <div className="flex flex-col gap-4">
        {history.map((item) => (
          <div
            key={item.channel.id}
            className="flex items-center justify-between gap-3"
          >
            <ChannelItem
              channel={item.channel}
              chap={item.lastChap}
              position={item.position}
            />
            <button
              onClick={() => removeHistory(item.channel.id)}
              className="btn btn-sm btn-outline btn-error flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              Xóa
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoriesHistory;
