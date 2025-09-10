import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "../components/Pagination";
import { ChevronLeft } from "lucide-react";
import { useAppStore } from "../../zustand/appState";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import toast from "react-hot-toast";

export interface Actor {
  id: string;
  name: string;
  display: string;
  image: Image;
}

export interface Image {
  type: string;
  width: number;
  height: number;
  shape: string;
  url: string;
}

export default function ActorPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [actors, setActors] = useState<any>([]);

  const [search, setSearch] = useState("");

  const [suggestions, setSuggestions] = useState<string[]>([]);

  const [loadingSuggest, setLoadingSuggest] = useState(false);

  const page = Number(searchParams.get("page")) || 1;

  const query = searchParams.get("q") || "";

  const [totalPages, setTotalPages] = useState(1);

  const limit = 30;

  const ipcRenderer = (window as any).electron.ipcRenderer;

  const loadActors = () => {
    query === ""
      ? ipcRenderer.send("get-actors", { page, limit })
      : ipcRenderer.send("search-actors", { page, limit, name: query });
  };

  useEffect(() => {
    ipcRenderer.on("get-actors-result", (result: any) => {
      setActors(JSON.parse(result));
      setTotalPages(JSON.parse(result).page.last_page);
    });

    ipcRenderer.on("search-actors-result", (result: any) => {
      const data = JSON.parse(result);
      setActors(data);
      setTotalPages(data.page.last_page);
    });

    loadActors();

    window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
  }, [page, query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: search, page: "1" });
    setSuggestions([]);
  };

  // fetch suggestions khi user nhập
  useEffect(() => {
    if (!search || search.length < 2) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const fetchSuggest = async () => {
      try {
        setLoadingSuggest(true);
        const res = await fetch(
          `https://iptv.nangcucz.link/actors/nangcuc/suggest?q=${encodeURIComponent(
            search
          )}`,
          { signal: controller.signal }
        );
        const data = await res.json();
        setSuggestions(data || []);
      } catch (err) {
        if (!(err instanceof DOMException)) console.error(err);
      } finally {
        setLoadingSuggest(false);
      }
    };

    const delay = setTimeout(fetchSuggest, 300); // debounce 300ms
    return () => {
      clearTimeout(delay);
      controller.abort();
    };
  }, [search]);

  return (
    <div className="p-6 w-full h-full">
      <div className="flex flex-row items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-circle mb-2 btn-sm"
          title="Quay lại"
        >
          <ChevronLeft />
        </button>
        <h1 className="text-3xl font-bold mb-4">Diễn viên</h1>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-4 flex gap-2 relative">
        <input
          type="text"
          placeholder="Nhập tên diễn viên"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered flex-1"
        />
        <button type="submit" className="btn btn-primary">
          Tìm kiếm
        </button>
        {query && (
          <button
            type="button"
            className="btn btn-outline btn-secondary"
            onClick={() => {
              setSearch("");
              setSearchParams({ page: "1" });
            }}
          >
            Làm mới
          </button>
        )}

        {/* Suggest dropdown */}
        {suggestions.length > 0 && (
          <ul className="absolute top-full left-0 right-0 bg-base-100 border rounded shadow z-20 mt-1 max-h-60 overflow-y-auto">
            {suggestions.map((sug, idx) => (
              <li
                key={idx}
                className="px-3 py-2 hover:bg-base-200 cursor-pointer"
                onClick={() => {
                  setSearchParams({ q: sug, page: "1" });

                  setSuggestions([]);
                }}
              >
                {sug}
              </li>
            ))}
            {loadingSuggest && (
              <li className="px-3 py-2 text-sm text-gray-500">Đang tải...</li>
            )}
          </ul>
        )}
      </form>

      <div className="mt-4 justify-center flex items-center sticky top-[40px] z-10 w-full bg-base-100 py-2 mb-4">
        <Pagination page={page} total={totalPages} initialPage={1} />
      </div>

      {/* Actor list */}
      <div className="flex flex-row flex-wrap gap-4 px-6">
        {actors?.actors?.length === 0 ? (
          <div className="text-center col-span-full py-10 text-gray-500">
            Không tìm thấy diễn viên nào.
          </div>
        ) : (
          actors?.actors?.map((actor: Actor) => (
            <ActorCard actor={actor} key={actor.id} />
          ))
        )}
      </div>
    </div>
  );
}

export const ActorCard = ({ actor }: { actor: Actor }) => {
  const { likeActor, setLikeActor } = useAppStore();

  const isLike = likeActor.findIndex((i) => i.id === actor.id) !== -1;

  const toggleLike = () => {
    if (isLike) {
      setLikeActor(likeActor.filter((i) => i.id !== actor.id));
      toast.error("Đã xoá khỏi yêu thích");
    } else {
      setLikeActor([actor, ...likeActor]);
      toast.success("Đã thêm vào yêu thích");
    }
  };
  return (
    <div
      key={actor.id}
      className="transition-all duration-300 rounded-lg shadow-md cursor-pointer w-[23.5%] 2xl:w-[16.6%] bg-base-200 hover:ring-1 hover:ring-primarys hover:scale-[1.01] hover:shadow-primarys group card my-1 hover:bg-acshadow-primarys/10 card-compact"
    >
      <figure>
        <img
          src={
            actor.image.url.includes("default")
              ? "https://cdn-icons-png.flaticon.com/128/1814/1814294.png"
              : actor.image.url
          }
          alt={actor.name}
          className="rounded-full w-2/3 h-full"
        />
        <button
          onClick={toggleLike}
          className="absolute top-2 right-2 p-2 rounded-full bg-base-100 shadow-md border border-base-content hover:bg-primary/20 transition"
        >
          {isLike ? (
            <IoHeartSharp size={20} color="red" />
          ) : (
            <IoHeartOutline size={20} />
          )}
        </button>
      </figure>
      <div className="card-body">
        <Link
          to={"/actor-movie?actor=" + actor.name}
          className="card-title group-hover:text-primarys hover:underline"
        >
          {actor.name}
        </Link>
      </div>
    </div>
  );
};
