// stores/useHistoryStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Post } from "../devils-mode/types/other";
import { createElectronStorage } from "./storage";

export interface HistoryItem {
  id: string;
  title: string;
  thumbnail: string;
  watchedAt: string;
  type: "avdb" | "xxvn" | "other" | "old";
  otherData?: Post;
  stayIn?: number;
  content?: string;
  tag: string;
  actor: string;
}

interface HistoryState {
  history: HistoryItem[];
  addToHistory: (item: Omit<HistoryItem, "watchedAt">) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      history: [],

      addToHistory: (item) => {
        const newItem: HistoryItem = {
          ...item,
          watchedAt: new Date().toISOString(),
        };
        const updated = [newItem, ...get().history]
          // loại bỏ trùng id (chỉ giữ mới nhất)
          .filter((v, i, arr) => arr.findIndex((x) => x.id === v.id) === i);

        set({ history: updated });
      },

      removeFromHistory: (id) => {
        set({ history: get().history.filter((v) => v.id !== id) });
      },

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: "watch_history",
      storage: createElectronStorage<HistoryState>(),
      version: 2,
    }
  )
);
