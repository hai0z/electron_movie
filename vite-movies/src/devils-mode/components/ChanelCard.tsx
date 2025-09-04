import { useNavigate } from "react-router-dom";
import { Channel } from "../types/Story";

export default function ChannelItem({
  channel,
  chap,
  position,
}: {
  channel: Channel;
  chap?: number;
  position?: number;
}) {
  const navigation = useNavigate();

  const handleNavigate = () => {
    navigation("/stories-detail/" + channel.remote_data.url.split("/").at(-1), {
      state: {
        channel: channel,
        lastChap: chap,
        position,
      },
    });
  };

  return (
    <div
      className="card bg-base-200 shadow-md hover:shadow-lg transition-all duration-300 border border-base-200 hover:border-accent/20 group cursor-pointer"
      onClick={handleNavigate}
    >
      <div className="card-body p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="card-title text-lg font-bold text-base-content transition-colors duration-200">
              {channel.name}
            </h2>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-base-content/80 leading-relaxed line-clamp-2 group-hover:text-base-content transition-colors duration-200">
            {channel.description}
          </p>
          {chap! >= 0 ? (
            <p className="badge badge-primary my-2">
              Đang đọc phần {chap! + 1}
            </p>
          ) : (
            ""
          )}
          {position! >= 0 ? (
            <p className="badge badge-secondary my-2 ml-2">
              postion: {position}
            </p>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}
