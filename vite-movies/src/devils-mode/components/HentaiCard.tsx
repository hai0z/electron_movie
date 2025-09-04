// components/HentaiCard.tsx
import { useNavigate } from "react-router-dom";
import { Channel } from "../types/Comic";

interface Props {
  channel: Channel;
  chap?: number;
  position?: number;
}

export default function HentaiCard({ channel, chap, position }: Props) {
  const navigation = useNavigate();
  return (
    <div
      className="mx-auto"
      style={{
        width: channel.image.width,
      }}
    >
      {/* Ảnh */}
      <div className="relative">
        <img
          src={channel.image.url}
          alt={channel.name}
          className="w-full h-auto rounded-lg object-cover shadow-md"
          style={{
            height: channel.image.height,
            width: channel.image.width,
          }}
        />
        {channel.label?.text && (
          <div className="absolute top-2 left-2 badge badge-primary">
            {channel.label.text}
          </div>
        )}
        {chap! >= 0 && (
          <div className="absolute bottom-2 left-2 badge badge-primary">
            Chap {chap! + 1} | vị trí: {position}
          </div>
        )}
        {channel.label?.text && (
          <div className="absolute top-2 left-2 badge badge-primary">
            {channel.label.text}
          </div>
        )}
      </div>

      {/* Tên + mô tả */}
      <div
        className="mt-2 "
        style={{
          width: channel.image.width,
        }}
      >
        <h2 className="font-semibold text-base line-clamp-2">
          <div
            onClick={() => {
              navigation(
                `/comic-detail/${channel.remote_data.url.split("/").at(-1)}`,
                {
                  state: {
                    channel: channel,
                    lastChap: chap,
                    position,
                  },
                }
              );
            }}
            className="hover:underline cursor-pointer"
          >
            {channel.name}
          </div>
        </h2>
      </div>
    </div>
  );
}
