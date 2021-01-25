export type AppState = {
  cards: ICard[];
  isLoading: boolean;
  isError: boolean;
  searchValue: string;
  genresList: Genres;
  currentPage: number;
  totalCards: number;
  errorMessage: string;
  guestSessionId: string;
  rated: ICard[];
  totalCardsRated: number;
};
export type AppProps = {};

export type CardListProps = {
  genres: any[];
  id: number;
  description: string;
  poster: string;
  release: string;
  title: string;
  rating: number;
  average: number;
  guestSessionId: string;
};
export interface ICard {
  genres: any[];
  id: number;
  description: string;
  poster: string;
  release: string;
  title: string;
  rating: number;
  average: number;
}

export interface ICard2 {
  genres: any[];
  id: number;
  description: string;
  poster: string;
  release: string;
  title: string;
  rating: number;
  average: number;
  guestSessionId: string;
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
  rating: number;
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
  rating: number;
}
