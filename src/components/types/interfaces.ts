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
};

export interface ICard {
  genres: number[];
  id: number;
  description: string;
  poster: string;
  release: string;
  title: string;
  rating: number;
  average: number;
}

export type AppProps = {};

export type CardProps = {
  genres: number[];
  id: number;
  description: string;
  poster: string;
  release: string;
  title: string;
  rating: number;
  average: number;
  guestSessionId: string;
  syncMovieRating: Function;
};

export type Genres = {
  [id: number]: number;
};

export interface ImovieDBResponsWithGenres {
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
  rating: number;
}

export type SearchProps = {
  onChangeInput: (text: string) => void;
  searchValue: string;
};
export type CardListProps = {
  cards: ICard[];
  guestSessionId: string;
  syncMovieRating: Function;
};
