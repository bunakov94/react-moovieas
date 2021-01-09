export type AppState = {
  // currentPageMoovies: ICurrentPageMoovies[];
};
export type AppProps = {};

export type MoovieListProps = {
  // cutText: (text: string, limit: number) => string;
  // currentPageMoovies: ICurrentPageMoovies[];
};

export type MoovieProps = {};

export interface ICurrentPageMoovies {
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
