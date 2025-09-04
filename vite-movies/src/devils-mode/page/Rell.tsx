import { Play } from "lucide-react";
import { useEffect, useState } from "react";
import { List, RootTiktok } from "../types/TikTok";
import Loading from "../../common/Loading";

export default function Rell() {
  const [items, setItems] = useState<List[]>([]);
  const [isAtBottom, setIsAtBottom] = useState(false); // 👈 thêm state

  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<List>();

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
      setItems([...items, ...data.data.list]);
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
  return (
    <div className="w-full h-full bg-base-100 p-2">
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box aspect-[9/16] p-0">
          <iframe className="w-full h-full" src={selectedItem?.video_url} />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setSelectedItem(undefined)}>close</button>
        </form>
      </dialog>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {items.map((item: List) => (
          <PostCard
            key={item.id}
            item={item}
            onClick={() => {
              setSelectedItem(item);
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

      {/* overlay hover */}
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
