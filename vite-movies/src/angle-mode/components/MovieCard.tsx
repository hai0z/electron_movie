import { Link } from "react-router-dom";
import { Item } from "../types";
import { motion } from "framer-motion";
function MovieCard2({ m }: { m: Item }) {
  return (
    <motion.div
      className="card card-side bg-base-200 shadow-xl hover:ring-1 hover:ring-primarys hover:bg-accent/10 transition-all duration-300 my-1 mx-1 cursor-pointer card-compact w-[48%] h-52 overflow-y-hidden"
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
            className="object-cover lg:w-64 h-52  md:w-56"
          />
        </Link>
      </figure>
      <Link to={"/movie/" + m.slug} className="card-body w-full">
        <motion.h2 className="card-title">
          <Link to={"/movie/" + m.slug}> {m.name}</Link>
        </motion.h2>
        <Link
          to={"/movie/" + m.slug}
          className="line-clamp-4"
          dangerouslySetInnerHTML={{ __html: m.description }}
        ></Link>
        <div className="flex flex-row gap-2 items-center">
          <div className="badge badge-secondary">{m.quality}</div>
          <div className="badge badge-neutral">{m.current_episode}</div>

          <div className="badge badge-accent">{m.language}</div>
        </div>
      </Link>
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
      className="transition-all duration-300 rounded-lg shadow-md cursor-pointer w-[19%] bg-base-200 hover:ring-1 hover:ring-primarys hover:scale-[1.01] hover:shadow-primarys group card my-1 hover:bg-accent/10 card-compact"
    >
      <figure className="overflow-hidden rounded-t-lg">
        <Link to={"/movie/" + m.slug + "#top"}>
          <img
            src={m.poster_url}
            alt="cast"
            loading="lazy"
            className="object-cover transition-all duration-300 md:w-56 group-hover:scale-150 lg:w-64 h-40 xl:w-72"
          />
        </Link>
        <div className="absolute top-1 left-1 badge badge-secondary bg-opacity-90 px-1 rounded-md text-xs">
          {m.quality}
        </div>
        <div className="absolute top-1 right-1 px-1 rounded-md text-xs badge badge-accent">
          {m.current_episode}
        </div>
      </figure>
      <Link to={"/movie/" + m.slug} className="card-body">
        <div>
          <p className="line-clamp-1 font-semibold">{m.name}</p>
        </div>
        <div>
          <p className="line-clamp-1 font-normal">{m.original_name}</p>
        </div>
      </Link>
    </motion.div>
  );
}

export { MovieCard2, MovieCard1 };
