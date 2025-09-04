import { Link } from "react-router-dom";
import { useDailyStore } from "../../zustand/dailyVideoStore";

const DailyCard = () => {
  const { dailyVideos } = useDailyStore();

  if (!dailyVideos || dailyVideos.length === 0) return null;

  return (
    <div className="flex flex-wrap flex-row gap-4">
      {dailyVideos.map((video) => {
        return (
          <div
            className="card bg-base-100 image-full w-[32%] shadow-xl "
            key={video.id}
          >
            <figure>
              <img src={video.thumbnail} alt="thumb" />
            </figure>
            <div className="card-body">
              <h2 className="card-title line-clamp-1">{video.title}</h2>
              <div>
                <p
                  className="line-clamp-2 font-semibold"
                  dangerouslySetInnerHTML={{ __html: video.content! }}
                ></p>
              </div>
              <div className="justify-end card-actions">
                <Link
                  to={"/vietsub-detail/" + video.id}
                  className="btn btn-primary"
                >
                  Xem ngay
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DailyCard;
