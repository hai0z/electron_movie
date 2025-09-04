import { useState } from "react";
import { useAppStore } from "../../zustand/appState";
import { MediaListVietSub, MediaList } from "../components/MediaList";
import OtherCard from "../components/OtherCard";
import { Post } from "../types/other";
import { HeartOff } from "lucide-react";
import OtherSourceModal from "../components/OtherSourceModal";

const FavouriteScreen = () => {
  const { likeVideos, likeVietSubs, otherLike } = useAppStore();
  const [post, setPost] = useState<Post>();

  if (!likeVideos?.length && !likeVietSubs?.length && !otherLike?.length) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-[80vh]">
        <div className="flex flex-col items-center justify-center mt-20">
          <HeartOff size={64} className="mb-4" />
          <p className="text-2xl font-semibold">
            😢 Bạn chưa có mục yêu thích nào
          </p>
          <p className="text-sm mt-2">
            Hãy thêm một vài video để danh sách trông sinh động hơn nhé!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 pt-20 min-h-screen flex flex-col">
      {likeVideos && likeVideos.length > 0 && (
        <>
          <div>
            <span className="text-3xl font-bold">AVDB</span>
          </div>
          <div className="flex flex-row flex-wrap gap-4 mt-4">
            {likeVideos.map((item) => (
              <MediaList m={item} key={item.slug} />
            ))}
          </div>
          <div className="divider"></div>
        </>
      )}

      {likeVietSubs && likeVietSubs.length > 0 && (
        <>
          <div>
            <span className="text-3xl font-bold">VIP</span>
          </div>
          <div className="flex flex-row flex-wrap gap-4 mt-4">
            {likeVietSubs.map((item) => (
              <MediaListVietSub m={item} key={item.slug} />
            ))}
          </div>
          <div className="divider"></div>
        </>
      )}

      {otherLike && otherLike.length > 0 && (
        <>
          <div>
            <span className="text-3xl font-bold">OTHER SOURCE</span>
          </div>
          <div className="flex flex-row flex-wrap gap-4 mt-4">
            {otherLike.map((item) => (
              <OtherCard
                m={item}
                key={item.post_id}
                onClick={() => {
                  setPost(item);
                  (document.getElementById("video_modal") as any)?.showModal();
                }}
              />
            ))}
          </div>
        </>
      )}

      <OtherSourceModal post={post} onClose={() => setPost(undefined)} />
    </div>
  );
};

export default FavouriteScreen;
