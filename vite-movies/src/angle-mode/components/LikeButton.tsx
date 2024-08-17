import { useAppStore } from "../../zustand/appState";
import { Movie } from "../types/movieDetail";

const LikeButton = ({ movie }: { movie: Movie }) => {
  const { likedAnglesMovies } = useAppStore();

  const toggleLike = () => {
    if (
      likedAnglesMovies.findIndex((item) => item.slug === movie.slug) !== -1
    ) {
      useAppStore
        .getState()
        .setLikedAnglesMovies(
          likedAnglesMovies.filter((item) => item.slug !== movie.slug)
        );
    } else {
      useAppStore
        .getState()
        .setLikedAnglesMovies([movie, ...likedAnglesMovies]);
    }
  };

  return (
    <button className="btn btn-accent btn-sm" onClick={toggleLike}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill={
          likedAnglesMovies.findIndex((item) => item.slug === movie.slug) !== -1
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
      {likedAnglesMovies.findIndex((item) => item.slug === movie.slug) !== -1
        ? "Đã Thêm vào yêu thích"
        : "Thêm vào yêu thích"}
    </button>
  );
};

export default LikeButton;
