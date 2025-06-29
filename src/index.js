//В файле index.js должны остаться:
// объявления и инициализация глобальных констант и переменных с DOM-элементами страницы,
// обработчики событий (при открытии и закрытии попапов; при отправке форм; обработчик, открывающий попап при клике по изображению карточки);
// вызовы других функций, подключённых из созданных модулей, которым нужно будет передавать объявленные здесь переменные и обработчики.

import './pages/index.css' 
import {initialCards} from './components/cards.js';
import {createCard, deleteCard, likeCard} from './components/card.js';
import {openModal, closeModal, closePopupClickOverlay} from './components/modal.js';

// @todo: DOM узлы
const cardList = document.querySelector('.places__list');
const popups = document.querySelectorAll('.popup'); //все поп-апы
const closePopupButtons = document.querySelectorAll('.popup__close'); //все крестики закрытия поп-ап

//блок с профилем
const profileName = document.querySelector('.profile__title'); //имя профиля
const editProfileButton = document.querySelector('.profile__edit-button'); //кнопка редактирования профиля
const profileDescription = document.querySelector('.profile__description'); //описание профиля (занятие)

//поп-ап - редактирование профиля
const popupEdit = document.querySelector('.popup_type_edit');
const formEditProfile = document.forms['edit-profile']; //форма редактирования профиля
const nameInput = formEditProfile['name']; //имя профиля
const jobInput = formEditProfile['description']; //описание профиля (занятие)

const addCardButton = document.querySelector('.profile__add-button'); //кнопка создания карточки
//поп-ап - создание карточки
const popupAdd = document.querySelector('.popup_type_new-card');
const formAddCard = document.forms['new-place']; //форма создания карточки
const cardNameInput = formAddCard['place-name']; //название картинки
const cardLinkInput = formAddCard['link']; //ссылка на картинку

//поп-ап - увеличенная карточка
const popupImage = document.querySelector('.popup_type_image'); 
const popupImageElement = document.querySelector('.popup__image'); //картинка
const popupCaption = document.querySelector('.popup__caption'); //текст

//Обработчик события на кнопку редактирования профиля
editProfileButton.addEventListener('click', function() {
  nameInput.value = profileName.textContent;
  jobInput.value = profileDescription.textContent;
  openModal(popupEdit);
});

//Сохранение изменений редактирования профиля 
function handleProfileFormSubmit(evt) {
  evt.preventDefault(); //отмена стандартной отправки формы
  profileName.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;
  closeModal(popupEdit);
};

formEditProfile.addEventListener('submit', handleProfileFormSubmit); //обработчик к форме, который следит за событием “submit”
 
//Закрытие попапа при клике на крестик
closePopupButtons.forEach(function(button) {
  button.addEventListener('click', function() {
    const openedPopup = button.closest('.popup');
    closeModal(openedPopup);
  });
}); 

// Открывает попап с увеличенным изображением
function openPopupImage(cardData) {
  popupImageElement.src = cardData.link;
  popupImageElement.alt = cardData.name;
  popupCaption.textContent = cardData.name;
  openModal(popupImage);
};

// Обработчик событий на кнопку создания карточки
addCardButton.addEventListener("click", function() {
  openModal(popupAdd);
});

// Создание карточки новой
function handleAddCardFormSubmit(evt) {
  evt.preventDefault(); //отмена стандартной отправки формы
  const newCard = { 
    name: cardNameInput.value, //получаем данные из формы
    link: cardLinkInput.value
  }
  const cardElement = createCard(newCard, deleteCard, likeCard, openPopupImage); //создаем карточку
  cardList.prepend(cardElement); //добавляем новую карточку в начало списка
  formAddCard.reset(); //очищаем форму
  closeModal(popupAdd);
};

formAddCard.addEventListener("submit", handleAddCardFormSubmit); //обработчик к форме, который следит за событием “submit”

// Плавное открытие/закрытие поп-апов
popups.forEach(function(popup) {
  popup.classList.add('popup_is-animated');
  popup.addEventListener('click', closePopupClickOverlay); //слушатель для закрытия по клику на оверлей
});

// @todo: Вывести карточки на страницу
initialCards.forEach(function (card) {
  const newCard = createCard(card, deleteCard, likeCard, openPopupImage);
  cardList.append(newCard);
});