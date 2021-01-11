import React from 'react';
import { CardListProps, ICard } from '../../types/interfaces';
import Card from '../../blocks/Card';

import './CardList.scss';

const CardList = ({ cards }: CardListProps) => (
  <main className="moovie-list">
    {cards.map((card: ICard) => (
      <Card key={card.id} {...card} />
    ))}
  </main>
);

export default CardList;
