import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { HistoryItem } from "./useHistoryStore"; // hoặc type video bạn đã có
import { Movie } from "../devils-mode/types/vietsub";
import zustandStorage from "./storage";
import { Actor } from "../devils-mode/page/Actor";

interface MaybeLike {
  movies: Movie[];
  actors: Actor[];
}
interface MaybeLike {
  movies: Movie[];
  actors: Actor[];
}

interface DailyState {
  dailyVideos: Omit<HistoryItem, "watchedAt">[];
  lastGenerated: string; // yyyy-mm-dd cho daily
  lastMaybeLikeGenerated: number; // timestamp (ms) cho mayBelike
  generateDaily: () => void;
  generateMaybeLike: () => void;
  mayBelike: MaybeLike;
}

export const useDailyStore = create<DailyState>()(
  persist(
    (set, get) => ({
      dailyVideos: [],
      mayBelike: {} as MaybeLike,
      lastGenerated: "",
      lastMaybeLikeGenerated: 0,

      generateDaily: async () => {
        const today = new Date().toISOString().split("T")[0];
        if (get().lastGenerated === today) return;

        try {
          const videos: Omit<HistoryItem, "watchedAt">[] = [];

          for (let i = 0; i < 3; i++) {
            const randomPage = Math.floor(Math.random() * 354 + 1);
            const res = await fetch(
              `https://www.xxvnapi.com/api/phim-moi-cap-nhat?page=${randomPage}`
            );
            const data = await res.json();

            if (data.movies && data.movies.length > 0) {
              const randomIndex = Math.floor(
                Math.random() * Math.min(data.movies.length, 49)
              );
              const random: Movie = data.movies[randomIndex];

              const isDuplicate = videos.some(
                (video) => video.id === random.slug
              );

              if (!isDuplicate) {
                videos.push({
                  id: random.slug,
                  thumbnail: random.thumb_url,
                  title: random.name,
                  type: "xxvn",
                  content: random.content,
                  actor: "",
                  tag: "",
                });
              } else {
                i--;
              }
            } else {
              i--;
            }
          }

          set({
            dailyVideos: videos,
            lastGenerated: today,
          });
        } catch (error) {
          console.error("Error generating daily videos:", error);
        }
      },

      generateMaybeLike: async () => {
        const now = Date.now();
        const thirtyMinutes = 30 * 60 * 1000;

        if (now - get().lastMaybeLikeGenerated < thirtyMinutes) {
          return; // chưa đủ 30 phút thì không gọi lại
        }

        try {
          const ipc = (window as any).electron.ipcRenderer;
          ipc.send("get-maybeLike");

          ipc.once("get-maybeLike-result", (_: any, result: string) => {
            set({
              mayBelike: JSON.parse(result),
              lastMaybeLikeGenerated: now,
            });
          });
        } catch (error) {
          console.error("Error generating maybe like data:", error);
        }
      },
    }),
    {
      name: "daily-video-store",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
