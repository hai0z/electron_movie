import { Link, useParams } from "react-router-dom";
import { List, MovieDetailResult } from "../types/movieDetail";
import { useEffect, useRef, useState } from "react";

import { HomeResult } from "../types";
import { decode } from "html-entities";
import Loading from "../../common/Loading";
import { useAppStore } from "../../zustand/appState";
import { FaLightbulb } from "react-icons/fa";
import { useHistoryStore } from "../../zustand/useHistoryStore";

const OldMovieDetail = () => {
  const params = useParams();

  const electron = (window as any).electron;

  const [movie, setMovie] = useState({} as List);

  const [loading, setLoading] = useState(false);

  const { lightOff, setLightOff } = useAppStore();

  const { addToHistory } = useHistoryStore();

  let movieDataRef = useRef({});
  let timerRef = useRef(0);
  const getMovieDetail = async () => {
    setLoading(true);
    electron.ipcRenderer.send("get-movie-detail-old", params.id);
    electron.ipcRenderer.on(
      "movie-detail-old",
      (data: { details: MovieDetailResult; related: HomeResult["list"] }) => {
        setMovie(data.details.list[0]);
        setLoading(false);
        movieDataRef.current = {
          id: String(data.details.list[0].id),
          thumbnail: data.details.list[0].thumb_url,
          type: "old",
          title: data.details.list[0].origin_name,
        };
        addToHistory(movieDataRef.current as any);
      }
    );
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
      className="w-full min-h-screen flex-1 pr-4 pb-20"
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
          </div>
          <div className="flex flex-row items-center mt-4 gap-x-4">
            {movie?.quality && (
              <div className="badge badge-primary">{movie.quality}</div>
            )}
            {movie?.time && (
              <div className="badge badge-secondary">{movie.time}</div>
            )}

            {movie?.year && (
              <div className="badge badge-error">{movie.year}</div>
            )}
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
    </div>
  );
};

export default OldMovieDetail;
