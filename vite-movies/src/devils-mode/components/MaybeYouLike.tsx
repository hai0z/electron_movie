import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useDailyStore } from "../../zustand/dailyVideoStore";
import { VietSubCard } from "./VietSubCard";
import { ActorCard } from "../page/Actor";

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

  if (mayBelike?.actors?.length === 0 && mayBelike?.movies?.length === 0)
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
        {mayBelike?.movies?.map((video) => {
          return <VietSubCard m={video} key={video.id} />;
        })}
        {mayBelike?.actors?.map((actor) => {
          return <ActorCard actor={actor} key={actor.id} />;
        })}
      </div>
    </motion.div>
  );
};

export default MaybeYouLike;
