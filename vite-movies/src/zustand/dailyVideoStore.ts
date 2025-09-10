import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { HistoryItem, useHistoryStore } from "./useHistoryStore"; // hoặc type video bạn đã có
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
          const ipc = (window as any).electron.ipcRenderer;
          ipc.send(
            "recommend",
            JSON.stringify(useHistoryStore.getState().history)
          );

          ipc.on("recommend-data", (result: Movie[]) => {
            set({
              dailyVideos: result.slice(0, 3).map((random) => ({
                id: random.slug,
                thumbnail: random.thumb_url,
                title: random.name,
                type: "xxvn",
                content: random.content,
                actor: "",
                tag: "",
              })) as Omit<HistoryItem, "watchedAt">[],
              lastGenerated: today,
            });
          });
        } catch (error) {
          console.error("Error generating daily videos:", error);
        }
      },

      generateMaybeLike: async () => {
        const now = Date.now();
        const tenMinutes = 10 * 60 * 1000;

        if (now - get().lastMaybeLikeGenerated < tenMinutes) {
          return; // chưa đủ 10 phút thì không gọi lại
        }

        try {
          const ipc = (window as any).electron.ipcRenderer;
          ipc.send(
            "get-maybeLike",
            JSON.stringify(useHistoryStore.getState().history)
          );

          ipc.on("get-maybeLike-result", (result: string) => {
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
