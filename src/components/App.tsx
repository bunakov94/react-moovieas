import React, { Component } from 'react';
import debounce from 'lodash/debounce';
import { Tabs, Pagination, Alert } from 'antd';
import { MovieProvider } from './helpers/MovieDB-contest';

import { AppState, AppProps, Genres, ImovieDBRespons, ICard, ImovieDBResponsWithGenres } from './types/interfaces';
import MovieDB from './helpers/getData';
import 'antd/dist/antd.css';
import Spiner from './blocks/Spiner';
import CardList from './layout/CardList';

import './App.scss';
import Search from './blocks/Search';

const { TabPane } = Tabs;

export default class App extends Component<AppProps, AppState> {
  movieDB = new MovieDB();

  getData = debounce((text) => {
    const { genres, currentPage } = this.state;
    if (text !== '') {
      this.setState({ isLoading: true });
      new Promise((resolve) => {
        const result = this.movieDB.getPage(currentPage, text).then((res) => {
          this.setState({ totalCards: res.total_results });
          return res.results;
        });

        resolve(result);
      })
        .then((res) => {
          const cards = res as ImovieDBRespons[];
          cards.forEach((card, cardIndex) => {
            card.genre_ids.forEach((genreId: number, genreIndex: number) => {
              cards[cardIndex].genre_ids[genreIndex] = genres[genreId];
            });
          });
          return cards;
        })
        .then((res) => {
          const cards = res.reduce((acc: ICard[], el: ImovieDBResponsWithGenres) => {
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
      currentPage: 1,
      totalCards: 0,
      errorMessage: '',
    };
  }

  componentDidMount() {
    const { searchValue, currentPage } = this.state;
    if (searchValue !== '') {
      Promise.all([
        this.movieDB.getPage(currentPage, searchValue).then((res) => {
          this.setState({ totalCards: res.total_results });
          return res.results;
        }),
        this.movieDB
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
          cards.forEach((card: ImovieDBRespons, cardIndex: number) => {
            card.genre_ids.forEach((genreId: number, genreIndex: number) => {
              cards[cardIndex].genre_ids[genreIndex] = genres[genreId];
            });
          });
          return cards;
        })
        .then((res) => {
          const cards = res.reduce((acc: ICard[], el: ImovieDBResponsWithGenres) => {
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
      currentPage: page,
      isLoading: true,
    });
    this.onChangeInput(searchValue);
  };

  render() {
    const { cards, isLoading, isError, searchValue, currentPage, totalCards, errorMessage } = this.state;

    return (
      <MovieProvider value={this.movieDB}>
        <Tabs defaultActiveKey="1" centered>
          <TabPane tab="Search" key="1">
            {isError ? (
              <>
                <Search onChangeInput={this.onChangeInput} searchValue={searchValue} />
                <Alert message="Error" description={errorMessage} type="error" showIcon />
              </>
            ) : (
              <>
                <Search onChangeInput={this.onChangeInput} searchValue={searchValue} />
                {isLoading ? <Spiner /> : <CardList cards={cards} />}
                {cards.length && !isLoading ? (
                  <Pagination
                    current={currentPage}
                    defaultPageSize={20}
                    showSizeChanger={false}
                    onChange={this.onChange}
                    total={totalCards}
                  />
                ) : null}
              </>
            )}
          </TabPane>
          <TabPane tab="Rated" key="2">
            {isError ? (
              <>
                <Search onChangeInput={this.onChangeInput} searchValue={searchValue} />
                <Alert message="Error" description={errorMessage} type="error" showIcon />
              </>
            ) : (
              <>
                <Search onChangeInput={this.onChangeInput} searchValue={searchValue} />
                {isLoading ? <Spiner /> : <CardList cards={cards} />}
                {cards.length && !isLoading ? (
                  <Pagination
                    current={currentPage}
                    defaultPageSize={20}
                    showSizeChanger={false}
                    onChange={this.onChange}
                    total={totalCards}
                  />
                ) : null}
              </>
            )}
          </TabPane>
        </Tabs>
      </MovieProvider>
    );
  }
}
