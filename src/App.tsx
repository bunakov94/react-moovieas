import React, { Component } from 'react';
import debounce from 'lodash/debounce';
import { Alert, Pagination } from 'antd';

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

  getData = debounce((text) => {
    const { genres, current } = this.state;
    if (text !== '') {
      this.setState({ isLoading: true });
      new Promise((resolve) => {
        const result = this.moovieDB.getPage(current, text).then((res) => {
          this.setState({ totalCards: res.total_results });
          return res.results;
        });

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
            isError: false,
          });
        })
        .catch((error) => this.onError(error));
    }
  }, 1000);

  constructor(props: AppState) {
    super(props);

    this.state = {
      cards: [],
      isLoading: true,
      isError: false,
      searchValue: 'return',
      genres: {},
      current: 1,
      totalCards: 0,
      errorMessage: '',
    };
  }

  componentDidMount() {
    const { searchValue, current } = this.state;
    if (searchValue !== '') {
      Promise.all([
        this.moovieDB.getPage(current, searchValue).then((res) => {
          this.setState({ totalCards: res.total_results });

          return res.results;
        }),
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

  onError = (error: any) => {
    this.setState({ isError: true, errorMessage: error.message, isLoading: false });
    if (!navigator.onLine) {
      this.setState({ errorMessage: 'Lost connection...' });
    }
  };

  onChangeInput = (text: string) => {
    this.setState({ searchValue: text });
    this.getData(text);
  };

  onChange = (page: number) => {
    const { searchValue } = this.state;
    this.setState({
      current: page,
      isLoading: true,
    });
    this.onChangeInput(searchValue);
  };

  render() {
    const { cards, isLoading, isError, searchValue, current, totalCards, errorMessage } = this.state;

    return (
      <>
        {isLoading ? (
          <Spiner />
        ) : (
          <>
            {isError ? (
              <>
                <Header onChangeInput={this.onChangeInput} searchValue={searchValue} />
                <Alert message="Error" description={errorMessage} type="error" showIcon />
              </>
            ) : (
              <>
                <Header onChangeInput={this.onChangeInput} searchValue={searchValue} />
                <CardList cards={cards} />
                {cards.length ? (
                  <Pagination
                    current={current}
                    defaultPageSize={20}
                    showSizeChanger={false}
                    onChange={this.onChange}
                    total={totalCards}
                  />
                ) : null}
              </>
            )}
          </>
        )}
      </>
    );
  }
}
