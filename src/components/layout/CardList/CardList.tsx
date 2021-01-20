import React from 'react';
import { CardListProps, ICard } from '../../types/interfaces';
import Card from '../../blocks/Card';

import './CardList.scss';

const CardList = ({ cards }: CardListProps) => (
  <main className="movie-list">
    {cards.length ? (
      cards.map((card: ICard) => <Card key={card.id} {...card} />)
    ) : (
      <h2 className="empty">There are no results for your request.</h2>
    )}
  </main>
);

export default CardList;
