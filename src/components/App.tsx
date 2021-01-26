import React, { Component } from 'react';
import debounce from 'lodash/debounce';
import { Tabs, Pagination, Alert } from 'antd';
import { MovieProvider } from './helpers/MovieDB-contest';

import { AppState, AppProps, ICard, Genres } from './types/interfaces';
import MovieDB from './helpers/MovieDB';
import 'antd/dist/antd.css';
import Spiner from './blocks/Spiner';
import CardList from './layout/CardList';

import './App.scss';
import Search from './blocks/Search';

const { TabPane } = Tabs;

export default class App extends Component<AppProps, AppState> {
  movieDB = new MovieDB();

  getMovie = debounce((text: string) => {
    const { currentPage } = this.state;
    if (text !== '') {
      this.setState({ isLoading: true });
      this.movieDB
        .getPage(currentPage, text)
        .then((res: { cards: ICard[]; totalCards: number }) => {
          this.setState({
            cards: res.cards,
            totalCards: res.totalCards,
          });
        })
        .then(() => this.setState({ isLoading: false }))
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
      genresList: {},
      currentPage: 1,
      totalCards: 0,
      errorMessage: '',
      guestSessionId: '',
      rated: [],
    };
  }

  componentDidMount() {
    const { searchValue, currentPage } = this.state;
    if (searchValue !== '') {
      Promise.all([
        this.movieDB.getPage(currentPage, searchValue).then((res: { cards: ICard[]; totalCards: number }) => {
          this.setState({
            cards: res.cards,
            totalCards: res.totalCards,
          });
        }),

        this.movieDB
          .getGenres()
          .then((res) => res.genres)
          .then((res) => {
            const result: Genres = {};
            for (const genre of res) {
              result[genre.id] = genre.name;
            }
            this.setState({ genresList: result });
          }),

        this.movieDB.getGuestId().then((res) => this.setState({ guestSessionId: res.guest_session_id })),
      ])
        .then(() => this.setState({ isLoading: false }))
        .catch(this.onError);
    }
  }

  onError = (error: Error) => {
    this.setState({ isError: true, errorMessage: error.message, isLoading: false });
    if (!navigator.onLine) {
      this.setState({ errorMessage: 'Lost connection...' });
    }
  };

  onChangeInput = (text: string) => {
    this.setState({ searchValue: text });
    this.getMovie(text);
  };

  onChangePage = (page: number) => {
    const { searchValue } = this.state;
    this.setState({
      currentPage: page,
      isLoading: true,
    });
    this.onChangeInput(searchValue);
  };

  getRatedMovie = () => {
    const { guestSessionId } = this.state;
    this.movieDB
      .getPage(undefined, undefined, guestSessionId)
      .then((res) => {
        this.setState({
          rated: res.cards,
        });
      })
      .then(() => this.setState({ isLoading: false }))
      .catch((error) => this.onError(error));
  };

  render() {
    const {
      cards,
      isLoading,
      isError,
      searchValue,
      currentPage,
      totalCards,
      errorMessage,
      genresList,
      guestSessionId,
      rated,
    } = this.state;
    return (
      <MovieProvider value={genresList}>
        <Tabs defaultActiveKey="1" centered onChange={() => this.getRatedMovie()}>
          <TabPane tab="Search" key="1">
            <Search onChangeInput={this.onChangeInput} searchValue={searchValue} />
            {isLoading && <Spiner />}
            {isError && <Alert message="Error" description={errorMessage} type="error" showIcon />}
            {!isLoading && !isError && <CardList cards={cards} guestSessionId={guestSessionId} />}
            {totalCards > 20 && !isLoading && !isError && (
              <Pagination
                current={currentPage}
                defaultPageSize={20}
                showSizeChanger={false}
                onChange={this.onChangePage}
                total={totalCards}
              />
            )}
          </TabPane>
          <TabPane tab="Rated" key="2">
            {isError && <Alert message="Error" description={errorMessage} type="error" showIcon />}
            {isLoading && <Spiner />}
            {!isLoading && !isError && <CardList cards={rated} guestSessionId={guestSessionId} />}
          </TabPane>
        </Tabs>
      </MovieProvider>
    );
  }
}
