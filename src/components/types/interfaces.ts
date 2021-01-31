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

export interface AppState {
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
}

export interface AppProps {}

export interface CardProps extends ICard {
  guestSessionId: string;
  syncMovieRating: (id: number, rate: number) => void;
}

export type Genres = {
  [id: number]: number;
};

export interface ImovieDBResponseWithGenres {
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

export interface SearchProps {
  onChangeInput: (text: string) => void;
  searchValue: string;
}

export interface CardListProps {
  cards: ICard[];
  guestSessionId: string;
  syncMovieRating: (id: number, rate: number) => void;
}
