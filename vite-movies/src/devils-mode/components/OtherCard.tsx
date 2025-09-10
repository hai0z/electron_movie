import { motion } from "framer-motion";
import { Post } from "../types/other";
import { useAppStore } from "../../zustand/appState";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import toast from "react-hot-toast";

interface IProps {
  m: Post;
  onClick: () => void;
}
function OtherCard({ m, onClick }: IProps) {
  const otherLike = useAppStore((state) => state.otherLike);
  const isLike = otherLike.findIndex((i) => i.post_id === m.post_id) !== -1;

  const setOtherLike = useAppStore((state) => state.setOtherLike);
  const toggleLike = () => {
    if (isLike) {
      setOtherLike(otherLike.filter((i) => i.post_id !== m.post_id));
      toast.error("Đã xoá khỏi yêu thích");
    } else {
      setOtherLike([m, ...otherLike]);
      toast.success("Đã thêm vào yêu thích");
    }
  };
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
      }}
      key={m.post_id}
      transition={{ duration: 0.5 }}
      layout
      className="transition-all duration-300 rounded-lg shadow-md cursor-pointer w-[23.5%] 2xl:w-[16.6%] bg-base-200 hover:ring-1 hover:ring-primarys hover:scale-[1.01] hover:shadow-primarys group card my-1 hover:bg-acshadow-primarys/10 card-compact"
    >
      <figure className="overflow-hidden rounded-t-lg">
        <div>
          <img
            onClick={onClick}
            src={m.post_thumbnail}
            alt="cast"
            loading="lazy"
            className="object-cover transition-all duration-300 h-40 w-96 hover:scale-110"
          />
        </div>
        <button
          onClick={toggleLike}
          className="absolute top-2 right-2 p-2 rounded-full bg-base-100 shadow-md hover:bg-primary/20 transition"
        >
          {isLike ? (
            <IoHeartSharp size={20} color="red" />
          ) : (
            <IoHeartOutline size={20} />
          )}
        </button>
      </figure>
      <div className="card-body" onClick={onClick}>
        <div>
          <p
            className="line-clamp-2 font-semibold"
            dangerouslySetInnerHTML={{ __html: m.post_title }}
          ></p>
        </div>
        <div>
          <p
            className="line-clamp-1 font-normal"
            dangerouslySetInnerHTML={{ __html: m.post_content }}
          ></p>
        </div>
      </div>
    </motion.div>
  );
}

export default OtherCard;
