import { motion } from "framer-motion";
import { useAppStore } from "../../zustand/appState";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import toast from "react-hot-toast";
import { Hentai } from "../types/Hentai";

function HentaiMovieCard({ m }: { m: Hentai }) {
  const likeHentai = useAppStore((state) => state.likeHentais);

  const isLike = likeHentai.findIndex((i) => i.id === m.id) !== -1;

  const ipcRenderer = (window as any).electron.ipcRenderer;

  const setlikeHentai = useAppStore((state) => state.setLikeHentais);

  const toggleLike = () => {
    if (isLike) {
      setlikeHentai(likeHentai.filter((i) => i.id !== m.id));
      toast.error("Đã xoá khỏi yêu thích");
    } else {
      setlikeHentai([m, ...likeHentai]);
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
      key={m.slug}
      transition={{ duration: 0.5 }}
      className="transition-all duration-300 rounded-lg shadow-md cursor-pointer w-[23.5%] 2xl:w-[16.6%] bg-base-200 hover:ring-1 hover:ring-primarys hover:scale-[1.01] hover:shadow-primarys group card my-1 hover:bg-acshadow-primarys/10 card-compact"
    >
      <figure className="overflow-hidden rounded-t-lg">
        <div onClick={() => ipcRenderer.send("play-in-new-tab", m.links[0])}>
          <img
            src={m.thumbnail}
            alt="cast"
            loading="lazy"
            className="object-cover transition-all duration-300  hover:scale-110 aspect-[9/16]"
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
      <div
        className="card-body"
        onClick={() => ipcRenderer.send("play-in-new-tab", m.links[0])}
      >
        <div>
          <p
            className="line-clamp-2 font-semibold"
            dangerouslySetInnerHTML={{ __html: m.title }}
          ></p>
        </div>
        <div>
          <p
            className="line-clamp-1 font-normal"
            dangerouslySetInnerHTML={{ __html: m.synopsis }}
          ></p>
        </div>
      </div>
    </motion.div>
  );
}

export { HentaiMovieCard };
