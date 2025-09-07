import { useEffect, useRef } from "react";
import { useHistoryStore } from "../../zustand/useHistoryStore";
import { Post } from "../types/other";
import { useAppStore } from "../../zustand/appState";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";

const OtherSourceModal = ({
  post,
  onClose,
}: {
  post: Post | undefined;
  onClose: () => void;
}) => {
  const { addToHistory } = useHistoryStore();
  const otherLike = useAppStore((state) => state.otherLike);
  const isLike = otherLike.findIndex((i) => i.post_id === post?.post_id) !== -1;

  const setOtherLike = useAppStore((state) => state.setOtherLike);

  let timerRef = useRef(0);

  const toggleLike = () => {
    if (isLike) {
      setOtherLike(otherLike.filter((i) => i.post_id !== post?.post_id));
    } else {
      setOtherLike([post!, ...otherLike]);
    }
  };

  useEffect(() => {
    if (post) {
      addToHistory({
        id: String(post.post_id),
        thumbnail: post.post_thumbnail,
        type: "other",
        title: post.post_title,
        otherData: post,
        actor: post.post_actor,
        tag: post.post_tag,
      });
    }
  }, [post, addToHistory]);

  useEffect(() => {
    if (!post) return;

    timerRef.current = 0; // reset khi đổi post

    const timer = setInterval(() => {
      timerRef.current = timerRef.current + 1;

      addToHistory({
        id: String(post.post_id),
        thumbnail: post.post_thumbnail,
        type: "other",
        title: post.post_title,
        otherData: post,
        stayIn: timerRef.current,
        actor: post.post_actor,
        tag: post.post_tag,
      });
    }, 1000);

    return () => clearInterval(timer); // cleanup đúng
  }, [post, addToHistory]); // chạy lại khi đổi post

  return (
    <dialog id="video_modal" className="modal">
      <div className="modal-box max-w-5xl w-full p-0 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h3 className="font-bold text-lg line-clamp-1">{post?.post_title}</h3>
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
          <button
            onClick={toggleLike}
            className=" p-2 rounded-full bg-base-300 shadow-md hover:bg-primary/50 transition"
          >
            {isLike ? (
              <IoHeartSharp size={20} color="red" />
            ) : (
              <IoHeartOutline size={20} />
            )}
          </button>
          <form method="dialog">
            <button className="btn btn-sm" onClick={onClose}>
              Đóng
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default OtherSourceModal;
