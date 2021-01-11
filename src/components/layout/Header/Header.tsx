import React from 'react';
import Navigation from '../../blocks/Navigation';

import './Header.scss';

const Header = ({ onChangeInput, searchValue }: any) => (
  <header>
    <Navigation onChangeInput={onChangeInput} searchValue={searchValue} />
  </header>
);

export default Header;
