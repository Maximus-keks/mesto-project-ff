// Функции для работы с карточками //

// Функция создания карточки
export function createCard (cardData, deleteCard, likeCard, unlikeCard, openPopupImage, userId) {
  const cardTemplate = document.querySelector('#card-template').content; //темплейт карточки
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  
  const cardTitle = cardElement.querySelector('.card__title'); //название
  const cardImage = cardElement.querySelector('.card__image'); //изображение
  const deleteCardButton = cardElement.querySelector('.card__delete-button'); //кнопка удаления у карточки
  const likeCardButton = cardElement.querySelector('.card__like-button'); //кнопка лайк у карточки
  const likeCounter = cardElement.querySelector('.card__like-counter'); //счетчик лайков

  cardTitle.textContent = cardData.name;
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  likeCounter.textContent = cardData.likes.length;
  cardElement.dataset.cardId = cardData._id;
 
  cardImage.addEventListener('click', () => {
    openPopupImage(cardData.name, cardData.link)
  });
  
// Удаление карточки
  if (cardData.owner._id !== userId) {
    deleteCardButton.style.display = 'none';
  } else {
    deleteCardButton.addEventListener('click', () => {
      deleteCard(cardData._id)
        .then(() => {
          cardElement.remove();
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

// Постановка/удаление лайка
  if (cardData.likes.some((like) => like._id === userId)) {
    likeCardButton.classList.add('card__like-button_is-active');
  }

  likeCardButton.addEventListener('click', () => {
    if (likeCardButton.classList.contains('card__like-button_is-active')) {
      unlikeCard(cardData._id)
        .then((data) => {
          likeCardButton.classList.remove('card__like-button_is-active');
          likeCounter.textContent = data.likes.length;
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      likeCard(cardData._id)
        .then((data) => {
          likeCardButton.classList.add('card__like-button_is-active');
          likeCounter.textContent = data.likes.length;
        })
        .catch((err) => {
          console.log(err);
        });
    }    
  });

  return cardElement;
}