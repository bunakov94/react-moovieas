import React, { Component } from 'react';
import { AppState, AppProps } from './components/types/interfaces';
import MoovieDB from './components/getData';
import Header from './components/layout/Header';
import MooviesList from './components/layout/MooviesList';

import './App.scss';

export default class App extends Component<AppProps, AppState> {
  moovie = new MoovieDB();

  constructor(props: AppState) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    Promise.all([
      this.moovie.getPage(5).then((res) => res.results),
      this.moovie
        .getGenres()
        .then((res) => res.genres)
        .then((res) => {
          const result: any = {};
          for (const item of res) {
            result[item.id] = item.name;
          }
          return result;
        }),
    ])
      .then((res) => {
        res[0].forEach((element: any, index: number) => {
          element.genre_ids.forEach((el: any, i: number) => {
            res[0][index].genre_ids[i] = res[1][el];
          });
        });
        return res[0];
      })
      .then((res) => {
        const results = res.reduce((acc: any, el: any) => {
          const item = {
            genres: el.genre_ids,
            id: el.id,
            description: el.overview,
            poster: el.poster_path,
            release: el.release_date,
            title: el.title,
            rating: el.vote_average,
            isRate: false,
          };
          acc.push(item);
          return acc;
        }, []);
        this.setState({
          results,
        });
      });
  }

  render() {
    const { results, genres } = this.state;
    console.log(results, genres);

    return (
      <>
        <Header />
        <MooviesList />
      </>
    );
  }
}
