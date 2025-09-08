import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useDailyStore } from "../../zustand/dailyVideoStore";
import { VietSubCard } from "./VietSubCard";
import { Link } from "react-router-dom";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const MaybeYouLike = () => {
  const { mayBelike } = useDailyStore();

  if (mayBelike.actors.length === 0 && mayBelike.movies.length === 0)
    return null;
  return (
    <motion.div className="mb-8" variants={sectionVariants}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-r from-red-400 to-pink-500 rounded-lg">
          <Heart className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-base-content">
          Có thể bạn sẽ thích
        </h2>
      </div>
      <div className="flex flex-wrap flex-row gap-4">
        {mayBelike.movies.map((video) => {
          return <VietSubCard m={video} key={video.id} />;
        })}
        {mayBelike.actors.map((actor) => {
          return (
            <Link
              to={"/actor-movie?actor=" + actor.name}
              key={actor.id}
              className="transition-all duration-300 rounded-lg shadow-md cursor-pointer w-[23%] bg-base-200 hover:ring-1 hover:ring-primarys hover:scale-[1.01] hover:shadow-primarys group card my-1 hover:bg-acshadow-primarys/10 card-compact"
            >
              <figure>
                <img
                  src={
                    actor.image.url.includes("default")
                      ? "https://cdn-icons-png.flaticon.com/128/1814/1814294.png"
                      : actor.image.url
                  }
                  alt={actor.name}
                  className="rounded-full object-cover transition-all duration-300 h-40 w-40 hover:scale-110 "
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{actor.name}</h2>
              </div>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
};

export default MaybeYouLike;
