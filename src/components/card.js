//Функции для работы с карточками проекта Mesto вынесите в файл card.js, из него должна экспортироваться функция createCard, которую вы создали раньше 
//Функции, обрабатывающие события лайка и удаления карточки, также должны находиться в этом файле и экспортироваться из него.


//Функция создания карточки
export function createCard (cardData, deleteCard, likeCard, openImagePopup) {
  const cardTemplate = document.querySelector('#card-template').content; //темплейт карточки
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  
  const cardTitle = cardElement.querySelector('.card__title'); //название
  const cardImage = cardElement.querySelector('.card__image'); //изображение
  cardTitle.textContent = cardData.name;
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
 
  cardImage.addEventListener("click", function() {
    openImagePopup(cardData)
  });

  const deleteCardButton = cardElement.querySelector('.card__delete-button'); //кнопка удаления у карточки
  deleteCardButton.addEventListener('click', function() {
    deleteCard(cardElement);
  });
  
  const likeCardButton = cardElement.querySelector('.card__like-button'); //кнопка лайк у карточки
  likeCardButton.addEventListener('click', function() {
    likeCard(likeCardButton);
  });
  
  return cardElement;
}; 

//Функция удаления карточки
export function deleteCard (cardElement) {
  cardElement.remove();
}; 

// Функция лайка карточки 
export function likeCard(cardElement) { 
  cardElement.classList.toggle('card__like-button_is-active'); 
};