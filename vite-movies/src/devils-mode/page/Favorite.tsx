import { useAppStore } from "../../zustand/appState";
import { MediaListVietSub, MediaList } from "../components/MediaList";

const FavouriteScreen = () => {
  const { likeVideos, likeVietSubs } = useAppStore();

  return (
    <div className="px-6 pt-20 min-h-screen flex flex-col">
      <div>
        <span className="text-3xl font-bold">Phim đã thích</span>
      </div>
      <div className="flex flex-row flex-wrap gap-4 mt-4">
        {likeVideos?.map((item) => (
          <MediaList m={item} key={item.slug} />
        ))}
        {likeVietSubs?.map((item) => (
          <MediaListVietSub m={item} key={item.slug} />
        ))}
      </div>
    </div>
  );
};

export default FavouriteScreen;
