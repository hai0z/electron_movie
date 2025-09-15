export interface Hentai {
  id: number;
  title: string;
  slug: string;
  synopsis: string;
  createdAt: string;
  updatedAt: string;
  url: string;
  commentUrl: string;
  genres: Genre[];
  tags: Tag[];
  studios: Studio[];
  releaseYear: ReleaseYear;
  views: number;
  likes: number;
  dislikes: number;
  alternativeTitles: string[];
  thumbnail: string;
  poster: string;
  notes: string;
  censorship: string;
  category: string;
  languages: string[];
  isTrailer: boolean;
  links: string[];
}

export interface Genre {
  id: number;
  name: string;
  slug: string;
  thumbnail: string;
  taxonomy: string;
  description: string;
  count: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  thumbnail: string;
  taxonomy: string;
  description: string;
  count: number;
}

export interface Studio {
  id: number;
  name: string;
  slug: string;
  thumbnail: string;
  taxonomy: string;
  description: string;
  count: number;
}

export interface ReleaseYear {
  id: number;
  name: string;
  slug: string;
  thumbnail: string;
  taxonomy: string;
  description: string;
  count: number;
}
