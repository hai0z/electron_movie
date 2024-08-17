import { StateStorage } from "zustand/middleware";
const zustandStorage: StateStorage = {
  getItem(name) {
    const value = localStorage.getItem(name);
    return value ?? null;
  },
  setItem(name, value) {
    localStorage.setItem(name, value);
  },
  removeItem(name) {
    localStorage.removeItem(name);
  },
};

export default zustandStorage;
