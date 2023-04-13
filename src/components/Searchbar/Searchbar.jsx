import { Component } from 'react';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import PropTypes from 'prop-types';
import { IoSearchSharp } from 'react-icons/io5';
import css from './Searchbar.module.css';

export class Searchbar extends Component {
  state = { inputValue: '' };

  //handleChange вызываем, когда вводим текст в поисковую
  // строку и обновляем inputValue
  handleChange = event => {
    this.setState({ inputValue: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    if (this.state.inputValue.trim() === '') {
      Notify.warning('Opss...try again');
      return;
    }
    this.props.onSubmit(this.state.inputValue);
    this.setState({ inputValue: '' });
  };

  render() {
    return (
      <header className={css.Searchbar}>
        <form className={css.SearchForm} onSubmit={this.handleSubmit}>
          <button className={css.SearchFormButton} type="submit">
            <span>
              <IoSearchSharp size={24} />
            </span>
          </button>

          <input
            className={css.SearchFormInput}
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Search images"
            value={this.state.inputValue}
            onChange={this.handleChange}
          />
        </form>
      </header>
    );
  }
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
