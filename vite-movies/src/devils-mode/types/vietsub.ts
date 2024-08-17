export interface VietSubResult {
  status: boolean;
  msg: string;
  movies: Movie[];
  page: Page;
}

interface Page {
  current_page: number;
  from: number;
  to: number;
  total: number;
  per_page: number;
  last_page: number;
}

export interface Movie {
  id: string;
  name: string;
  slug: string;
  content: string;
  type: string;
  status: string;
  thumb_url: string;
  time: string;
  quality: string;
  lang: null | string;
  actors: string[];
  categories: Category[];
  country: Category;
  episodes: Episode[];
}

interface Episode {
  server_name: string;
  server_data: Serverdatum[];
}

interface Serverdatum {
  name: string;
  slug: string;
  link: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}
