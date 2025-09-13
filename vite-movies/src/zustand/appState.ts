import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Movie } from "../angle-mode/types/movieDetail";
import { List } from "../devils-mode/types/movieDetail";
import { Movie as MovieVietSub } from "../devils-mode/types/vietsub";
import { Post } from "../devils-mode/types/other";
import { Actor } from "../devils-mode/page/Actor";
import { createElectronStorage } from "./storage";

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
  otherLike: Post[];
  setOtherLike: (likeVideos: Post[]) => void;
  hydrated: boolean;
  likeActor: Actor[];
  setLikeActor: (actors: Actor[]) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      theme: "lemonade",
      setTheme: (theme) => set({ theme }),
      likeVideos: [],
      likeActor: [],
      setLikeActor: (actors) =>
        set({
          likeActor: actors,
        }),
      setLikeVideos: (likeVideos) => set({ likeVideos }),
      appMode: "angle",
      setAppMode: (appMode) => set({ appMode }),
      likedAnglesMovies: [],
      setLikedAnglesMovies: (likedAnglesMovies) => set({ likedAnglesMovies }),
      viewMode: "card",
      setViewMode: (viewMode) => set({ viewMode }),
      likeVietSubs: [],
      setLikeVietSubs: (likeVietSubs) => set({ likeVietSubs }),
      lightOff: false,
      setLightOff: (lightOff) => set({ lightOff }),
      otherLike: [],
      setOtherLike: (otherLike) => set({ otherLike }),
      hydrated: false,
    }),
    {
      name: "app-state",
      version: 2,
      storage: createElectronStorage<AppStore>(),
    }
  )
);
