import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { List, RootTiktok } from "../types/TikTok";
import Loading from "../../common/Loading";

export default function Rell() {
  const [items, setItems] = useState<List[]>([]);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const electron = (window as any).electron;

  const getData = async () => {
    electron.ipcRenderer.send("get-tiktok");
    setLoading(true);
    electron.ipcRenderer.on("tiktok", (data: RootTiktok) => {
      setItems(data.data.list);
      setLoading(false);
    });
  };

  const handleLoadMore = async () => {
    electron.ipcRenderer.send("load-more-tiktok");
    electron.ipcRenderer.on("load-more-tiktok-data", (data: RootTiktok) => {
      setItems((prev) => [...prev, ...data.data.list]);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.body.scrollHeight;

      const atBottom = scrollTop + windowHeight >= fullHeight - 20;

      if (atBottom && !isAtBottom) {
        handleLoadMore();
        setIsAtBottom(true);
      } else if (!atBottom && isAtBottom) {
        setIsAtBottom(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isAtBottom]);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <Loading />
      </div>
    );
  }

  const selectedItem =
    selectedIndex !== null ? items[selectedIndex] : undefined;

  const handlePrev = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null && selectedIndex < items.length - 1) {
      setSelectedIndex(selectedIndex + 1);
      document
        .getElementById(`short-${items[selectedIndex + 1].id}`)
        ?.scrollIntoView({
          behavior: "smooth", // cuộn mượt
          block: "start", // vị trí top
        });
    }
  };

  return (
    <div className="w-full h-full bg-base-100 p-2">
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box max-w-4xl p-0 flex flex-row">
          {/* Left: Video */}
          <div className="flex-1 bg-black relative aspect-[9/16]">
            <iframe
              className="w-full h-full"
              src={selectedItem?.video_url}
              allowFullScreen
            />
            {/* Controls */}
            <div className="absolute top-1/2 left-2 -translate-y-1/2">
              <button
                onClick={handlePrev}
                disabled={selectedIndex === 0}
                className="btn btn-circle btn-sm"
              >
                <ChevronLeft />
              </button>
            </div>
            <div className="absolute top-1/2 right-2 -translate-y-1/2">
              <button
                onClick={handleNext}
                disabled={selectedIndex === items.length - 1}
                className="btn btn-circle btn-sm"
              >
                <ChevronRight />
              </button>
            </div>
          </div>

          {/* Right: Info */}
          <div className="w-80 p-4 flex flex-col gap-3 bg-base-200 overflow-y-auto">
            <div className="flex items-center gap-2">
              <img
                src={selectedItem?.avatar}
                alt={selectedItem?.nickname}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-bold">{selectedItem?.nickname}</p>
                <p className="text-sm opacity-70">@{selectedItem?.username}</p>
              </div>
            </div>

            <p className="text-sm">{selectedItem?.title}</p>

            {/* Stats */}
            <div className="flex gap-4 text-sm">
              <span>👀 {selectedItem?.view_num}</span>
              <span>❤️ {selectedItem?.like_num}</span>
              <span>💬 {selectedItem?.comment_num}</span>
              <span>🔗 {selectedItem?.share_num}</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedItem?.tags?.map((tag) => (
                <span
                  key={tag.id}
                  className="badge badge-outline badge-sm cursor-pointer"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
            <div>
              <p className="my-2 font-bold">
                Từ người dùng: {selectedItem?.nickname}
              </p>
              <UserVideo id={selectedItem?.user_id!} />
            </div>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setSelectedIndex(null)}>close</button>
        </form>
      </dialog>

      {/* Grid list */}
      <div className="grid grid-cols-2 xl:grid-cols-6 2xl:grid-cols-8 gap-2">
        {items.map((item: List, idx) => (
          <PostCard
            key={idx}
            item={item}
            onClick={() => {
              setSelectedIndex(idx);
              (document.getElementById("my_modal_2") as any)?.showModal();
            }}
          />
        ))}
      </div>
    </div>
  );
}

function PostCard({
  item,
  onClick,
  showInfo = true,
}: {
  item: List;
  onClick: () => void;
  showInfo?: boolean;
}) {
  return (
    <div
      className="relative aspect-[9/16] rounded-xl overflow-hidden shadow-md group"
      id={`short-${item.id}`}
    >
      <img
        className="w-full h-full object-cover"
        src={item.thumb}
        alt={item.title}
      />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-end p-2 text-white text-sm">
        {showInfo && (
          <div>
            <p className="font-semibold truncate">{item.nickname}</p>
            <p className="opacity-80 text-xs truncate">{item.title}</p>
          </div>
        )}
        <div
          onClick={onClick}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-neutral p-2"
        >
          <Play />
        </div>
      </div>
    </div>
  );
}

const UserVideo = ({ id }: { id: number }) => {
  const [userVideo, setUserVideo] = useState<List[]>([]);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const selectedItem =
    selectedIndex !== null ? userVideo[selectedIndex] : undefined;

  const handlePrev = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null && selectedIndex < userVideo.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };
  const getUserVideo = async () => {
    const res = await fetch(
      `https://www.avrebo.com/avrebo-api/v1/video/list?type=1&limit=500&url=video/list&page=1&user_id=${id}`
    );
    const data = await res.json();
    setUserVideo(data.data.list);
    console.log(data);
  };
  useEffect(() => {
    getUserVideo();
  }, [id]);

  return (
    <div className="grid grid-cols-3 gap-2">
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box max-w-4xl p-0 flex flex-row">
          {/* Left: Video */}
          <div className="flex-1 bg-black relative aspect-[9/16]">
            <iframe
              className="w-full h-full"
              src={selectedItem?.video_url}
              allowFullScreen
            />
            {/* Controls */}
            <div className="absolute top-1/2 left-2 -translate-y-1/2">
              <button
                onClick={handlePrev}
                disabled={selectedIndex === 0}
                className="btn btn-circle btn-sm"
              >
                <ChevronLeft />
              </button>
            </div>
            <div className="absolute top-1/2 right-2 -translate-y-1/2">
              <button
                onClick={handleNext}
                disabled={selectedIndex === userVideo.length - 1}
                className="btn btn-circle btn-sm"
              >
                <ChevronRight />
              </button>
            </div>
          </div>

          {/* Right: Info */}
          <div className="w-80 p-4 flex flex-col gap-3 bg-base-200 overflow-y-auto">
            <div className="flex items-center gap-2">
              <img
                src={selectedItem?.avatar}
                alt={selectedItem?.nickname}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-bold">{selectedItem?.nickname}</p>
                <p className="text-sm opacity-70">@{selectedItem?.username}</p>
              </div>
            </div>

            <p className="text-sm">{selectedItem?.title}</p>

            {/* Stats */}
            <div className="flex gap-4 text-sm">
              <span>👀 {selectedItem?.view_num}</span>
              <span>❤️ {selectedItem?.like_num}</span>
              <span>💬 {selectedItem?.comment_num}</span>
              <span>🔗 {selectedItem?.share_num}</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedItem?.tags?.map((tag) => (
                <span
                  key={tag.id}
                  className="badge badge-outline badge-sm cursor-pointer"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {userVideo.map((item: List, idx) => (
                <div key={idx}>
                  <PostCard
                    showInfo={false}
                    item={item}
                    onClick={() => {
                      setSelectedIndex(idx);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setSelectedIndex(null)}>close</button>
        </form>
      </dialog>
      {userVideo.map((item: List, idx) => (
        <div key={idx}>
          <PostCard
            showInfo={false}
            item={item}
            onClick={() => {
              setSelectedIndex(idx);
              (document.getElementById("my_modal_3") as any)?.showModal();
              (document.getElementById("my_modal_2") as any)?.close();
              const dialog = document.getElementById(
                "my_modal_2"
              ) as HTMLDialogElement;
              dialog?.close();

              const iframe = dialog?.querySelector("iframe");
              if (iframe) {
                (iframe as HTMLIFrameElement).src = "";
              }
            }}
          />
        </div>
      ))}
    </div>
  );
};
