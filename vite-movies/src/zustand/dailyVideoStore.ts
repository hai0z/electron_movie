import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { HistoryItem } from "./useHistoryStore"; // hoặc type video bạn đã có
import { Movie } from "../devils-mode/types/vietsub";
import zustandStorage from "./storage";

interface DailyState {
  dailyVideos: Omit<HistoryItem, "watchedAt">[]; // Thay đổi thành array
  lastGenerated: string; // yyyy-mm-dd
  generateDaily: () => void;
}

export const useDailyStore = create<DailyState>()(
  persist(
    (set, get) => ({
      dailyVideos: [], // Khởi tạo array rỗng
      lastGenerated: "",
      generateDaily: async () => {
        const today = new Date().toISOString().split("T")[0];

        if (get().lastGenerated === today) return; // đã random hôm nay

        try {
          const videos: Omit<HistoryItem, "watchedAt">[] = [];

          // Generate 3 random videos
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

              // Kiểm tra xem video đã tồn tại trong array chưa (tránh duplicate)
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
    }),
    {
      name: "daily-video-store",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
