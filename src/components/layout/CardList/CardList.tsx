import React from 'react';
import { ICard } from '../../types/interfaces';
import Card from '../../blocks/Card';

import './CardList.scss';

const CardList = ({ cards, guestSessionId }: any) => (
  <main className="movie-list">
    {cards.length ? (
      cards.map((card: ICard) => <Card key={card.id} {...card} guestSessionId={guestSessionId} />)
    ) : (
      <h2 className="empty">There are no results for your request.</h2>
    )}
  </main>
);

export default CardList;
