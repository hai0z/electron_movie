import { Link } from "react-router-dom";
import { Item } from "../types";
import { motion } from "framer-motion";

function MovieCard2({ m }: { m: Item }) {
  return (
    <motion.div
      className="card card-side bg-base-200 shadow-xl hover:ring-2 hover:ring-secondary hover:bg-accent/20 transition-all duration-300 my-2 mx-1 cursor-pointer card-compact w-[48%] h-56 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      key={m.slug}
      transition={{ duration: 0.4 }}
      exit={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <figure className="relative">
        <Link to={"/movie/" + m.slug}>
          <img
            src={m.poster_url}
            alt="cast"
            loading="lazy"
            className="object-cover transition-all duration-300 h-40 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
        </Link>
      </figure>
      <Link to={"/movie/" + m.slug} className="card-body w-full">
        <motion.h2 className="card-title text-lg font-bold hover:text-secondary transition-colors">
          <Link to={"/movie/" + m.slug}>{m.name}</Link>
        </motion.h2>
        <Link
          to={"/movie/" + m.slug}
          className="line-clamp-3 text-sm hover:text-secondary/80 transition-colors"
          dangerouslySetInnerHTML={{ __html: m.description }}
        ></Link>
        <div className="flex flex-row gap-2 items-center flex-wrap">
          <div className="badge badge-secondary badge-sm">{m.quality}</div>
          <div className="badge badge-neutral badge-sm">
            {m.current_episode}
          </div>
          <div className="badge badge-accent badge-sm">{m.language}</div>
        </div>
      </Link>
    </motion.div>
  );
}

function MovieCard1({ m }: { m: Item }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      key={m.slug}
      transition={{ duration: 0.4 }}
      layout
      whileHover={{ scale: 1.03 }}
      className="transition-all duration-300 rounded-lg shadow-lg cursor-pointer w-[19%] bg-base-200 hover:ring-2 hover:ring-secondary hover:shadow-xl group card my-2 hover:bg-accent/20 card-compact"
    >
      <figure className="relative overflow-hidden rounded-t-lg">
        <Link to={"/movie/" + m.slug + "#top"}>
          <img
            src={m.poster_url}
            alt="cast"
            loading="lazy"
            className="object-cover transition-all duration-500 md:w-56 group-hover:scale-125 lg:w-full h-44 xl:w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>
        <div className="absolute top-2 left-2 badge badge-secondary bg-opacity-90 px-2 py-1 rounded-md text-xs font-medium">
          {m.quality}
        </div>
        <div className="absolute top-2 right-2 badge badge-accent bg-opacity-90 px-2 py-1 rounded-md text-xs font-medium">
          {m.current_episode}
        </div>
      </figure>
      <Link to={"/movie/" + m.slug} className="card-body p-4">
        <div>
          <p className="line-clamp-1 font-bold text-sm group-hover:text-secondary transition-colors">
            {m.name}
          </p>
        </div>
        <div>
          <p className="line-clamp-1 text-xs text-base-content/80 group-hover:text-secondary/80 transition-colors">
            {m.original_name}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

export { MovieCard2, MovieCard1 };
