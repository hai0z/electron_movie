import { useEffect } from "react";
import { useHistoryStore } from "../../zustand/useHistoryStore";
import { Movie } from "../types/vietsub";
import Loading from "../../common/Loading";

const RandomModal = ({
  data,
  onClose,
  loading,
}: {
  data: Movie;
  onClose: () => void;
  loading: boolean;
}) => {
  const { addToHistory } = useHistoryStore();

  useEffect(() => {
    if (data) {
      addToHistory({
        id: String(data.slug),
        thumbnail: data.thumb_url,
        type: "xxvn",
        title: data.name,
      });
    }
  }, [data, addToHistory]);

  return (
    <dialog id="video_modal_2" className="modal">
      {loading ? (
        <Loading />
      ) : (
        <div className="modal-box max-w-5xl w-full p-0 overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 border-b">
            <h3 className="font-bold text-lg line-clamp-1">{data?.name}</h3>
          </div>

          {/* Iframe player */}
          <div className="w-full aspect-video bg-black">
            <iframe
              src={data?.episodes?.[0]?.server_data?.[0]?.link}
              title={data?.name}
              className="w-full h-full"
              allowFullScreen
            />
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t flex justify-between items-center">
            <span className="text-sm opacity-70">
              {data?.actors?.join(", ")}
            </span>
            <form method="dialog">
              <button className="btn btn-sm" onClick={onClose}>
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </dialog>
  );
};

export default RandomModal;
