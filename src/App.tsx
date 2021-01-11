import React, { Component } from 'react';
import { Alert } from 'antd';

import {
  AppState,
  AppProps,
  Genres,
  IMoovieDBRespons,
  ICard,
  IMoovieDBResponsWithGenres,
} from './components/types/interfaces';
import MoovieDB from './components/getData';
import 'antd/dist/antd.css';
import Spiner from './components/blocks/Spiner';
import Header from './components/layout/Header';
import CardList from './components/layout/CardList';

import './App.scss';

export default class App extends Component<AppProps, AppState> {
  moovieDB = new MoovieDB();

  constructor(props: AppState) {
    super(props);

    this.state = {
      cards: [],
      isLoading: true,
      isError: false,
      searchValue: 'return',
      genres: {},
    };
  }

  componentDidMount() {
    const { searchValue } = this.state;
    if (searchValue !== '') {
      Promise.all([
        this.moovieDB.getPage(1, searchValue).then((res) => res.results),
        this.moovieDB
          .getGenres()
          .then((res) => res.genres)
          .then((res) => {
            const result: Genres = {};
            for (const genre of res) {
              result[genre.id] = genre.name;
            }
            this.setState({ genres: result });
            return result;
          }),
      ])
        .then((res) => {
          const cards = res[0];
          const genres = res[1];
          cards.forEach((card: IMoovieDBRespons, cardIndex: number) => {
            card.genre_ids.forEach((genreId: number, genreIndex: number) => {
              cards[cardIndex].genre_ids[genreIndex] = genres[genreId];
            });
          });
          return cards;
        })
        .then((res) => {
          const cards = res.reduce((acc: ICard[], el: IMoovieDBResponsWithGenres) => {
            const card: ICard = {
              genres: el.genre_ids,
              id: el.id,
              description: el.overview,
              poster: el.poster_path,
              release: el.release_date,
              title: el.title,
              rating: el.vote_average,
              isRate: false,
            };
            acc.push(card);
            return acc;
          }, []);
          this.setState({
            cards,
            isLoading: false,
          });
        })
        .catch(this.onError);
    }
  }

  onError = () => {
    this.setState({ isError: true, isLoading: false });
  };

  onChangeInput = (text: string) => {
    const { genres } = this.state;

    this.setState({ searchValue: text });
    if (text !== '') {
      // TODO:
      // Debounce
      // Offline
      new Promise((resolve) => {
        const result = this.moovieDB.getPage(1, text).then((res) => res.results);
        resolve(result);
      })
        .then((res) => {
          const cards = res as IMoovieDBRespons[];
          cards.forEach((card, cardIndex) => {
            card.genre_ids.forEach((genreId: number, genreIndex: number) => {
              cards[cardIndex].genre_ids[genreIndex] = genres[genreId];
            });
          });
          return cards;
        })
        .then((res) => {
          const cards = res.reduce((acc: ICard[], el: IMoovieDBResponsWithGenres) => {
            const card: ICard = {
              genres: el.genre_ids,
              id: el.id,
              description: el.overview,
              poster: el.poster_path,
              release: el.release_date,
              title: el.title,
              rating: el.vote_average,
              isRate: false,
            };
            acc.push(card);
            return acc;
          }, []);
          this.setState({
            cards,
            isLoading: false,
          });
        })
        .catch(this.onError);
    }
  };

  render() {
    const { cards, isLoading, isError, searchValue } = this.state;

    return (
      <>
        {isLoading ? (
          <Spiner />
        ) : (
          <>
            {isError ? (
              <>
                <Header />
                <Alert message="Error" description="Something wrong... Try again" type="error" showIcon />
              </>
            ) : (
              <>
                <Header onChangeInput={this.onChangeInput} searchValue={searchValue} />
                <CardList cards={cards} />
              </>
            )}
          </>
        )}
      </>
    );
  }
}
