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
    electron.ipcRenderer.send("get-tiktok");
    electron.ipcRenderer.on("tiktok", (data: RootTiktok) => {
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
    }
  };

  return (
    <div className="w-full h-full bg-base-100 p-2">
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box relative aspect-[9/16] p-0 flex flex-col">
          {/* iframe */}
          <iframe
            className="w-full flex-1"
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

        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setSelectedIndex(null)}>close</button>
        </form>
      </dialog>

      {/* Grid list */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {items.map((item: List, idx) => (
          <PostCard
            key={item.id}
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

function PostCard({ item, onClick }: { item: List; onClick: () => void }) {
  return (
    <div className="relative aspect-[9/16] rounded-xl overflow-hidden shadow-md group">
      <img
        className="w-full h-full object-cover"
        src={item.thumb}
        alt={item.title}
      />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-end p-2 text-white text-sm">
        <div>
          <p className="font-semibold truncate">{item.nickname}</p>
          <p className="opacity-80 text-xs truncate">{item.title}</p>
        </div>
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
