export type AppState = {
  results: IResults[];
};
export type AppProps = {};

export type MoovieListProps = {
  // cutText: (text: string, limit: number) => string;
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
