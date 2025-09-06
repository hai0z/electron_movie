import { StateStorage } from "zustand/middleware";
import LZString from "lz-string";
const zustandStorage: StateStorage = {
  getItem(name) {
    const value = localStorage.getItem(name);
    return LZString.decompress(value!) ?? null;
  },
  setItem(name, value) {
    localStorage.setItem(name, LZString.compress(value));
  },
  removeItem(name) {
    localStorage.removeItem(name);
  },
};

export default zustandStorage;
