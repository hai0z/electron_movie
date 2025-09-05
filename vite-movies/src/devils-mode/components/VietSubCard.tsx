import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { VietSubResult } from "../types/vietsub";
import { decode } from "html-entities";
import { useAppStore } from "../../zustand/appState";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";

function VietSubCard({ m }: { m: VietSubResult["movies"][0] }) {
  const likeVietSubs = useAppStore((state) => state.likeVietSubs);
  const isLike = likeVietSubs.findIndex((i) => i.id === m.id) !== -1;

  const setLikeVietSubs = useAppStore((state) => state.setLikeVietSubs);

  const toggleLike = () => {
    if (isLike) {
      setLikeVietSubs(likeVietSubs.filter((i) => i.id !== m.id));
    } else {
      setLikeVietSubs([m, ...likeVietSubs]);
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
      className="transition-all duration-300 rounded-lg shadow-md cursor-pointer w-[23%] bg-base-200 hover:ring-1 hover:ring-primarys hover:scale-[1.01] hover:shadow-primarys group card my-1 hover:bg-acshadow-primarys/10 card-compact"
    >
      <figure className="overflow-hidden rounded-t-lg">
        <Link to={"/vietsub-detail/" + m.slug}>
          <img
            src={m.thumb_url}
            alt="cast"
            loading="lazy"
            className="object-cover transition-all duration-300 h-40 w-96 hover:scale-110"
          />
        </Link>
        <div className="absolute top-1 left-1 badge badge-secondary bg-opacity-90 px-1 rounded-md text-xs">
          {m.quality}

          {m.lang && " | " + m.lang}
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
      <Link to={"/vietsub-detail/" + m.slug} className="card-body">
        <div>
          <p
            className="line-clamp-2 font-semibold"
            dangerouslySetInnerHTML={{ __html: m.name }}
          ></p>
        </div>
        <div>
          <p
            className="line-clamp-1 font-normal"
            dangerouslySetInnerHTML={{ __html: m.content }}
          ></p>
        </div>
      </Link>
    </motion.div>
  );
}
function VietSubCard1({ m }: { m: VietSubResult["movies"][0] }) {
  return (
    <motion.div
      className="card card-side bg-base-200 shadow-xl w-[48%] hover:ring-1 hover:ring-primarys hover:bg-accent/10 transition-all duration-300 my-1 mx-1 cursor-pointer card-compact h-52"
      initial={{
        opacity: 0,
      }}
      key={m.slug}
      transition={{ duration: 0.5 }}
      exit={{
        opacity: 0,
      }}
      animate={{ opacity: 1 }}
    >
      <figure>
        <Link to={"/vietsub-detail/" + m.slug}>
          <img
            src={m.thumb_url}
            alt="thumb"
            loading="lazy"
            className="object-cover lg:w-64 h-full  md:w-56"
          />
        </Link>
      </figure>
      <Link to={"/vietsub-detail/" + m.slug} className="card-body w-full">
        <motion.h2 className="card-title">
          <Link to={"/vietsub-detail/" + m.slug} className="line-clamp-2">
            {" "}
            {decode(m.name)}
          </Link>
        </motion.h2>
        <Link
          to={"/vietsub-detail/" + m.slug}
          className="line-clamp-4"
          dangerouslySetInnerHTML={{ __html: decode(m.content) }}
        ></Link>
        <div className="flex flex-row gap-2 items-center">
          <div className="badge badge-secondary">{m.quality}</div>
          {m.actors.length > 0 && (
            <div className="badge badge-neutral">{m.actors}</div>
          )}
          {m.lang && <div className="badge badge-accent">{m.lang}</div>}
        </div>
      </Link>
    </motion.div>
  );
}

export { VietSubCard, VietSubCard1 };
