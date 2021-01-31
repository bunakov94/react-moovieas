import React, { Component } from 'react';
import debounce from 'lodash/debounce';
import { Tabs, Pagination, Alert } from 'antd';
import { MovieProvider } from './helpers/MovieDB-contest';

import { AppState, AppProps, Genres } from './types/interfaces';
import MovieDB from './helpers/MovieDB';
import 'antd/dist/antd.css';
import Spiner from './blocks/Spiner';
import CardList from './layout/CardList';

import './App.scss';
import Search from './blocks/Search';

const { TabPane } = Tabs;

export default class App extends Component<AppProps, AppState> {
  movieDB = new MovieDB();

  getMovie = debounce(async (text: string) => {
    const { currentPage } = this.state;
    try {
      if (text.trim() !== '') {
        this.setState({ isLoading: true });
        const { cards, totalCards } = await this.movieDB.getPage(currentPage, text);
        this.setState({
          cards,
          totalCards,
          isLoading: false,
          isError: false,
        });
      }
    } catch (error) {
      this.onError(error);
    }
  }, 1000);

  constructor(props: AppState) {
    super(props);

    this.state = {
      cards: [],
      isLoading: true,
      isError: false,
      searchValue: '',
      genresList: {},
      currentPage: 1,
      totalCards: 0,
      errorMessage: '',
      guestSessionId: '',
      rated: [],
    };
  }

  async componentDidMount() {
    try {
      const [genres, getGuestId] = await Promise.all([this.movieDB.getGenres(), this.movieDB.getGuestId()]);
      const genresList: Genres = {};
      for (const genre of genres.genres) {
        genresList[genre.id] = genre.name;
      }
      const guestSessionId = getGuestId.guest_session_id;
      this.setState({ genresList, guestSessionId, isLoading: false });
    } catch (error) {
      this.onError(error);
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

  async getRatedMovie() {
    const { guestSessionId } = this.state;
    this.setState({
      isLoading: true,
    });

    try {
      const result = await this.movieDB.getPage(undefined, undefined, guestSessionId);
      this.setState({
        rated: result.cards,
        isLoading: false,
      });
    } catch (error) {
      this.onError(error);
    }
  }

  syncMovieRating = (id: number, rate: number) => {
    this.setState(({ cards: oldCards, rated: oldRated }) => {
      const cards = oldCards;
      const rated = oldRated;
      const cardIndex = cards.findIndex((card) => card.id === id);
      const ratedIndex = rated.findIndex((card) => card.id === id);
      if (ratedIndex !== -1) {
        if (rate === 0) {
          rated.splice(ratedIndex, 1);
        } else {
          rated[ratedIndex].rating = rate;
        }
      }
      cards[cardIndex].rating = rate;
      return { cards, rated };
    });
  };

  changeTab = (activeKey: string) => {
    if (+activeKey === 2) {
      this.getRatedMovie();
    }
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
        <Tabs defaultActiveKey="1" centered onChange={(key) => this.changeTab(key)}>
          <TabPane tab="Search" key="1">
            <Search onChangeInput={this.onChangeInput} searchValue={searchValue} />
            {isLoading && <Spiner />}
            {isError && <Alert message="Error" description={errorMessage} type="error" showIcon />}
            {!isLoading && !isError && (
              <CardList cards={cards} guestSessionId={guestSessionId} syncMovieRating={this.syncMovieRating} />
            )}
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
            {!isLoading && !isError && (
              <CardList cards={rated} guestSessionId={guestSessionId} syncMovieRating={this.syncMovieRating} />
            )}
          </TabPane>
        </Tabs>
      </MovieProvider>
    );
  }
}
