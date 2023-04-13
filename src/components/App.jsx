import { Component } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { FetchApi } from './servises/Api';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

export class App extends Component {
  state = {
    searchQuery: '',
    page: 1,
    totalHits: 0,
    imageCards: [],
    loading: false,
    showModal: false,
    selectedImgCard: null,
    perPage: 12,
  };

  // метод обрабатывает изменения searchQuery и page,
  // и отправляет запрос на сервер с помощью FetchApi
  // для получения картинок. Если запрос не удался,
  // то он уведомляет пользователя об ошибке с помощью
  //  Notify.
  componentDidUpdate(_, prevState) {
    if (
      this.state.searchQuery !== prevState.searchQuery ||
      this.state.page !== prevState.page
    ) {
      const { searchQuery, page, perPage } = this.state;

      this.setState({ loading: true, totalHits: 0 });

      const fetchResponse = FetchApi(searchQuery, page, perPage);
      fetchResponse
        .then(resp => {
          console.log(resp);
          if (resp.data.hits.length === 0) {
            this.setState({ loading: false });
            Notify.warning('Oops! Find better)');
            return;
          }

          this.setState(() => ({
            imageCards: [...this.state.imageCards, ...resp.data.hits],
            totalHits: resp.data.totalHits,
          }));

          if (resp.data.total === 0) {
            Notify.warning(
              'Sorry, there are no images matching your search query. Please try again.'
            );
          }
        })
        .catch(error => {
          console.log(error);
          Notify.failure('Something went wrong...');
          this.setState({ loading: false });
        })
        .finally(() => this.setState({ loading: false }));
    }
  }

  // onSubmit()вызываем при отправке формы поиска. Он устанавливает
  // новое значение для searchQuery, если оно отличается от предыдущего значения.
  onSubmit = inputValue => {
    if (this.state.searchQuery !== inputValue) {
      this.setState({ searchQuery: inputValue, imageCards: [], page: 1 });
    }
  };

  // при нажатии кнопки увеличиваем значение page на 1
  onLoadBtnClick = () => {
    this.setState(({ page }) => ({
      page: page + 1,
    }));
  };

  // переключает значение showModal между true и false
  toggleModal = () => {
    this.setState(({ showModal }) => ({ showModal: !showModal }));
  };

  // вызываем при клике на картинку,  устанавливаем ее как
  // selectedImgCard и отображаем в модальном окне
  onImgClick = imgId => {
    const imageCard = this.state.imageCards.find(
      imageCard => imageCard.id === imgId
    );

    this.setState({ selectedImgCard: imageCard, showModal: true });
  };

  render() {
    const { imageCards, loading, totalHits, showModal, selectedImgCard, page } =
      this.state;

    return (
      <div>
        <Searchbar onSubmit={this.onSubmit} />

        {/* проверяем, есть ли imageCards, и если да, то отображаем галерею */}
        {imageCards.length > 0 && (
          <ImageGallery
            imageCardsArray={imageCards}
            onImgClick={this.onImgClick}
          />
        )}

        {showModal && (
          <Modal onClose={this.toggleModal} selectedImgCard={selectedImgCard} />
        )}

        {/*  Если loading true, то отображаем индикатор загрузки Loader */}
        {loading && <Loader />}

        {/* если картинок пришло больше 12, отображается кнопка Load more... */}
        {page * 12 <= totalHits && <Button onClick={this.onLoadBtnClick} />}
      </div>
    );
  }
}
