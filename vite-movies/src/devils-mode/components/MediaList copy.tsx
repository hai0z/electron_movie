import React from "react";
import { useAppStore } from "../../zustand/appState";
import { MovieCard1, MovieCard2 } from "./MovieCard";
import { List } from "../types";

interface Props {
  m: List;
}

const MediaList: React.FC<Props> = ({ m }) => {
  const viewMode = useAppStore((state) => state.viewMode);
  return viewMode === "card" ? <MovieCard1 m={m} /> : <MovieCard2 m={m} />;
};

export default MediaList;
