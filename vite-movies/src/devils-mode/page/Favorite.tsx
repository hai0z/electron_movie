import { useEffect, useState } from "react";
import { useAppStore } from "../../zustand/appState";
import { MediaListVietSub, MediaList } from "../components/MediaList";
import OtherCard from "../components/OtherCard";
import { Post } from "../types/other";
import { HeartOff } from "lucide-react";
import OtherSourceModal from "../components/OtherSourceModal";
import { useSearchParams } from "react-router-dom";
import { ActorCard } from "./Actor";

const FavouriteScreen = () => {
  const { likeVideos, likeVietSubs, otherLike, likeActor } = useAppStore();
  const [post, setPost] = useState<Post>();
  const [searchParams, setSearchParams] = useSearchParams();

  console.log(likeActor);
  // tab mặc định là VIP nếu không có trong URL
  const activeTab = (searchParams.get("tab") || "VIP") as
    | "VIP"
    | "AVDB"
    | "OTHER"
    | "ACTOR";

  const handleTabChange = (tab: "VIP" | "AVDB" | "OTHER" | "ACTOR") => {
    setSearchParams({ tab });
  };

  if (
    !likeVideos?.length &&
    !likeVietSubs?.length &&
    !otherLike?.length &&
    !likeActor?.length
  ) {
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

  useEffect(() => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  }, [activeTab]);
  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* Tabs header */}
      <div className="flex gap-4 border-b pb-2 mb-4 sticky top-10 z-50 bg-base-100 w-full">
        <button
          onClick={() => handleTabChange("VIP")}
          className={`px-4 py-2 font-semibold ${
            activeTab === "VIP"
              ? "border-b-2 border-primarys text-primarys"
              : "text-gray-500"
          }`}
        >
          XXVN
        </button>
        <button
          onClick={() => handleTabChange("AVDB")}
          className={`px-4 py-2 font-semibold ${
            activeTab === "AVDB"
              ? "border-b-2 border-primarys text-primarys"
              : "text-gray-500"
          }`}
        >
          AVDB
        </button>
        <button
          onClick={() => handleTabChange("OTHER")}
          className={`px-4 py-2 font-semibold ${
            activeTab === "OTHER"
              ? "border-b-2 border-primarys text-primarys"
              : "text-gray-500"
          }`}
        >
          OTHER SOURCE
        </button>
        <button
          onClick={() => handleTabChange("ACTOR")}
          className={`px-4 py-2 font-semibold ${
            activeTab === "ACTOR"
              ? "border-b-2 border-primarys text-primarys"
              : "text-gray-500"
          }`}
        >
          DIỄN VIÊN
        </button>
      </div>

      {/* Tab content */}
      {activeTab === "AVDB" && likeVideos && likeVideos.length > 0 && (
        <div className="flex flex-row flex-wrap gap-4 px-6">
          {likeVideos.map((item) => (
            <MediaList m={item} key={item.slug} />
          ))}
        </div>
      )}

      {activeTab === "VIP" && likeVietSubs && likeVietSubs.length > 0 && (
        <div className="flex flex-row flex-wrap gap-4 px-6">
          {likeVietSubs.map((item) => (
            <MediaListVietSub m={item} key={item.slug} />
          ))}
        </div>
      )}

      {activeTab === "OTHER" && otherLike && otherLike.length > 0 && (
        <div className="flex flex-row flex-wrap gap-4 px-6">
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
      )}

      {activeTab === "ACTOR" && likeActor && likeActor.length > 0 && (
        <div className="flex flex-row flex-wrap gap-4 px-6">
          {likeActor.map((item) => (
            <ActorCard actor={item} key={item.id} />
          ))}
        </div>
      )}
      <OtherSourceModal post={post} onClose={() => setPost(undefined)} />
    </div>
  );
};

export default FavouriteScreen;
