import { Component } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import css from './Modal.module.css';

const modalRoot = document.querySelector('#modal-root');

export class Modal extends Component {
  // метод вызываем после того, как компонент был добавлен в DOM-дерево
  componentDidMount() {
    // добавляем обработчик события нажатия клавиши на окне
    window.addEventListener('keydown', this.handleKeyDown);
  }

  // метод вызываем перед тем, как компонент будет удален из DOM-дерева
  componentWillUnmount() {
    // удаляем обработчик события нажатия клавиши на окне
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  // обработчик события нажатия клавиши на окне
  handleKeyDown = event => {
    // если нажата клавиша Escape
    if (event.code === 'Escape') {
      this.props.onClose();
    }
  };

  // обработчик клика по заднему фону модального окна
  handleBackdropClick = event => {
    // если клик был по заднему фону, а не по самому окну
    if (event.target === event.currentTarget) {
      this.props.onClose();
    }
  };

  render() {
    const {
      selectedImgCard: { largeImageURL, tags },
    } = this.props;

    // создаем портал для отображения модального окна
    return createPortal(
      <div className={css.Overlay} onClick={this.handleBackdropClick}>
        <div className={css.Modal}>
          <img src={largeImageURL} alt={tags} />
        </div>
      </div>,
      modalRoot
    );
  }
}

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  selectedImgCard: PropTypes.shape({}).isRequired,
};
