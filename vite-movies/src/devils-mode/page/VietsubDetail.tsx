import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import LikeButton from "../components/LikeButton";
import { Movie, VietSubResult } from "../types/vietsub";
import Loading from "../../common/Loading";
import { MediaListVietSub } from "../components/MediaList";
import { useAppStore } from "../../zustand/appState";
import {
  FaLightbulb,
  FaPlay,
  FaStar,
  FaClock,
  FaGlobe,
  FaFilm,
} from "react-icons/fa";
import { useHistoryStore } from "../../zustand/useHistoryStore";
import { ChevronLeft } from "lucide-react";

const VietSubDetails = () => {
  const params = useParams();

  const navigation = useNavigate();
  const [movie, setMovie] = useState({} as Movie);

  const [relatedMovies, setRelatedMovies] = useState(
    {} as VietSubResult["movies"]
  );

  const [loading, setLoading] = useState(false);

  const { lightOff, setLightOff } = useAppStore();

  const [ep, setEp] = useState({} as Movie["episodes"][0]["server_data"][0]);

  const handleChangeEp = (e: Movie["episodes"][0]["server_data"][0]) => {
    setEp(e);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const { addToHistory } = useHistoryStore();

  let movieDataRef = useRef({});
  let timerRef = useRef(0);

  const getMovieDetail = async () => {
    setLoading(true);
    const [res, res1] = await Promise.all([
      fetch("https://xxvnapi.com/api/phim/" + params.id),
      fetch(
        "https://xxvnapi.com/api/phim-moi-cap-nhat?page=" +
          Math.floor(Math.random() * 350 + 1)
      ),
    ]).finally(() => setLoading(false));

    const data = await res.json();
    const data1: VietSubResult = await res1.json();
    setMovie(data.movie as any);
    setEp(data.movie.episodes[0].server_data[0]);
    setRelatedMovies(data1.movies.slice(0, 8));
    movieDataRef.current = {
      id: String(data.movie.slug),
      thumbnail: data.movie.thumb_url,
      type: "xxvn",
      title: data.movie.name,
      actor: data.movie.actors.join(","),
      tag: data.movie.categories.map((c: any) => c.slug).join(","),
    };
    addToHistory(movieDataRef.current as any);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      timerRef.current = timerRef.current + 1;
      addToHistory({
        ...movieDataRef.current,
        stayIn: timerRef.current,
      } as any);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [params.id]);

  useEffect(() => {
    getMovieDetail();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full">
        <Loading />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex-1 pt-[20px] pr-4"
      style={{
        backgroundColor: lightOff ? "#000000" : "oklch(var(--b1))",
      }}
    >
      <button
        onClick={() => navigation(-1)}
        className="btn btn-ghost btn-circle mb-2 btn-sm"
        title="Quay lại"
        style={{
          visibility: lightOff ? "hidden" : "visible",
        }}
      >
        <ChevronLeft />
      </button>
      {/* Light Toggle Button */}
      <div className="fixed top-20 right-10 z-50">
        <button
          className="btn btn-circle btn-sm"
          onClick={() => {
            setLightOff(!lightOff);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          title={lightOff ? "Bật đèn" : "Tắt đèn"}
        >
          <FaLightbulb className={lightOff ? "text-warning" : ""} />
        </button>
      </div>

      {/* Video Player Section */}
      <div className="relative w-full bg-black">
        <iframe
          allowFullScreen
          src={ep?.link}
          className="w-full h-[calc(100vh-140px)]"
        />
      </div>

      {/* Main Content */}
      <div className="container py-8">
        {/* Breadcrumbs */}
        <div className={`text-sm breadcrumbs mb-6 ${lightOff ? "hidden" : ""}`}>
          <ul>
            <li>
              <Link to={"/"}>Trang chủ</Link>
            </li>
            <li>Phim</li>
            <li className="line-clamp-1">{movie?.name}</li>
          </ul>
        </div>

        {/* Movie Info Section */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-3 gap-8 ${
            lightOff ? "hidden" : ""
          }`}
        >
          {/* Poster and Basic Info */}
          <div className="lg:col-span-1">
            <div className="relative group">
              <img
                src={movie?.thumb_url}
                className="w-full rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105"
                alt={movie?.name}
              />
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex flex-wrap gap-2">
                <div className="badge badge-primary gap-2">
                  <FaStar /> {movie?.quality}
                </div>
                <div className="badge badge-secondary gap-2">
                  <FaClock /> {movie?.time}
                </div>
                {movie?.lang && (
                  <div className="badge badge-accent gap-2">
                    <FaGlobe /> {movie?.lang}
                  </div>
                )}
                {movie?.status && (
                  <div className="badge badge-info gap-2">
                    <FaFilm /> {movie?.status}
                  </div>
                )}
              </div>

              <LikeButton movie={movie} type="vietsub" />
            </div>
          </div>

          {/* Movie Details */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-4xl font-bold">{movie?.name}</h1>
            </div>

            <div className="prose max-w-none mb-8">
              <div dangerouslySetInnerHTML={{ __html: movie?.content }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="card bg-base-200">
                <div className="card-body">
                  <h3 className="card-title">Thông tin phim</h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-semibold">Trạng thái:</span>{" "}
                      {movie?.status}
                    </p>
                    <p>
                      <span className="font-semibold">Thể loại:</span>{" "}
                      {movie?.categories?.map((c, i) => (
                        <span key={i}>
                          {c.name}
                          {i < movie?.categories.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </p>
                    <p>
                      <span className="font-semibold">Quốc gia:</span>{" "}
                      {movie?.country?.name}
                    </p>
                    <p>
                      <span className="font-semibold">Diễn viên:</span>{" "}
                      {movie?.actors?.map((name, idx) => (
                        <Link
                          key={idx}
                          to={`/actor-movie?actor=${name}`}
                          className="text-blue-500 hover:underline"
                        >
                          {name},
                        </Link>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Episodes Section */}
            <div className="space-y-6">
              {movie?.episodes?.map((e) => (
                <div key={e.server_name} className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">{e.server_name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {e.server_data.map((i) => (
                        <button
                          onClick={() => handleChangeEp(i)}
                          className={`btn btn-sm ${
                            ep.link === i.link ? "btn-primary" : "btn-ghost"
                          }`}
                          key={i.slug}
                        >
                          <FaPlay className="mr-2" />
                          {i.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Movies Section */}
        <div className={`mt-12 ${lightOff ? "hidden" : ""}`}>
          <h2 className="text-3xl font-bold mb-6">Có thể bạn sẽ thích</h2>
          <div className="flex flex-row flex-wrap gap-4">
            {relatedMovies.length > 0 &&
              relatedMovies?.map((e) => (
                <MediaListVietSub m={e} key={e.slug} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VietSubDetails;
