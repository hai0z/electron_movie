import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useStoriesHistory } from "../../zustand/useStoriesHistory";
import Loading from "../../common/Loading";
import { ZoomIn, ZoomOut } from "lucide-react";

export interface Root {
  description: string;
  sources: Source[];
}

export interface Source {
  id: string;
  name: string;
  contents: Content[];
}

export interface Content {
  id: string;
  name: string;
  grid_number: number;
  streams: Stream[];
}

export interface Stream {
  id: string;
  index: number;
  name: string;
  remote_data: RemoteData;
}

export interface RemoteData {
  url: string;
}

const StoriesDetail = () => {
  const params = useParams();
  const [data, setData] = useState<Root>();

  const [contents, setContents] = useState("");

  const [progress, setProgress] = useState(0);

  const location = useLocation();

  const navigation = useNavigate();

  const [textSize, setTextSize] = useState<number>(() => {
    // lấy từ localStorage hoặc mặc định 80
    const saved = localStorage.getItem("textSize");
    return saved ? parseInt(saved, 10) : 24;
  });

  const { addHistory, updateChap } = useStoriesHistory();

  const streams = data?.sources[0].contents[0].streams.slice().reverse() || [];

  const [currentIndex, setCurrentIndex] = useState(
    location?.state?.lastChap ? location.state.lastChap : 0
  );
  const prevStream = streams[currentIndex - 1];
  const nextStream = streams[currentIndex + 1];

  const [loading, setLoading] = useState(true);

  let isFirstRender = useRef(false);

  const getData = async () => {
    const res = await fetch(
      `https://truyenx.link/truyensextv/channels/${params.remote}`
    );
    const dt: Root = await res.json();
    setData(dt);
    addHistory(location?.state?.channel, currentIndex);
  };

  const getContents = async () => {
    setLoading(true);
    const res = await fetch(streams[currentIndex].remote_data.url);
    const dt = await res.json();
    setContents(dt.text);
    setLoading(false);
  };

  console.log(isFirstRender.current);
  // Scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (scrollTop / docHeight) * 100;
      setProgress(scrolled);
      if (location?.state?.channel) {
        updateChap(location?.state?.channel.id, currentIndex, scrollTop);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentIndex]);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    // lần đầu thì scroll đến vị trí cũ
    if (!isFirstRender.current && !loading) {
      if (location?.state?.position) {
        setTimeout(() => {
          window.scrollTo({ top: location.state.position, behavior: "smooth" });
        }, 500);
      }
      isFirstRender.current = true;
    }
  }, [loading]);

  useEffect(() => {
    getContents();

    window.scrollTo({ top: 0, behavior: "smooth" });

    if (location?.state?.channel) {
      updateChap(location?.state?.channel.id, currentIndex, 0);
    }
  }, [currentIndex, data]);

  useEffect(() => {
    localStorage.setItem("textSize", String(textSize));
  }, [textSize]);

  return (
    <div className="w-full h-full">
      {/* Thanh progress */}
      <div className="bg-base-100 sticky top-10 py-4">
        <div className="flex justify-between">
          <div></div>
          <p className="text-center text-lg font-bold">
            {location?.state?.channel.name}
          </p>
          <div className="flex gap-2 mr-4">
            <button
              className="btn btn-sm btn-outline"
              onClick={() => setTextSize((w) => Math.max(24, w - 5))}
            >
              <ZoomOut size={16} />
            </button>
            <button
              className="btn btn-sm btn-outline"
              onClick={() => setTextSize((w) => Math.min(60, w + 5))}
            >
              <ZoomIn size={16} />
            </button>
          </div>
        </div>

        <div className=" flex flex-row items-center gap-4">
          <button
            onClick={() => {
              navigation(-1);
            }}
            className="btn btn-xs btn-secondary btn-outline"
          >
            Quay lại
          </button>
          <progress
            className="progress progress-primary left-0 w-full h-2 z-50"
            value={progress}
            max="100"
          ></progress>
        </div>
      </div>

      {/* Chọn chapter */}
      <select
        onChange={(e) => {
          setCurrentIndex(+e.target.value);
        }}
        value={currentIndex}
        className="select select-bordered select-sm w-full max-w-40 my-3"
      >
        {streams.map((item) => (
          <option key={item.id} value={item.index - 1}>
            {item.name}
          </option>
        ))}
      </select>

      {/* Nội dung */}
      {!loading ? (
        <div className="mt-16 mr-6 ">
          <p
            dangerouslySetInnerHTML={{ __html: contents }}
            className="leading-relaxed text-justify"
            style={{
              fontSize: textSize,
              lineHeight: 2,
            }}
          ></p>
        </div>
      ) : (
        <Loading />
      )}

      {/* Nút điều hướng */}
      <div className="flex justify-center items-center mt-8 mb-16 gap-4 w-full">
        <button
          disabled={!prevStream}
          onClick={() => {
            setCurrentIndex(prevStream.index - 1);
          }}
          className="btn btn-outline btn-sm"
        >
          ◀ Trước
        </button>
        <button
          disabled={!nextStream}
          onClick={() => {
            setCurrentIndex(nextStream.index - 1);
          }}
          className="btn btn-outline btn-sm"
        >
          Tiếp ▶
        </button>
      </div>
    </div>
  );
};

export default StoriesDetail;
