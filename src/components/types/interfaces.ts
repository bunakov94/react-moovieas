export type AppState = {
  cards: ICard[];
  isLoading: boolean;
  isError: boolean;
  searchValue: string;
  genres: Genres;
  currentPage: number;
  totalCards: number;
  errorMessage: string;
};
export type AppProps = {};

export type CardListProps = {
  cards: ICard[];
};
export interface ICard {
  genres: string[];
  id: number;
  description: string;
  poster: string;
  release: string;
  title: string;
  rating: number;
  isRate: boolean;
}

export type Genres = {
  [id: number]: string;
};

export interface ImovieDBRespons {
  adult: boolean;
  backdrop_path: string;
  genre_ids: any;
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

export interface ImovieDBResponsWithGenres {
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
