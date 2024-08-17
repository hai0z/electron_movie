import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import zustandStorage from "./storage";
import { Movie } from "../angle-mode/types/movieDetail";
import { List } from "../devils-mode/types/movieDetail";
import { Movie as MovieVietSub } from "../devils-mode/types/vietsub";

interface AppStore {
  theme: string;
  viewMode: "card" | "list";
  setViewMode: (viewMode: "card" | "list") => void;
  setTheme: (theme: string) => void;
  likeVideos: List[];
  setLikeVideos: (likeVideos: List[]) => void;
  likeVietSubs: MovieVietSub[];
  setLikeVietSubs: (likeVietSubs: MovieVietSub[]) => void;
  appMode: "angle" | "devil";
  setAppMode: (appMode: "angle" | "devil") => void;
  likedAnglesMovies: Movie[];
  setLikedAnglesMovies: (likedAngles: Movie[]) => void;
  lightOff: boolean;
  setLightOff: (lightOff: boolean) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      theme: "autumn",
      setTheme: (theme) => set({ theme }),
      likeVideos: [],
      setLikeVideos: (likeVideos) => set({ likeVideos }),
      appMode: "angle",
      setAppMode: (appMode) => set({ appMode }),
      likedAnglesMovies: [],
      setLikedAnglesMovies: (likedAnglesMovies) => set({ likedAnglesMovies }),
      viewMode: "list",
      setViewMode: (viewMode) => set({ viewMode }),
      likeVietSubs: [],
      setLikeVietSubs: (likeVietSubs) => set({ likeVietSubs }),
      lightOff: false,
      setLightOff: (lightOff) => set({ lightOff }),
    }),
    {
      name: "app-state",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
