import { Link } from "react-router-dom";
import { List } from "../types";
import { motion } from "framer-motion";
import { decode } from "html-entities";
function MovieCard2({ m }: { m: List }) {
  return (
    <motion.div
      className="card card-side bg-base-200 shadow-xl w-[48%] hover:ring-1 hover:ring-primarys hover:bg-accent/10 transition-all duration-300 my-1 mx-1 cursor-pointer card-compact h-44 overflow-y-hidden "
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
        <Link to={"/movie/" + m.id}>
          <img
            src={m.poster_url ? m.poster_url : m.thumb_url}
            alt="thumb"
            loading="lazy"
            className="object-cover lg:w-64 h-full md:w-56"
          />
        </Link>
      </figure>
      <Link to={"/movie/" + m.id} className="card-body w-full">
        <motion.h2 className="card-title">
          <Link to={"/movie/" + m.id} className="line-clamp-2">
            {" "}
            {decode(m.name)}
          </Link>
        </motion.h2>
        <Link
          to={"/movie/" + m.id}
          className="line-clamp-2"
          dangerouslySetInnerHTML={{ __html: decode(m.description) }}
        ></Link>
        <div className="flex flex-row gap-2 items-center">
          <div className="badge badge-secondary">{m.quality}</div>
          <div className="badge badge-accent">{m.year}</div>
        </div>
      </Link>
    </motion.div>
  );
}

function MovieCard1({ m }: { m: List }) {
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
        <Link to={"/movie/" + m.id + "#top"}>
          <img
            src={m.poster_url ? m.poster_url : m.thumb_url}
            alt="cast"
            loading="lazy"
            className="object-cover transition-all duration-300 md:w-56 group-hover:scale-150 lg:w-64 h-40 xl:w-72"
          />
        </Link>
        <div className="absolute top-1 left-1 badge badge-secondary bg-opacity-90 px-1 rounded-md text-xs">
          {m.quality}
        </div>
        <div className="absolute top-1 right-1 px-1 rounded-md text-xs badge badge-accent">
          {m.year}
        </div>
      </figure>
      <Link to={"/movie/" + m.id} className="card-body">
        <div>
          <p
            className="line-clamp-2 font-semibold"
            dangerouslySetInnerHTML={{ __html: decode(m.name) }}
          ></p>
        </div>
        <div>
          <p
            className="line-clamp-1 font-normal"
            dangerouslySetInnerHTML={{ __html: decode(m.description) }}
          ></p>
        </div>
      </Link>
    </motion.div>
  );
}

export { MovieCard2, MovieCard1 };
