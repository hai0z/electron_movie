import { Link, useParams } from "react-router-dom";
import { MovieDetailResult } from "../types/movieDetail";
import { useEffect, useState } from "react";
import slugify from "slugify";
import { FaLightbulb } from "react-icons/fa";
import m from "../service/MovieService";
import { HomeResult } from "../types";
import LikeButton from "../components/LikeButton";
import Loading from "../../common/Loading";
import { useAppStore } from "../../zustand/appState";
import MediaList from "../components/MediaList";

const MovieDetail = () => {
  const params = useParams();

  const [movie, setMovie] = useState({} as MovieDetailResult);

  const [relatedMovies, setRelatedMovies] = useState({} as HomeResult);

  const [ep, setEp] = useState(
    {} as MovieDetailResult["movie"]["episodes"][0]["items"][0]
  );

  const { lightOff, setLightOff } = useAppStore();
  const [loading, setLoading] = useState(true);

  const getMovieDetail = async () => {
    setLoading(true);
    try {
      const [res, res1] = await Promise.all([
        m.getMovieDetail(params.id!),
        m.getRandomVideo(),
      ]);

      setMovie(res);
      if (res.movie.current_episode !== "Trailer") {
        setEp(res.movie.episodes[0].items[0]);
      }
      setRelatedMovies(res1);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEp = (
    e: MovieDetailResult["movie"]["episodes"][0]["items"][0]
  ) => {
    setEp(e);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    getMovieDetail();
  }, [params.id]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
      <div className="flex flex-row justify-between items-center">
        <div className={`breadcrumbs text-sm ${lightOff && "hidden"}`}>
          <ul>
            <li>
              <Link to={"/"}>Trang chủ</Link>
            </li>
            <li>Phim</li>
            <li>{movie?.movie?.name}</li>
          </ul>
        </div>
        <div className={`breadcrumbs text-sm ${!lightOff && "hidden"}`}>
          <ul>
            <li>" "</li>
          </ul>
        </div>
      </div>
      <iframe
        allowFullScreen
        src={ep.embed}
        className="w-full h-[calc(100vh-140px)]"
      />
      <div className="flex flex-row justify-end items-center">
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
          src={movie?.movie?.poster_url}
          className="object-cover w-[400px] h-[300px] rounded-3xl"
        />
        <div className="ml-4">
          <div className="flex flex-row justify-between items-center">
            <div className="mr-8 flex-1">
              <h1 className="font-bold text-4xl">
                {movie?.movie?.name} - Tập {ep.name}
              </h1>
            </div>
            <LikeButton movie={movie?.movie} />
          </div>
          <div className="flex flex-row items-center mt-4 gap-x-4">
            <div className="badge badge-primary">
              {movie?.movie?.category["1"]["list"][0].name}
            </div>
            <div className="badge badge-secondary">
              {movie?.movie?.category["3"]["list"].map((c) => c.name)}
            </div>
            <div className="badge badge-error">{movie?.movie?.time}</div>
            <div className="badge badge-neutral">{movie?.movie?.quality}</div>
          </div>
          <div className="mt-4">
            <p
              className="text-justify"
              dangerouslySetInnerHTML={{ __html: movie?.movie?.description }}
            ></p>
          </div>
          <div className="mt-2 flex flex-col gap-y-2">
            <span>
              Trạng thái: {movie?.movie?.current_episode} (
              {movie?.movie?.total_episodes} tập)
            </span>
            <span>
              Thể loại:{" "}
              {movie?.movie?.category["2"]["list"].map((c, i) => {
                return (
                  <Link
                    to={
                      "/category/3/" +
                      slugify(c.name, {
                        lower: true,
                        replacement: "-",
                        locale: "vi",
                      }) +
                      "/" +
                      c.name
                    }
                    className={"text-primarys"}
                    key={i}
                  >
                    {c.name}
                    {i < movie?.movie?.category["2"]["list"].length - 1
                      ? ", "
                      : ""}
                  </Link>
                );
              })}
            </span>
            <span>
              Quốc gia:{" "}
              {movie?.movie?.category["4"]["list"].map((c, i) => {
                return (
                  <Link
                    to={
                      "/category/4/" +
                      slugify(c.name, {
                        lower: true,
                        replacement: "-",
                        locale: "vi",
                      }) +
                      "/" +
                      c.name
                    }
                    className={"text-primarys"}
                    key={i}
                  >
                    {c.name}
                    {i < movie?.movie?.category["4"]["list"].length - 1
                      ? ", "
                      : ""}
                  </Link>
                );
              })}
            </span>
            <span>Đạo diễn: {movie?.movie?.director}</span>
            <span>Diễn viên: {movie?.movie?.casts} </span>
          </div>
        </div>
      </div>
      <div className={`mt-4 ${lightOff && "hidden"}`}>
        {movie.movie.current_episode !== "Trailer" &&
          movie?.movie?.episodes?.map((e) => {
            return (
              <div key={e.server_name} className="mt-4">
                <div className="my-3 font-bold">{e.server_name}</div>
                <div className="flex flex-row flex-wrap gap-4">
                  {e.items.map((i) => {
                    return (
                      <div
                        onClick={() => handleChangeEp(i)}
                        className={`btn btn-sm w-20 ${
                          ep.embed === i.embed && "btn-primary"
                        }`}
                        key={i.embed}
                      >
                        {i.name}{" "}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>
      <div className={`mt-4 ${lightOff && "hidden"}`}>
        <span className="font-bold text-3xl">Có thể bạn sẽ thích</span>
        <div className="flex flex-row flex-wrap gap-4 mt-4">
          {relatedMovies?.items?.map((e) => {
            return <MediaList m={e} key={e.slug} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
