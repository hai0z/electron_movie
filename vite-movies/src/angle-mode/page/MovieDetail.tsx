import { Link, useParams } from "react-router-dom";
import { Movie, MovieDetailResult } from "../types/movieDetail";
import { useEffect, useState } from "react";
import slugify from "slugify";
import { FaLightbulb } from "react-icons/fa";
import m from "../service/MovieService";
import { HomeResult } from "../types";
import LikeButton from "../components/LikeButton";
import Loading from "../../common/Loading";
import { useAppStore } from "../../zustand/appState";
import MediaList from "../components/MediaList";
import { useQuery } from "@tanstack/react-query";

const MovieDetail = () => {
  const params = useParams();

  const { data: movie, isLoading } = useQuery<MovieDetailResult>({
    queryKey: ["movie", params.id],
    queryFn: () => m.getMovieDetail(params.id!),
  });

  const [relatedMovies, setRelatedMovies] = useState({} as HomeResult);

  const [ep, setEp] = useState(
    () =>
      movie?.movie?.episodes[0]
        .items[0] as MovieDetailResult["movie"]["episodes"][0]["items"][0]
  );

  useEffect(() => {
    setEp(
      movie?.movie?.episodes[0]
        .items[0] as MovieDetailResult["movie"]["episodes"][0]["items"][0]
    );
  }, [isLoading]);

  const { lightOff, setLightOff } = useAppStore();

  const getMovieDetail = async () => {
    try {
      const res = await m.getRandomVideo();
      setRelatedMovies(res);
    } catch (error) {
      throw error;
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
  }, [params]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [params.id]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div
      className="w-full min-h-screen flex-1 pt-[72px] pb-20"
      id="#top"
      style={{
        backgroundColor: lightOff ? "#000000" : "oklch(var(--b1))",
      }}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row justify-between items-center mb-6">
          <div className={`breadcrumbs text-sm ${lightOff && "hidden"}`}>
            <ul>
              <li>
                <Link to={"/"} className="hover:text-primary transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>Phim</li>
              <li className="text-primary">{movie?.movie?.name}</li>
            </ul>
          </div>
          <div className={`breadcrumbs text-sm ${!lightOff && "hidden"}`}>
            <ul>
              <li>" "</li>
            </ul>
          </div>
        </div>

        <div className="relative">
          <iframe
            allowFullScreen
            src={ep?.embed}
            className="w-full h-[calc(100vh-140px)] rounded-xl shadow-lg"
          />
        </div>
        <div className="w-full justify-end flex">
          <button
            className={`mt-4 btn btn-sm gap-2 ${
              lightOff
                ? "btn-neutral opacity-80 hover:opacity-100"
                : "btn-ghost"
            }`}
            onClick={() => {
              setLightOff(!lightOff);
              window.scrollTo({
                top: 80,
                behavior: "smooth",
              });
            }}
          >
            <FaLightbulb className={lightOff ? "text-yellow-500" : ""} />
            {lightOff ? "Bật đèn" : "Tắt đèn"}
          </button>
        </div>
        <div className={`mt-8 ${lightOff && "hidden"}`}>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3">
              <img
                src={movie?.movie?.poster_url}
                className="w-full h-auto rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
                alt={movie?.movie?.name}
              />
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {movie?.movie?.name} - Tập {ep?.name}
                </h1>
                <LikeButton movie={movie?.movie as Movie} />
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                <div className="badge badge-primary badge-lg">
                  {movie?.movie?.category["1"]["list"][0]?.name}
                </div>
                <div className="badge badge-secondary badge-lg">
                  {movie?.movie?.category["3"]["list"].map((c) => c.name)}
                </div>
                <div className="badge badge-error badge-lg">
                  {movie?.movie?.time}
                </div>
                <div className="badge badge-neutral badge-lg">
                  {movie?.movie?.quality}
                </div>
              </div>

              <div className="prose prose-lg max-w-none mb-6">
                <p
                  className="text-justify"
                  dangerouslySetInnerHTML={{
                    __html: movie?.movie?.description as string,
                  }}
                />
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex gap-2">
                  <span className="font-semibold min-w-[100px]">
                    Trạng thái:
                  </span>
                  <span>
                    {movie?.movie?.current_episode} (
                    {movie?.movie?.total_episodes} tập)
                  </span>
                </div>

                <div className="flex gap-2">
                  <span className="font-semibold min-w-[100px]">Thể loại:</span>
                  <div className="flex flex-wrap gap-1">
                    {movie?.movie?.category["2"]["list"].map((c, i) => (
                      <Link
                        key={i}
                        to={`/category/3/${slugify(c.name, {
                          lower: true,
                          replacement: "-",
                          locale: "vi",
                        })}/${c.name}`}
                        className="hover:text-primary transition-colors"
                      >
                        {c.name}
                        {i < movie?.movie?.category["2"]["list"].length - 1
                          ? ", "
                          : ""}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <span className="font-semibold min-w-[100px]">Quốc gia:</span>
                  <div className="flex flex-wrap gap-1">
                    {movie?.movie?.category["4"]["list"].map((c, i) => (
                      <Link
                        key={i}
                        to={`/category/4/${slugify(c.name, {
                          lower: true,
                          replacement: "-",
                          locale: "vi",
                        })}/${c.name}`}
                        className="hover:text-primary transition-colors"
                      >
                        {c.name}
                        {i < movie?.movie?.category["4"]["list"].length - 1
                          ? ", "
                          : ""}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <span className="font-semibold min-w-[100px]">Đạo diễn:</span>
                  <span>{movie?.movie?.director}</span>
                </div>

                <div className="flex gap-2">
                  <span className="font-semibold min-w-[100px]">
                    Diễn viên:
                  </span>
                  <span>{movie?.movie?.casts}</span>
                </div>
              </div>
            </div>
          </div>

          {movie?.movie.current_episode !== "Trailer" && (
            <div className="mt-8">
              {movie?.movie?.episodes?.map((e) => (
                <div key={e.server_name} className="mb-6">
                  <h3 className="text-xl font-bold mb-4">{e.server_name}</h3>
                  <div className="flex flex-wrap gap-3">
                    {e.items.map((i) => (
                      <button
                        key={i?.embed}
                        onClick={() => handleChangeEp(i)}
                        className={`btn btn-sm min-w-[80px] ${
                          ep?.embed === i?.embed
                            ? "btn-primary"
                            : "btn-outline hover:btn-primary"
                        }`}
                      >
                        {i?.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Có thể bạn sẽ thích
            </h2>
            <div className="flex flex-wrap gap-4">
              {relatedMovies?.items?.map((e) => (
                <MediaList m={e} key={e.slug} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
