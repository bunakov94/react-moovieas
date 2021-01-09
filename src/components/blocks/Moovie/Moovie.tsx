import React from 'react';
import './Moovie.scss';

const Moovie = () => (
  <>
    <article className="moovie">
      <img
        className="moovie__poster"
        src="https://i.pinimg.com/originals/75/47/d7/7547d70ae8714e715dd4e3b118898438.jpg"
        alt="poster"
      />
      <div className="moovie-description">
        <header className="moovie-description__header">
          <h1 className="moovie-description__name">The way back</h1>
          <div className="moovie-description__rating">Rating</div>
        </header>
        <p className="moovie-description__release">March 5, 2020</p>
        <div className="moovie-description__genre">
          <span className="genre-item">Action</span>
          <span className="genre-item">Drama</span>
        </div>
        <p className="moovie-description__text">
          A former basketball all-star, who has lost his wife and family foundation in a struggle with addiction
          attempts to regain his soul and salvation by becoming the coach of a disparate ethnically mixed high ...
        </p>
        <footer className="moovie-description__footer-rating">Rating</footer>
      </div>
    </article>
  </>
);

export default Moovie;
