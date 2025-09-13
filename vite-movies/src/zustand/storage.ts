import { PersistStorage, StorageValue } from "zustand/middleware";
export function createElectronStorage<S>(): PersistStorage<S> {
  return {
    getItem: async (name) => {
      const str = await (window as any).electronStore.get(name);
      if (!str) return null;

      try {
        return JSON.parse(str) as StorageValue<S>;
      } catch {
        return null;
      }
    },
    setItem: async (name, value) => {
      await (window as any).electronStore.set({
        key: name,
        value: JSON.stringify(value),
      });
    },
    removeItem: async (name) => {
      await (window as any).electronStore.remove(name);
    },
  };
}
