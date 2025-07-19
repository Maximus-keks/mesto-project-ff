// Объявления и инициализация глобальных констант и переменных с DOM-элементами страницы,
// Обработчики событий (при открытии и закрытии попапов; при отправке форм; обработчик, открывающий попап при клике по изображению карточки),
// Вызовы других функций, подключённых из созданных модулей.

import './pages/index.css' 
import {createCard} from './components/card.js';
import {openModal, closeModal, closePopupClickOverlay} from './components/modal.js';
import {enableValidation, clearValidation} from './components/validation.js';
import {getUserInfo, getInitialCards, editProfile, addNewCard, deleteCardApi, likeCard, unlikeCard, updateUserAvatar} from './components/api.js';

// @todo: DOM узлы
const cardList = document.querySelector('.places__list');
const popups = document.querySelectorAll('.popup'); //все поп-апы
const closePopupButtons = document.querySelectorAll('.popup__close'); //все крестики закрытия поп-ап

//блок с профилем
const profileName = document.querySelector('.profile__title'); //имя профиля
const editProfileButton = document.querySelector('.profile__edit-button'); //кнопка редактирования профиля
const profileDescription = document.querySelector('.profile__description'); //описание профиля (занятие)

const profileImage = document.querySelector('.profile__image'); //фото профиля
//поп-ап - редактирование фотографии профиля
const popupAvatar = document.querySelector('.popup_type_update-avatar');
const formEditAvatar = document.forms['update-avatar']; //форма редактирования фото профиля
const avatarLinkInput = formEditAvatar['avatar-link']; //ссылка на новое фото профиля

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

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type-error",
  errorClass: "popup__error_visible",
};

// Валидация всех форм, каждое поле формы проверяется отдельно.
enableValidation(validationConfig);

// Идентификатор пользователя
 let userId; 

// Обработчик события по клику на аватар
profileImage.addEventListener('click', () => {
  formEditAvatar.reset();
  clearValidation(formEditAvatar, validationConfig);
  openModal(popupAvatar);
});

// Утилитарная функция для изменения текста кнопки
function renderLoading(isLoading, button, defaultText) {
  if (isLoading) {
    button.textContent = 'Сохранение...';
  } else {
    button.textContent = defaultText;
  }
};

// Сохранение изменений редактирования фото профиля 
function handleEditAvatarFormSubmit(evt) {
  evt.preventDefault(); //отмена стандартной отправки формы  

  const submitButton = evt.submitter;
  const defaultText = submitButton.textContent;
  renderLoading(true, submitButton, defaultText);

  const avatarLink = avatarLinkInput.value
  updateUserAvatar(avatarLink)

  .then((userData) => {
    profileImage.style.backgroundImage = `url('${userData.avatar}')`;
    closeModal(popupAvatar)
  })
  .catch((err) => {
      console.log(err)
  })  
  .finally(() => {
    renderLoading(false, submitButton, defaultText);
  });
};

formEditAvatar.addEventListener('submit', handleEditAvatarFormSubmit); //обработчик к форме, который следит за событием “submit”

// Обработчик события на кнопку редактирования профиля
editProfileButton.addEventListener('click', function() {
  nameInput.value = profileName.textContent;
  jobInput.value = profileDescription.textContent;
  clearValidation(popupEdit, validationConfig); //очистка ошибок валидации
  openModal(popupEdit);
});

// Сохранение изменений редактирования профиля 
function handleProfileFormSubmit(evt) {
  evt.preventDefault(); //отмена стандартной отправки формы
  
  const submitButton = evt.submitter;
  const defaultText = submitButton.textContent;
  renderLoading(true, submitButton, defaultText);   
  
  const profileData = {
    name: nameInput.value,
    about: jobInput.value,
  };
  editProfile(profileData)

  .then((userData) => {
    profileName.textContent = userData.name;
    profileDescription.textContent = userData.about;
    closeModal(popupEdit)
  })
  .catch((err) => {
      console.log(err)
  })  
  .finally(() => {
    renderLoading(false, submitButton, defaultText);
  });
};

formEditProfile.addEventListener('submit', handleProfileFormSubmit); //обработчик к форме, который следит за событием “submit”
 
// Закрытие попапа при клике на крестик
closePopupButtons.forEach(function(button) {
  button.addEventListener('click', function() {
    const openedPopup = button.closest('.popup');
    closeModal(openedPopup);
  });
}); 

// Открывает попап с увеличенным изображением
function openPopupImage(cardName, cardLink) {
  popupImageElement.src = cardLink;
  popupImageElement.alt = cardName;
  popupCaption.textContent = cardName;
  openModal(popupImage);
};

// Обработчик событий на кнопку создания карточки
addCardButton.addEventListener('click', function() {
  formAddCard.reset(); //очищаем форму
  clearValidation(formAddCard, validationConfig); //очистка ошибок валидации
  openModal(popupAdd);
});

// Создание новой карточки
function handleAddCardFormSubmit(evt) {
  evt.preventDefault(); //отмена стандартной отправки формы
  
  const submitButton = evt.submitter;
  const defaultText = submitButton.textContent;
  renderLoading(true, submitButton, defaultText);   
    
  const newCard = { 
    name: cardNameInput.value, //получаем данные из формы
    link: cardLinkInput.value
  };
  addNewCard(newCard)

  .then((cardData) => {
    const cardElement = createCard(cardData, deleteCardApi, likeCard, unlikeCard, openPopupImage, userId); //создаем карточку
    cardList.prepend(cardElement); //добавляем новую карточку в начало списка
    closeModal(popupAdd);
  })
  .catch((err) => {
    console.log(err)
  })  
  .finally(() => {
    renderLoading(false, submitButton, defaultText);
  });
};

formAddCard.addEventListener('submit', handleAddCardFormSubmit); //обработчик к форме, который следит за событием “submit”

// Плавное открытие/закрытие поп-апов
popups.forEach(function(popup) {
  popup.classList.add('popup_is-animated');
  popup.addEventListener('click', closePopupClickOverlay); //слушатель для закрытия по клику на оверлей
});

// Получение данных о пользователе и карточек с сервера
Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    // Заполняем данные профиля
    profileName.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileImage.style.backgroundImage = `url(${userData.avatar})`;
    userId = userData._id;

    // Отображаем карточки на странице
    cards.forEach((cardData) => {
    const newCard = createCard(cardData, deleteCardApi, likeCard, unlikeCard, openPopupImage, userId);
    cardList.append(newCard);
    });
  })
  .catch((err) => {
    console.log(err)
  });