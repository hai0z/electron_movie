import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "../components/Pagination";
import { VietSubCard } from "../components/VietSubCard";
import { Movie } from "../types/vietsub";
import { ChevronLeft } from "lucide-react";

export default function ActorMovie() {
  const [searchParams] = useSearchParams();

  const [movie, setMovie] = useState<any>([]);

  const page = Number(searchParams.get("page")) || 1;

  const query = searchParams.get("actor") || "";

  const [totalPages, setTotalPages] = useState(1);

  const limit = 30;

  const ipcRenderer = (window as any).electron.ipcRenderer;

  const navigate = useNavigate();

  const loadActors = () => {
    ipcRenderer.send("get-actor-movies", { page, limit, name: query });
  };

  useEffect(() => {
    ipcRenderer.on("get-actor-movies-result", (result: any) => {
      setMovie(JSON.parse(result));
      setTotalPages(JSON.parse(result).page.last_page);
    });

    loadActors(); // initial load

    window.scrollTo({
      left: 0,
      top: 0,
      behavior: "smooth",
    });
  }, [page, query]);

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
        <h1 className="text-3xl font-bold mb-4">Diễn viên {query} </h1>
      </div>

      {/* Search */}

      <div className="mt-4 justify-center flex items-center sticky top-[40px] z-10 w-full bg-base-100 py-2 mb-4">
        <Pagination page={page} total={totalPages} initialPage={page} />
      </div>
      {/* Actor list */}
      <div className="flex flex-row flex-wrap px-6 gap-4">
        {movie?.movies?.length === 0 ? (
          <div className="text-center col-span-full py-10 text-gray-500">
            Không tìm thấy diễn viên nào.
          </div>
        ) : (
          movie?.movies?.map((movie: Movie) => (
            <VietSubCard m={movie} key={movie.id} />
          ))
        )}
      </div>

      {/* Pagination */}
    </div>
  );
}
