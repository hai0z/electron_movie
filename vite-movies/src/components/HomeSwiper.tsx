import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Thumbs, Controller } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import { Item } from "../types";
import "swiper/css/effect-creative";
import "swiper/css/thumbs";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface Props {
  data: Item[];
}
export default ({ data }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <Swiper
      modules={[Autoplay, Pagination, Thumbs, Controller]}
      spaceBetween={50}
      // autoplay={{
      //   delay: 5000,
      // }}
      loop
      pagination={{ clickable: true }}
      centeredSlides
      slidesPerView={1}
      onSlideChange={(e) => setCurrentIndex(e.activeIndex)}
      onSwiper={(swiper) => console.log(swiper)}
    >
      {data?.map((item, index) => (
        <SwiperSlide key={index}>
          <motion.div className="h-[500px] flex items-center">
            <div className="w-full h-full bg-gradient-to-t from-base-100 to-transparent  z-10 absolute"></div>
            <motion.img
              key={currentIndex + item.slug}
              src={item.poster_url}
              initial={{
                scale: 1.1,
              }}
              animate={{
                scale: 1,
              }}
              exit={{
                scale: 1.1,
              }}
              transition={{
                duration: 0.85,
              }}
              className="object-cover w-full h-[500px] brightness-50 absolute top-0 left-0"
            />
            <div className="z-10 flex flex-row items-center justify-between flex-1">
              <div className="px-10 flex flex-col gap-y-4 flex-1 h-full">
                <motion.div
                  className="text-4xl font-bold shadow-sm text-base-content drop-shadow-2xl"
                  initial={{
                    opacity: 0,
                    x: 50,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.5,
                  }}
                  key={currentIndex + item.slug}
                >
                  {item.name}
                </motion.div>
                <motion.div
                  initial={{
                    opacity: 0,
                    x: 50,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.7,
                  }}
                  key={currentIndex}
                >
                  <p className="text-lg line-clamp-3 font-semibold text-justify ">
                    {item.description}
                  </p>
                  <Link
                    to={"/movie/" + item.slug}
                    className="btn btn-primary mt-4"
                  >
                    <p>Xem ngay</p>
                  </Link>
                </motion.div>
              </div>
              <motion.img
                key={currentIndex}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 1 }}
                src={item.thumb_url}
                className="object-cover w-[300px] h-[400px] rounded-2xl mr-8"
              />
            </div>
          </motion.div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
