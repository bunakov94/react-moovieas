import React from 'react';
import format from 'date-fns/format';
import { ICard } from '../../types/interfaces';
import './Card.scss';

const Card = ({ genres, description, poster, release, title, rating }: ICard) => {
  const cutTex = (text: string, limit: number) => {
    if (text.length < limit) {
      return text;
    }
    let res = text.slice(0, limit).split(' ').slice(0, -1).join(' ').replace(/,*$/, '');
    res += '...';
    return res;
  };

  return (
    <>
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
          <div className="movie-description__genre">
            {genres ? (
              <ul className="genres-list">
                {genres.map((genre, index) => (
                  <li className="genres-item" key={index.toLocaleString()}>
                    <span className="genre-item">{genre}</span>
                  </li>
                  // eslint-disable-next-line @typescript-eslint/indent
                ))}
              </ul>
            ) : null}
          </div>
          <p className="movie-description__text">{cutTex(description, 210)}</p>
          <footer className="movie-description__footer-rating">{rating}</footer>
        </div>
      </article>
    </>
  );
};

export default Card;
