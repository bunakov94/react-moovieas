import React from 'react';
import './Search.scss';

const Search = ({ onChangeInput, searchValue }: any) => {
  const fn = (event: any) => {
    onChangeInput(event.target.value);
  };

  return (
    <form className="search-form">
      <input
        type="text"
        className="search-form__input"
        placeholder="Type to search..."
        value={searchValue}
        onChange={(event) => fn(event)}
      />
    </form>
  );
};

export default Search;
