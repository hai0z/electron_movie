import { useAppStore } from "../../zustand/appState";
import { List } from "../types/movieDetail";
import { Movie } from "../types/vietsub";

const LikeButton = ({
  movie,
  type,
}: {
  movie: List | Movie;
  type?: string;
}) => {
  const { likeVideos, likeVietSubs } = useAppStore();
  const toggleLike = () => {
    if (type === "vietsub") {
      if (likeVietSubs.findIndex((item) => item.slug === movie.slug) !== -1) {
        useAppStore
          .getState()
          .setLikeVietSubs(
            likeVietSubs.filter((item) => item.slug !== movie.slug)
          );
      } else {
        useAppStore
          .getState()
          .setLikeVietSubs([movie as Movie, ...likeVietSubs]);
      }
    } else {
      if (likeVideos.findIndex((item) => item.id === movie.id) !== -1) {
        useAppStore
          .getState()
          .setLikeVideos(likeVideos.filter((item) => item.id !== movie.id));
      } else {
        useAppStore.getState().setLikeVideos([movie as List, ...likeVideos]);
      }
    }
  };

  return (
    <button className="btn btn-accent btn-sm" onClick={toggleLike}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill={
          type === "vietsub"
            ? likeVietSubs.findIndex((item) => item.slug === movie.slug) !== -1
              ? "red"
              : "none"
            : likeVideos.findIndex((item) => item.id === movie.id) !== -1
            ? "red"
            : "none"
        }
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      {type === "vietsub"
        ? likeVietSubs.findIndex((item) => item.slug === movie.slug) !== -1
          ? "Đã Thêm vào yêu thích"
          : "Thêm vào yêu thích"
        : likeVideos.findIndex((item) => item.id === movie.id) !== -1
        ? "Đã Thêm vào yêu thích"
        : "Thêm vào yêu thích"}
    </button>
  );
};

export default LikeButton;
