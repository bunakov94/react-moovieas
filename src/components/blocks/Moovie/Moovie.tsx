import React from 'react';
import format from 'date-fns/format';
import { IResults } from '../../types/interfaces';
import './Moovie.scss';

const Moovie = ({ genres, description, poster, release, title, rating }: IResults) => {
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
      <article className="moovie">
        <img
          className="moovie__poster"
          src={
            poster
              ? `https://image.tmdb.org/t/p/original${poster}`
              : 'https://geodis.com/nz/sites/default/files/styles/max_800x800/public/2018-06/404.png?itok=3QGHNj64'
          }
          alt="poster"
        />
        <div className="moovie-description">
          <header className="moovie-description__header">
            <h1 className="moovie-description__name">{title}</h1>
            <div className="moovie-description__rating">{rating}</div>
          </header>
          <p className="moovie-description__release">{format(new Date(release), 'LLLL d, yyyy')}</p>
          <div className="moovie-description__genre">
            {genres
              ? genres.map((genre, index) => (
                  <span key={index.toLocaleString()} className="genre-item">
                    {genre}
                  </span>
                  // eslint-disable-next-line @typescript-eslint/indent
                ))
              : null}
          </div>
          <p className="moovie-description__text">{cutTex(description, 210)}</p>
          <footer className="moovie-description__footer-rating">{rating}</footer>
        </div>
      </article>
    </>
  );
};

export default Moovie;
