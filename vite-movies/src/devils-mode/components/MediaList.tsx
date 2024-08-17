import React from "react";
import { useAppStore } from "../../zustand/appState";
import { MovieCard1, MovieCard2 } from "./MovieCard";
import { List } from "../types";
import { VietSubResult } from "../types/vietsub";
import { VietSubCard, VietSubCard1 } from "./VietSubCard";

interface Props {
  m: List;
}

const MediaList: React.FC<Props> = ({ m }) => {
  const viewMode = useAppStore((state) => state.viewMode);
  return viewMode === "card" ? <MovieCard1 m={m} /> : <MovieCard2 m={m} />;
};
const MediaListVietSub = ({ m }: { m: VietSubResult["movies"][0] }) => {
  const viewMode = useAppStore((state) => state.viewMode);
  return viewMode === "card" ? <VietSubCard m={m} /> : <VietSubCard1 m={m} />;
};

export { MediaList, MediaListVietSub };
