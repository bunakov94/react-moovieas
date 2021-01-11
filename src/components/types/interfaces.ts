export type AppState = {
  cards: IResults[];
};
export type AppProps = {};

export type MoovieListProps = {
  moovies: IResults[];
};

export type MoovieProps = {};

export interface IResults {
  genres: string[];
  id: number;
  description: string;
  poster: string;
  release: string;
  title: string;
  rating: number;
  isRate: boolean;
}

export type TGenres = {
  [id: number]: string;
};

export interface IMoovieResponse {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface IMoovieResponse2 {
  adult: boolean;
  backdrop_path: string;
  genre_ids: string[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}
