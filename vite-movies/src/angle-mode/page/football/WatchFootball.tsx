import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ReactPlayer from "react-player";
import { Channel } from "../../types/sport";

export default function WatchFootball() {
  const navigate = useNavigate();

  const location = useLocation();

  const electron = (window as any).electron;

  const [selectedSourceIndex, setSelectedSourceIndex] = useState(0);
  const [selectedContentIndex, setSelectedContentIndex] = useState(0);
  const [selectedStreamIndex, setSelectedStreamIndex] = useState(0);
  const [selectedLinkIndex, setSelectedLinkIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatVisible, setIsChatVisible] = useState(false);

  const playerRef = useRef<ReactPlayer>(null);
  const channel: Channel = location?.state?.data || {};
  const listSource = useMemo(() => channel.sources, [channel]);
  const currentSource = useMemo(
    () => listSource[selectedSourceIndex],
    [listSource, selectedSourceIndex]
  );
  const currentContent = useMemo(
    () => currentSource.contents[selectedContentIndex],
    [currentSource, selectedContentIndex]
  );
  const currentStream = useMemo(
    () => currentContent.streams[selectedStreamIndex],
    [currentContent, selectedStreamIndex]
  );
  const listStream = useMemo(() => currentContent.streams, [currentContent]);
  const [url, setUrl] = useState<string>(
    currentStream.stream_links[selectedLinkIndex].url
  );
  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    electron.ipcRenderer.send("get-football-url", url);
    electron.ipcRenderer.on("football-url", (data: string) => {
      setUrl(data);
      console.log(data);
    });
  }, []);
  const handleSourceSelect = useCallback(
    (sourceIndex: number, contentIndex: number, streamIndex: number) => {
      setSelectedSourceIndex(sourceIndex);
      setSelectedContentIndex(contentIndex);
      setSelectedStreamIndex(streamIndex);
    },
    []
  );

  const handleStreamSelect = useCallback(
    (streamIndex: number, linkIndex: number) => {
      setSelectedStreamIndex(streamIndex);
      setSelectedLinkIndex(linkIndex);
    },
    []
  );

  const toggleChat = useCallback(() => {
    setIsChatVisible((prev) => !prev);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-100">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-base-100">
      <div className="flex-1">
        <div className="aspect-video w-full bg-black">
          <ReactPlayer
            ref={playerRef}
            url={url}
            width="100%"
            height="100%"
            playing
            controls
            config={{
              file: {
                forceHLS: true,
                hlsOptions: {
                  forceHLS: true,
                  debug: false,
                  xhrSetup: function (xhr: XMLHttpRequest) {
                    xhr.setRequestHeader("Referer", "https://vebotv.tv");
                    xhr.setRequestHeader("Origin", "https://vebotv.tv");
                  },
                },
              },
            }}
          />
        </div>
        <div>
          {JSON.stringify(currentStream.stream_links[selectedLinkIndex].url)}
        </div>
        {!isChatVisible && (
          <div className="overflow-auto p-4">
            <div className="border-b border-base-300 pb-4 mb-4">
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">{channel.name}</h1>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(-1)}
                >
                  Quay lại
                </button>
              </div>
              <div className="flex items-center mt-3">
                <img
                  src={channel.image.url}
                  className="w-9 h-9 rounded-full"
                  alt={channel.name}
                />
                <span className="ml-3 text-base-content/60">
                  {currentSource.name}
                </span>
              </div>
            </div>

            <div className="border-b border-base-300 pb-4 mb-4">
              <h2 className="text-lg font-semibold mb-3">Chất lượng</h2>
              <div className="flex overflow-x-auto">
                {listStream.map((stream, streamIndex) =>
                  stream.stream_links.map((link, linkIndex) => (
                    <button
                      key={`${streamIndex}-${linkIndex}`}
                      className={`btn mr-2 ${
                        streamIndex === selectedStreamIndex &&
                        linkIndex === selectedLinkIndex
                          ? "btn-primary"
                          : "btn-ghost"
                      }`}
                      onClick={() => handleStreamSelect(streamIndex, linkIndex)}
                    >
                      {link.name}
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="border-b border-base-300 pb-4">
              <h2 className="text-lg font-semibold mb-3">Nguồn</h2>
              <div className="flex overflow-x-auto">
                {listSource.map((source, sourceIndex) =>
                  source.contents.map((content, contentIndex) =>
                    content.streams.map((stream, streamIndex) => (
                      <button
                        key={`${sourceIndex}-${contentIndex}-${streamIndex}`}
                        className={`btn mr-2 ${
                          sourceIndex === selectedSourceIndex &&
                          contentIndex === selectedContentIndex &&
                          streamIndex === selectedStreamIndex
                            ? "btn-primary"
                            : "btn-ghost"
                        }`}
                        onClick={() =>
                          handleSourceSelect(
                            sourceIndex,
                            contentIndex,
                            streamIndex
                          )
                        }
                      >
                        {stream.name}
                      </button>
                    ))
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {isChatVisible && currentStream.stream_links[0].comments?.[0]?.url && (
          <div className="flex-1">
            <h2 className="p-4 text-lg font-semibold">Trò chuyện trực tiếp</h2>
            <iframe
              src={currentStream.stream_links[0].comments[0].url}
              className="w-full h-full"
              style={{
                border: "none",
                backgroundColor: "transparent",
              }}
            />
          </div>
        )}

        <div className="flex justify-around p-2 bg-base-200">
          <button className="btn btn-ghost" onClick={toggleChat}>
            <span className={`${isChatVisible ? "text-primary" : ""}`}>
              Chat
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
