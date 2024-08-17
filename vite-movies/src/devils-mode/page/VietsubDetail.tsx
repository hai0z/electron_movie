import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import LikeButton from "../components/LikeButton";
import { Movie, VietSubResult } from "../types/vietsub";
import Loading from "../../common/Loading";
import { MediaListVietSub } from "../components/MediaList";
import { useAppStore } from "../../zustand/appState";
import { FaLightbulb } from "react-icons/fa";

const VietSubDetails = () => {
  const params = useParams();

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
  const getMovieDetail = async () => {
    setLoading(true);
    const [res, res1] = await Promise.all([
      fetch("https://xxvnapi.com/api/phim/" + params.id),
      fetch(
        "https://xxvnapi.com/api/phim-moi-cap-nhat?page=" +
          Math.floor(Math.random() * 160 + 1)
      ),
    ]).finally(() => setLoading(false));

    const data = await res.json();
    const data1: VietSubResult = await res1.json();
    setMovie(data.movie as any);
    setEp(data.movie.episodes[0].server_data[0]);
    setRelatedMovies(data1.movies.slice(0, 10));
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
          <li className="line-clamp-1">{movie?.name}</li>
        </ul>
      </div>
      <div className={`breadcrumbs text-sm ${!lightOff && "hidden"}`}>
        <ul>
          <li>" "</li>
        </ul>
      </div>
      <iframe
        allowFullScreen
        src={ep?.link}
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
          src={movie?.thumb_url}
          className="object-cover w-[400px] h-[300px] rounded-3xl"
        />
        <div className="ml-4">
          <div className="flex flex-row justify-between items-center">
            <div className="mr-8 flex-1">
              <h1 className="font-bold text-4xl">{movie?.name}</h1>
            </div>
            <LikeButton movie={movie} type="vietsub" />
          </div>
          <div className="flex flex-row items-center mt-4 gap-x-4">
            <div className="badge badge-primary">{movie?.quality}</div>
            <div className="badge badge-secondary">{movie?.time}</div>
            {movie?.lang && (
              <div className="badge badge-accent">{movie?.lang}</div>
            )}
            {movie?.status && (
              <div className="badge badge-info">{movie?.status}</div>
            )}
          </div>
          <div className="mt-4">
            <p
              className="text-justify"
              dangerouslySetInnerHTML={{ __html: movie?.content }}
            ></p>
          </div>
          <div className="mt-2 flex flex-col gap-y-2">
            <span>Trạng thái: {movie?.status}</span>
            <span>
              Thể loại:{" "}
              {movie?.categories?.map((c, i) => {
                return (
                  <span key={i}>
                    {c.name}
                    {i < movie?.categories.length - 1 ? ", " : ""}
                  </span>
                );
              })}
            </span>
            <span>Quốc gia: {movie?.country?.name}</span>
            <span>Diễn viên: {movie?.actors} </span>
          </div>
        </div>
      </div>
      <div className={`mt-4 ${lightOff && "hidden"}`}>
        {movie?.episodes?.map((e) => {
          return (
            <div key={e.server_name} className="mt-4">
              <div className="my-3 font-bold">{e.server_name}</div>
              <div className="flex flex-row flex-wrap gap-4">
                {e.server_data.map((i) => {
                  return (
                    <div
                      onClick={() => handleChangeEp(i)}
                      className={`btn btn-sm w-20 ${
                        ep.link === i.link && "btn-primary"
                      }`}
                      key={i.slug}
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
          {relatedMovies.length > 0 &&
            relatedMovies?.map((e) => {
              return <MediaListVietSub m={e} key={e.slug} />;
            })}
        </div>
      </div>
    </div>
  );
};

export default VietSubDetails;
