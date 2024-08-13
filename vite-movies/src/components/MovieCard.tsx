import { Link } from "react-router-dom";
import { Item } from "../types";
import { motion } from "framer-motion";
function MovieCard2({ m }: { m: Item; index: number }) {
  return (
    <motion.div
      className="card card-side bg-base-200 shadow-xl w-full hover:ring-1 hover:ring-primary hover:bg-primary/10 transition-all duration-300 my-1 mx-1 cursor-pointer"
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
        <Link to={"/movie/" + m.slug}>
          <img
            src={m.poster_url}
            alt="cast"
            loading="lazy"
            className="object-cover h-full"
          />
        </Link>
      </figure>
      <div className="card-body w-full">
        <motion.h2 className="card-title">
          <Link to={"/movie/" + m.slug}> {m.name}</Link>
        </motion.h2>
      </div>
    </motion.div>
  );
}
function MovieCard3({ m }: { m: Item; index: number }) {
  return (
    <motion.div
      className="card w-96 bg-base-200 shadow-md hover:ring-2 hover:ring-primary my-1 group overflow-hidden hover:shadow-primary card-compact hover:bg-primary/10"
      layout
      initial={{
        opacity: 0,
      }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      exit={{
        opacity: 0,
      }}
    >
      <figure>
        <motion.div>
          <Link to={"/movie/" + m.slug + "#top"}>
            <img
              src={m.thumb_url}
              width={250}
              height={250}
              alt="cast"
              loading="lazy"
              className="group-hover:scale-110 transition-all duration-300 w-96"
            />
          </Link>
        </motion.div>
      </figure>
      <div className="card-body ">
        <Link to={"/movie/" + m.slug} className="card-title line-clamp-1">
          <motion.h2> {m.name}</motion.h2>
        </Link>
      </div>
    </motion.div>
  );
}
function MovieCard1({ m }: { m: Item }) {
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
      layout
      className="transition-all duration-300 rounded-lg shadow-md cursor-pointer w-[45%] md:w-48 lg:w-56 bg-base-200 hover:ring-1 hover:ring-accent hover:scale-[1.01] hover:shadow-accent group card my-1 hover:bg-acshadow-accent/10 card-compact"
    >
      <figure className="overflow-hidden rounded-t-lg">
        <Link to={"/movie/" + m.slug + "#top"}>
          <img
            src={m.poster_url}
            alt="cast"
            loading="lazy"
            className="object-cover transition-all duration-300 md:w-56 group-hover:scale-110 lg:w-64 h-40"
          />
        </Link>
        <div className="absolute top-1 left-1 badge badge-secondary bg-opacity-90 px-1 rounded-md text-xs">
          {m.quality}
        </div>
        <div className="absolute top-1 right-1 px-1 rounded-md text-xs badge badge-accent">
          {m.current_episode}
        </div>
      </figure>
      <div className="card-body">
        <Link to={"/movie/" + m.slug}>
          <p className="line-clamp-2 font-semibold">{m.name}</p>
        </Link>
        <Link to={"/movie/" + m.slug}>
          <p className="line-clamp-1 font-normal">{m.original_name}</p>
        </Link>
      </div>
    </motion.div>
  );
}
function MovieCard({ m }: { m: Item }) {
  return (
    <motion.div className="transition-all duration-300 rounded-lg shadow-md cursor-pointer w-60 lg:w-64 bg-base-200 hover:ring-1 hover:ring-primary hover:scale-[1.01] hover:shadow-primary group card my-1 hover:bg-primary/10">
      <figure className="overflow-hidden rounded-t-lg">
        <Link to={"/movie/" + m.slug + "#top"}>
          <img
            src={m.thumb_url}
            alt="cast"
            loading="lazy"
            className="object-cover transition-all duration-300 w-60  group-hover:scale-110 lg:w-64 "
          />
        </Link>
      </figure>
      <div className="card-body">
        <Link to={"/movie/" + m.slug}>
          <p className="line-clamp-2 font-semibold"> {m.name}</p>
        </Link>
      </div>
    </motion.div>
  );
}
export { MovieCard2, MovieCard1, MovieCard3 };

export default MovieCard;
