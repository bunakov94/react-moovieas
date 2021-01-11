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
    };
  }

  componentDidMount() {
    Promise.all([
      this.moovieDB.getPage(1).then((res) => res.results),
      this.moovieDB
        .getGenres()
        .then((res) => res.genres)
        .then((res) => {
          const result: Genres = {};
          for (const genre of res) {
            result[genre.id] = genre.name;
          }
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

  onError = () => {
    this.setState({ isError: true, isLoading: false });
  };

  render() {
    const { cards, isLoading, isError } = this.state;

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
                <Header />
                <CardList cards={cards} />
              </>
            )}
          </>
        )}
      </>
    );
  }
}
