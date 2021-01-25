import React, { Component } from 'react';
import debounce from 'lodash/debounce';
import { Tabs, Pagination, Alert } from 'antd';
import { MovieProvider } from './helpers/MovieDB-contest';

import { AppState, AppProps, Genres, ICard, ImovieDBResponsWithGenres } from './types/interfaces';
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
    const { currentPage } = this.state;
    if (text !== '') {
      this.setState({ isLoading: true });
      new Promise((resolve) => {
        const result = this.movieDB.getPage(currentPage, text).then((res) => {
          const cards = res.results.reduce((acc: ICard[], el: ImovieDBResponsWithGenres) => {
            const card: ICard = {
              genres: el.genre_ids,
              id: el.id,
              description: el.overview,
              poster: el.poster_path,
              release: el.release_date,
              title: el.title,
              rating: el.rating,
              average: el.vote_average,
            };
            acc.push(card);
            return acc;
          }, []);
          this.setState({
            cards,
            totalCards: res.total_results,
          });
        });

        resolve(result);
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
      totalCardsRated: 0,
    };
  }

  componentDidMount() {
    const { searchValue, currentPage } = this.state;
    if (searchValue !== '') {
      Promise.all([
        this.movieDB.getPage(currentPage, searchValue).then((res) => {
          const cards = res.results.reduce((acc: ICard[], el: ImovieDBResponsWithGenres) => {
            const card: ICard = {
              genres: el.genre_ids,
              id: el.id,
              description: el.overview,
              poster: el.poster_path,
              release: el.release_date,
              title: el.title,
              rating: el.rating,
              average: el.vote_average,
            };
            acc.push(card);
            return acc;
          }, []);
          this.setState({
            cards,
            totalCards: res.total_results,
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

  getRated = () => {
    const { guestSessionId } = this.state;
    this.movieDB.getRatedMovies(guestSessionId).then((res) => {
      const cards = res.results.reduce((acc: ICard[], el: ImovieDBResponsWithGenres) => {
        const card: ICard = {
          genres: el.genre_ids,
          id: el.id,
          description: el.overview,
          poster: el.poster_path,
          release: el.release_date,
          title: el.title,
          rating: el.rating,
          average: el.vote_average,
        };
        acc.push(card);
        return acc;
      }, []);
      this.setState({
        rated: cards,
        totalCardsRated: res.total_results,
      });
    });
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
      totalCardsRated,
    } = this.state;
    return (
      <MovieProvider value={genresList}>
        <Tabs
          defaultActiveKey="1"
          centered
          onChange={() => {
            this.getRated();
          }}
        >
          <TabPane tab="Search" key="1">
            {isError ? (
              <>
                <Search onChangeInput={this.onChangeInput} searchValue={searchValue} />
                <Alert message="Error" description={errorMessage} type="error" showIcon />
              </>
            ) : (
              <>
                <Search onChangeInput={this.onChangeInput} searchValue={searchValue} />
                {isLoading ? <Spiner /> : <CardList cards={cards} guestSessionId={guestSessionId} />}
                {totalCards > 20 && !isLoading ? (
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
                <Alert message="Error" description={errorMessage} type="error" showIcon />
              </>
            ) : (
              <>
                {isLoading ? <Spiner /> : <CardList cards={rated} guestSessionId={guestSessionId} />}
                {totalCardsRated > 20 && !isLoading ? (
                  <Pagination
                    current={currentPage}
                    defaultPageSize={20}
                    showSizeChanger={false}
                    onChange={this.onChange}
                    total={totalCardsRated}
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
