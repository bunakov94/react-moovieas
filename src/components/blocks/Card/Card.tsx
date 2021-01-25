import React from 'react';
import format from 'date-fns/format';
import { Rate } from 'antd';
import { MovieConsumer } from '../../helpers/MovieDB-contest';
import { Genres } from '../../types/interfaces';
import './Card.scss';
import MovieDB from '../../helpers/getData';

const Card = ({ genres, description, poster, release, title, rating, id, guestSessionId }: any) => {
  const movieDB = new MovieDB();

  const cutTex = (text: string, limit: number) => {
    if (text.length < limit) {
      return text;
    }
    let res = text.slice(0, limit).split(' ').slice(0, -1).join(' ').replace(/,*$/, '');
    res += '...';
    return res;
  };

  return (
    <MovieConsumer>
      {(genresList: Genres) => (
        <article className="movie">
          <img
            className="movie__poster"
            src={
              poster
                ? `https://image.tmdb.org/t/p/w342${poster}`
                : 'https://geodis.com/nz/sites/default/files/styles/max_800x800/public/2018-06/404.png?itok=3QGHNj64'
            }
            alt="poster"
          />
          <div className="movie-description">
            <header className="movie-description__header">
              <h1 className="movie-description__name">{title}</h1>
              <div className="movie-description__rating">{rating}</div>
            </header>
            <p className="movie-description__release">
              {release ? format(new Date(release), 'LLLL d, yyyy') : 'Unknown'}
            </p>
            {genres && (
              <div className="movie-description__genre">
                <ul className="genres-list">
                  {genres.map((genre: number, index: number) => (
                    <li className="genres-item" key={index.toLocaleString()}>
                      <span className="genre-item">{genresList[genre]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="movie-description__text">{cutTex(description, 150)}</p>
            <footer className="movie-description__footer-rating">
              <Rate
                className="stars"
                defaultValue={rating}
                count={10}
                onChange={(rate) => movieDB.rateMovie(guestSessionId, rate, id)}
              />
            </footer>
          </div>
        </article>
      )}
    </MovieConsumer>
  );
};

export default Card;
