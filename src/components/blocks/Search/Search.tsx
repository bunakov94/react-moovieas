import React from 'react';
import { SearchProps } from '../../types/interfaces';
import './Search.scss';

const Search = ({ onChangeInput, searchValue }: SearchProps) => {
  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    onChangeInput(value);
  };

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onChangeInput((event.currentTarget.search as HTMLInputElement).value);
  };

  return (
    <form className="search-form" onSubmit={submitForm}>
      <input
        type="text"
        name="search"
        className="search-form__input"
        placeholder="Type to search..."
        value={searchValue}
        onChange={(event) => onInputChange(event)}
      />
    </form>
  );
};

export default Search;
