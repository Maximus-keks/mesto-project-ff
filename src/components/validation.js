// Функции для валидации форм // 

// СООБЩЕНИЯ ОБ ОШИБКАХ
// Функция, которая добавляет класс с ошибкой
const showInputError = (formElement, inputElement, errorMessage, validationConfig) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`); //находим элемент ошибки внутри самой функции
  inputElement.classList.add(validationConfig.inputErrorClass);
  errorElement.textContent = errorMessage; //заменяем содержимое span с ошибкой на переданный параметр
  errorElement.classList.add(validationConfig.errorClass); //показываем сообщение об ошибке
};

// Функция, которая удаляет класс с ошибкой
const hideInputError = (formElement, inputElement, validationConfig) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`); //находим элемент ошибки внутри самой функции
  inputElement.classList.remove(validationConfig.inputErrorClass);
  errorElement.classList.remove(validationConfig.errorClass); //скрываем сообщение об ошибке
  errorElement.textContent = '';  //очищаем ошибку
};

// Функция проверки валидности поля
const isValid = (formElement, inputElement, validationConfig) => {
  if (inputElement.validity.patternMismatch) {  //проверка кастомного паттерна у элемента инпута
    inputElement.setCustomValidity(inputElement.dataset.errorMessage); //замена стандартного сообщения об ошибке
  } else {
    inputElement.setCustomValidity(""); //доступ к стандартным браузерным сообщениям
  }

  if (!inputElement.validity.valid) { //если поле не проходит валидацию, покажем ошибку
    showInputError(formElement, inputElement, inputElement.validationMessage, validationConfig);
  } else { //если проходит, скроем
    hideInputError(formElement, inputElement, validationConfig);
  }
}; 

// ОТКЛЮЧЕНИЕ КНОПКИ
// Проверка валидности всех полей
const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  })
}; 
 
// Функция отключения и включения кнопки
const toggleButtonState = (inputList, buttonElement, validationConfig) => {
  if (hasInvalidInput(inputList)) {  //если есть хотя бы один невалидный инпут
    buttonElement.disabled = true; //делаем кнопку неактивной
    buttonElement.classList.add(validationConfig.inactiveButtonClass);
  } else {
    buttonElement.disabled = false; //иначе делаем кнопку активной
    buttonElement.classList.remove(validationConfig.inactiveButtonClass);
  }
}; 

// Cлушатель событий для всех полей ввода внутри формы (принимает параметром элемент формы и добавляет её полям нужные обработчики) 
const setEventListeners = (formElement, validationConfig) => {
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector)); //находим все поля формы и делаем из них массив
  const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector); //находим в текущей форме кнопку отправки
    
  toggleButtonState(inputList, buttonElement, validationConfig); //проверка состояния кнопки в самом начале

  inputList.forEach((inputElement) => { //обходим все элементы полученной коллекции
    inputElement.addEventListener('input', () => { //каждому полю добавляем обработчик события input
      isValid(formElement, inputElement, validationConfig);
      toggleButtonState(inputList, buttonElement, validationConfig); //проверка состояния кнопки при изменении любого из полей
    });
  });
}; 

// Включение валидации всех форм
export const enableValidation = (validationConfig) => {
  const formList = Array.from(document.querySelectorAll(validationConfig.formSelector)); //находим все формы и делаем из них массив
  formList.forEach((formElement) => { //перебераем полученный массив
    setEventListeners(formElement, validationConfig);
  });
};

// Очистка ошибок валидации формы 
export const clearValidation = (formElement, validationConfig) => {
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
  const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector);

  inputList.forEach((inputElement) => hideInputError(formElement, inputElement, validationConfig));

  toggleButtonState(inputList, buttonElement, validationConfig);
};