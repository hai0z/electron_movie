import MediaList from "../components/MediaList";
import { useAppStore } from "../../zustand/appState";

const FavouriteScreen = () => {
  const { likedAnglesMovies } = useAppStore();

  return (
    <div className="px-6 pt-20">
      <div>
        <span className="text-3xl font-bold">Phim đã thích</span>
      </div>
      <div className="flex flex-row flex-wrap gap-4 mt-4">
        {likedAnglesMovies?.map((item) => (
          <MediaList m={item} key={item.slug} />
        ))}
      </div>
    </div>
  );
};

export default FavouriteScreen;
