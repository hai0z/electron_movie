import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Channel } from "../devils-mode/types/Story";
import { createElectronStorage } from "./storage";

export interface HistoryItem {
  channel: Channel;
  lastChap: number;
  position: number;
}

interface HistoryState {
  history: HistoryItem[];
  addHistory: (channel: Channel, chap: number) => void;
  updateChap: (channelId: string, chap: number, position: number) => void;
  removeHistory: (channelId: string) => void; // 👈 mới
  clearHistory: () => void;
}

export const useStoriesHistory = create<HistoryState>()(
  persist(
    (set, get) => ({
      history: [],

      addHistory: (channel, chap, position = 0) => {
        const { history } = get();

        // Xoá nếu đã có channel này
        const filtered = history.filter(
          (item) => item.channel.id !== channel.id
        );

        // Thêm mới lên đầu
        const updated: HistoryItem[] = [
          { channel, lastChap: chap, position },
          ...filtered,
        ];

        set({ history: updated });
      },

      updateChap: (channelId, chap, position) => {
        const { history } = get();
        const updated = history.map((item) =>
          item.channel.id === channelId
            ? { ...item, lastChap: chap, position: position }
            : item
        );
        set({ history: updated });
      },

      removeHistory: (channelId) => {
        const { history } = get();
        const updated = history.filter((item) => item.channel.id !== channelId);
        set({ history: updated });
      },

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: "story-history", // lưu vào localStorage
      storage: createElectronStorage<HistoryState>(),
      version: 2, // sử dụng electron store
    }
  )
);
