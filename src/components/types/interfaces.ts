export type AppState = {
  genres?: IGenre[];
  results?: IResults[];
  pageNumber?: number;
  totalResults?: number;
};
export type AppProps = {};

export type MoovieListProps = {
  // cutText: (text: string, limit: number) => string;
  // currentPageMoovies: IResults[];
};

export type MoovieProps = {};

export interface IResults {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  popularity: number;
  vote_average: number;
  vote_count: number;
}

interface IGenre {
  id: number;
  name: string;
}
