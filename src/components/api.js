// Функции для взаимодействия с сервером //

const config = {
  baseUrl: 'https://nomoreparties.co./v1/wff-cohort-42',
  headers: {
    authorization: 'a8c9c542-b146-4df4-b7cd-eb955bcf3dba',
    'Content-Type': 'application/json'
  }
};

// Обработка ответов
const getResponseData = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
};

// Загрузка информации о пользователе с сервера
export const getUserInfo = () => {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers
  })
  .then((res) => {
    return getResponseData(res);
  });
};

// Загрузка карточек с сервера
export const getInitialCards = () => {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers
  })
  .then((res) => {
    return getResponseData(res);
  });
};

// Редактирование профиля
export const editProfile = ({ name, about }) => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({ name, about })
  })
  .then((res) => {
    return getResponseData(res);
  });
};

// Добавление новой карточки
export const addNewCard = ({ name, link }) => {
  return fetch(`${config.baseUrl}/cards`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({ name, link })
  })
  .then((res) => {
    return getResponseData(res);
  });
};

// Удаление карточки
export const deleteCardApi = (cardId) => {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: 'DELETE',
    headers: config.headers
  })
  .then((res) => {
    return getResponseData(res);
  });
};

// Постановка и снятие лайка
export const likeCard = (cardId) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: "PUT",
    headers: config.headers,
  })
  .then((res) => {
   return getResponseData(res);
  });
};

export const unlikeCard = (cardId) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: "DELETE",
    headers: config.headers,
  })
  .then((res) => {
    return getResponseData(res);
  });
};

// Обновление аватара пользователя
export const updateUserAvatar = (link) => {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      avatar: link
    })
  })
  .then((res) => {
    return getResponseData(res);
  });
};