import React, { Component } from 'react';
import {
  AppState,
  AppProps,
  TGenres,
  IMoovieResponse,
  IResults,
  IMoovieResponse2,
} from './components/types/interfaces';
import MoovieDB from './components/getData';
import Header from './components/layout/Header';
import MooviesList from './components/layout/MooviesList';

import './App.scss';

// TODO: Types!!!
export default class App extends Component<AppProps, AppState> {
  moovieDB = new MoovieDB();

  constructor(props: AppState) {
    super(props);

    this.state = {
      cards: [],
    };
  }

  componentDidMount() {
    Promise.all([
      this.moovieDB.getPage(5).then((res) => res.results),
      this.moovieDB
        .getGenres()
        .then((res) => res.genres)
        .then((res) => {
          const result: TGenres = {};
          for (const item of res) {
            result[item.id] = item.name;
          }
          return result;
        }),
    ])
      .then((res) => {
        const cards = res[0];
        const genres = res[1];
        cards.forEach((card: IMoovieResponse, cardIndex: number) => {
          card.genre_ids.forEach((genreId: number, genreIndex: number) => {
            cards[cardIndex].genre_ids[genreIndex] = genres[genreId];
          });
        });
        return cards;
      })
      .then((res) => {
        const cards = res.reduce((acc: IResults[], el: IMoovieResponse2) => {
          const card: IResults = {
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
        });
      });
  }

  render() {
    const { cards } = this.state;

    return (
      <>
        <Header />
        <MooviesList moovies={cards} />
      </>
    );
  }
}
