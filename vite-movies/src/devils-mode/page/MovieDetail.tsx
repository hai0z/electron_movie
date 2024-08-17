import { Link, useParams } from "react-router-dom";
import { MovieDetailResult } from "../types/movieDetail";
import { useEffect, useState } from "react";

import { HomeResult } from "../types";
import LikeButton from "../components/LikeButton";
import { MovieCard1 } from "../components/MovieCard";
import { decode } from "html-entities";
import Loading from "../../common/Loading";
import { useAppStore } from "../../zustand/appState";
import { FaLightbulb } from "react-icons/fa";

const MovieDetail = () => {
  const params = useParams();

  const electron = (window as any).electron;

  const [movie, setMovie] = useState({} as MovieDetailResult["list"][0]);

  const [relatedMovies, setRelatedMovies] = useState({} as HomeResult["list"]);

  const [loading, setLoading] = useState(false);

  const { lightOff, setLightOff } = useAppStore();

  const getMovieDetail = async () => {
    setLoading(true);
    electron.ipcRenderer.send("get-movie-detail", params.id);
    console.log(params.id);
    electron.ipcRenderer.on(
      "movie-detail",
      (data: { details: MovieDetailResult; related: HomeResult["list"] }) => {
        setMovie(data.details.list[0]);
        setRelatedMovies(data.related);
        setLoading(false);
      }
    );
  };

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
    return <Loading />;
  }

  return (
    <div
      className="w-full min-h-screen flex-1 pt-[72px] px-6 pb-20"
      id="#top"
      style={{
        backgroundColor: lightOff ? "#000000" : "oklch(var(--b1))",
      }}
    >
      <div className={`breadcrumbs text-sm ${lightOff && "hidden"}`}>
        <ul>
          <li>
            <Link to={"/"}>Trang chủ</Link>
          </li>
          <li>Phim</li>
          <li className="line-clamp-1">{movie?.slug}</li>
        </ul>
      </div>
      <div className={`breadcrumbs text-sm ${!lightOff && "hidden"}`}>
        <ul>
          <li>" "</li>
        </ul>
      </div>
      <iframe
        allowFullScreen
        src={movie?.episodes?.["server_data"]?.Full?.link_embed}
        className="w-full h-[calc(100vh-140px)]"
      />
      <div className="flex flex-row justify-end">
        <button
          className={`btn btn-sm ${
            lightOff && "opacity-80 hover:opacity-100"
          } mt-4`}
          onClick={() => {
            setLightOff(!lightOff);
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
        >
          {lightOff ? (
            <FaLightbulb className="text-warning" />
          ) : (
            <FaLightbulb />
          )}
          {lightOff ? "Bật đèn" : "Tắt đèn"}
        </button>
      </div>
      <div className={`w-full flex flex-row mt-4 ${lightOff && "hidden"}`}>
        <img
          src={movie?.poster_url}
          className="object-cover w-[400px] h-[300px] rounded-3xl"
        />
        <div className="ml-4">
          <div className="flex flex-row justify-between items-center">
            <div className="mr-8 flex-1">
              <h1 className="font-bold text-4xl">{decode(movie?.name)}</h1>
            </div>
            <LikeButton movie={movie} />
          </div>
          <div className="flex flex-row items-center mt-4 gap-x-4">
            <div className="badge badge-primary">{movie?.quality}</div>
            <div className="badge badge-secondary">{movie?.time}</div>
            <div className="badge badge-neutral">{movie?.tag}</div>
            <div className="badge badge-error">{movie?.year}</div>
          </div>
          <div className="mt-4">
            <p
              className="text-justify"
              dangerouslySetInnerHTML={{ __html: movie?.description }}
            ></p>
          </div>
          <div className="mt-2 flex flex-col gap-y-2">
            <span>Trạng thái: {movie?.status}</span>
            <span>
              Thể loại:{" "}
              {movie?.category?.map((c, i) => {
                return (
                  <Link
                    to={"/category/5/" + `${c}` + "/" + c}
                    className={"text-primarys"}
                    key={i}
                  >
                    {c}
                    {i < movie?.category.length - 1 ? ", " : ""}
                  </Link>
                );
              })}
            </span>
            <span>
              Quốc gia:{" "}
              {movie?.country?.map((c, i) => {
                return (
                  <Link
                    to={"/category/5/" + `${c}` + "/" + c}
                    className={"text-primarys"}
                    key={i}
                  >
                    {c}
                    {i < movie?.country?.length - 1 ? ", " : ""}
                  </Link>
                );
              })}
            </span>
            <span>Đạo diễn: {movie?.director}</span>
            <span>
              Diễn viên:{" "}
              {movie?.actor?.map((c, i) => {
                return (
                  <Link
                    to={
                      c === "Updating" ? "#" : "/category/5/" + `${c}` + "/" + c
                    }
                    className={c === "Updating" ? "" : "text-primarys"}
                    key={i}
                  >
                    {c}
                    {i < movie?.category.length - 1 ? ", " : ""}
                  </Link>
                );
              })}
            </span>
          </div>
        </div>
      </div>

      <div className={`mt-4 ${lightOff && "hidden"}`}>
        <span className="font-bold text-3xl">Có thể bạn sẽ thích</span>
        <div className="flex flex-row flex-wrap gap-4 mt-4">
          {relatedMovies.length > 0 &&
            relatedMovies?.map((e) => {
              return <MovieCard1 m={e} key={e.slug} />;
            })}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
