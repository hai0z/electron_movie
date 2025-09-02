import { useState } from "react";
import { useAppStore } from "../../zustand/appState";
import { MediaListVietSub, MediaList } from "../components/MediaList";
import OtherCard from "../components/OtherCard";
import { Post } from "../types/other";
import { HeartOff } from "lucide-react";

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

      <dialog id="video_modal" className="modal">
        <div className="modal-box max-w-5xl w-full p-0 overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 border-b">
            <h3 className="font-bold text-lg line-clamp-1">
              {post?.post_title}
            </h3>
          </div>

          {/* Iframe player */}
          <div className="w-full aspect-video bg-black">
            <iframe
              src={post?.post_stream}
              title={post?.post_title}
              className="w-full h-full"
              allowFullScreen
            />
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t flex justify-between items-center">
            <span className="text-sm opacity-70">{post?.post_actor}</span>
            <form method="dialog">
              <button className="btn btn-sm" onClick={() => setPost(undefined)}>
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default FavouriteScreen;
