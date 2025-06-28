// Работа модальных окон — в файл modal.js. Оттуда экспортируйте функции openModal и closeModal, принимающие в качестве аргумента DOM-элемент модального окна, с которым нужно произвести действие.

// Открытие попапа
export function openModal(popup) {
  popup.classList.add('popup_is-opened'); // добавляем класс открытия попапа
  document.addEventListener('keydown', closePopupWithEsc); // добавляем слушатель на кнопку Escape
};

// Закрытие попапа
export function closeModal(popup) {
  popup.classList.remove('popup_is-opened'); // удаляем класс открытия попапа
  document.removeEventListener('keydown', closePopupWithEsc); // удаляем слушатель на кнопку Escape
};

//Обработка закрытия попапа по нажатию клавиши Escape:
function closePopupWithEsc(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened'); // находим открытый попап
    if (openedPopup) {
      closeModal(openedPopup);
    }
  }
};

//Закрытие попапа при клике на оверлей:
export function closePopupClickOverlay (evt) {
  if (evt.target.classList.contains('popup')) {
    closeModal(evt.target);
  };
};