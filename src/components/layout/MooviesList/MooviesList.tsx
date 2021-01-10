import React from 'react';
import { MoovieListProps, IResults } from '../../types/interfaces';
import Moovie from '../../blocks/Moovie';

import './MooviesList.scss';

const MooviesList = ({ moovies }: MoovieListProps) => (
  <main className="moovie-list">
    {moovies.map((moovie: IResults) => (
      <Moovie key={moovie.id} {...moovie} />
    ))}
  </main>
);

export default MooviesList;
