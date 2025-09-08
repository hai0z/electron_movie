import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "../components/Pagination";
import { ChevronLeft } from "lucide-react";

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
  const page = Number(searchParams.get("page")) || 1;
  const query = searchParams.get("q") || "";
  const [totalPages, setTotalPages] = useState(1);

  const limit = 30;

  const ipcRenderer = (window as any).electron.ipcRenderer;

  const loadActors = () => {
    query === ""
      ? ipcRenderer.send("get-actors", { page, limit })
      : ipcRenderer.send("search-actors", { page, limit, name: query });
    console.log("send" + query);
  };

  useEffect(() => {
    ipcRenderer.on("get-actors-result", (result: any) => {
      setActors(JSON.parse(result));
      setTotalPages(JSON.parse(result).page.last_page);
    });

    ipcRenderer.on("search-actors-result", (result: any) => {
      const data = JSON.parse(result);
      console.log(data);
      setActors(data);
      setTotalPages(data.page.last_page);
    });

    loadActors(); // initial load

    window.scrollTo({
      left: 0,
      top: 0,
      behavior: "smooth",
    });
  }, [page, query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: search, page: "1" });
  };

  return (
    <div className="p-6 w-full h-full">
      <div className="flex flex-row items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-circle mb-2 btn-sm "
          title="Quay lại"
        >
          <ChevronLeft />
        </button>
        <h1 className="text-3xl font-bold mb-4">Diễn viên </h1>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
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
              setSearchParams({ page: "1" }); // 👈 reset về data ban đầu
            }}
          >
            Làm mới
          </button>
        )}
      </form>
      <div className="mt-4 justify-center flex items-center sticky top-[40px] z-10 w-full bg-base-100 py-2 mb-4">
        <Pagination page={page} total={totalPages} initialPage={page} />
      </div>
      {/* Actor list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-4 px-6">
        {actors?.actors?.length === 0 ? (
          <div className="text-center col-span-full py-10 text-gray-500">
            Không tìm thấy diễn viên nào.
          </div>
        ) : (
          actors?.actors?.map((actor: Actor) => (
            <Link
              to={"/actor-movie?actor=" + actor.name}
              key={actor.id}
              className="card card-compact bg-base-100 card-bordered  cursor-pointer group"
            >
              <figure>
                <img
                  src={
                    actor.image.url.includes("default")
                      ? "https://cdn-icons-png.flaticon.com/128/1814/1814294.png"
                      : actor.image.url
                  }
                  alt={actor.name}
                  className="rounded-full w-full h-full"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title group-hover:text-primarys">
                  {actor.name}
                </h2>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Pagination */}
    </div>
  );
}
