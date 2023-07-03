function loadContent(url) {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        let content = xhr.responseText;
        document.querySelector('.content').innerHTML = content;

        if (url === './project/pages/shop.html') {
          let shopCardPlace = document.querySelector('.shop-card-place');
          shopCardPlace.innerHTML = ''; // Очистить место для карточек товаров
          addShopCards();
        }
      } else {
        console.error('Ошибка загрузки контента:', xhr.status);
      }
    }
  };

  function addSliderButtons() {
  let bigCardPlace = document.querySelector('.big-card-place');

  if (bigCardPlace) {
    let prevButton = document.createElement('button');
    prevButton.classList.add('slider-button', 'prev');
    prevButton.innerHTML = '&#8249;'; // Измененный код стрелки влево

    let nextButton = document.createElement('button');
    nextButton.classList.add('slider-button', 'next');
    nextButton.innerHTML = '&#8250;'; // Измененный код стрелки вправо

    bigCardPlace.appendChild(prevButton);
    bigCardPlace.appendChild(nextButton);

    prevButton.addEventListener('click', function () {
      scrollSlider(-1);
    });

    nextButton.addEventListener('click', function () {
      scrollSlider(1);
    });
  }
}

  xhr.onerror = function () {
    console.error('Ошибка сети при загрузке контента');
  };
  xhr.send();
}

function addShopCards() {
  // Проверка наличия карточек товаров
  let shopCardPlace = document.querySelector('.shop-card-place');
  let existingCards = shopCardPlace.querySelectorAll('.card__wrapper');

  if (existingCards.length === 0) {
    // Асинхронно загружаем JSON файл
    fetch('./project/assortment/assortment.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Ошибка загрузки JSON файла');
        }
        return response.json();
      })
      .then(data => {
        let cards = data.cards;

        // Создаем фрагмент, чтобы избежать многократной перерисовки DOM
        let fragment = document.createDocumentFragment();

        // Создаем карточку товара для каждого элемента в JSON файле
        cards.forEach(card => {
          let cardWrapper = document.createElement('div');
          cardWrapper.classList.add('card__wrapper');
          cardWrapper.style.backgroundImage = `url(${card.photo})`;

          let cardImage = document.createElement('div');
          cardImage.classList.add('card__image');

          let cardHeader = document.createElement('div');
          cardHeader.classList.add('card__header');
          cardHeader.textContent = card.title;

          let cardDescription = document.createElement('div');
          cardDescription.classList.add('card__description');
          cardDescription.textContent = card.description;

          let cardPrice = document.createElement('div');
          cardPrice.classList.add('card__price');
          cardPrice.textContent = `Price: ${card.price}£`;

          let expandButton = document.createElement('button');
          expandButton.classList.add('expand');

          // Добавляем все элементы карточки товара в cardWrapper
          cardWrapper.appendChild(cardImage);
          cardWrapper.appendChild(cardHeader);
          cardWrapper.appendChild(cardDescription);
          cardWrapper.appendChild(cardPrice);
          cardWrapper.appendChild(expandButton);

          // Добавляем cardWrapper во фрагмент
          fragment.appendChild(cardWrapper);
        });

        // Добавляем фрагмент со всеми карточками в место для карточек товаров
        shopCardPlace.appendChild(fragment);

        // Добавление обработчика события клика на карточки товаров
        let cardWrappers = document.querySelectorAll('.card__wrapper');
        cardWrappers.forEach(cardWrapper => {
          cardWrapper.addEventListener('click', openBigCard);
        });
      })
      .catch(error => {
        console.error('Ошибка загрузки JSON файла:', error);
      });
  }
}

const openBigCard = function (event) {
  let target = event.target;
  if (target.classList.contains('card__wrapper')) {
    // Обработка клика на карточке товара
    let cardHeader = target.querySelector('.card__header');
    let content = cardHeader.innerHTML;

    // Загрузка JSON файла для нужного контейнера
    fetch('./project/assortment/assortment.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Ошибка загрузки JSON файла');
        }
        return response.json();
      })
      .then(data => {
        let desiredTitle = cardHeader.textContent.trim();
        let desiredCard = data.cards.find(card => card.title === desiredTitle);

        if (desiredCard) {
          // Создаем блок большой карточки товара
          let bigCardWrapper = document.createElement('div');
          bigCardWrapper.classList.add('big-card__wrapper');

          let bigCardClose = document.createElement('div');
          bigCardClose.classList.add('big-card__close');
          bigCardClose.textContent = 'X';

          let bigCardBody = document.createElement('div');
          bigCardBody.classList.add('big-card__body');

          let bigCardHeader = document.createElement('div');
          bigCardHeader.classList.add('big-card__header');
          bigCardHeader.textContent = desiredCard.title;

          let bigCardSlider = document.createElement('div');
          bigCardSlider.classList.add('big-card__slider');

          let bigCardDescription = document.createElement('div');
          bigCardDescription.classList.add('big-card__description');
          bigCardDescription.textContent = desiredCard.detail_description;

          let bigCardPrice = document.createElement('div');
          bigCardPrice.classList.add('big-card__price');
          bigCardPrice.textContent = 'Price: ' + desiredCard.price;

          let bigCardMakeBuy = document.createElement('button');
          bigCardMakeBuy.classList.add('big-card__make-buy');
          bigCardMakeBuy.textContent = 'Make Buy';

          let prevButton = document.createElement('button');
          prevButton.classList.add('slider-button', 'prev');
          prevButton.innerHTML = '&lt;'; // Код стрелки влево

          let nextButton = document.createElement('button');
          nextButton.classList.add('slider-button', 'next');
          nextButton.innerHTML = '&gt;'; // Код стрелки впра

          // Добавляем элементы в блок большой карточки
          
          bigCardBody.appendChild(bigCardClose);
          bigCardBody.appendChild(bigCardHeader);
          bigCardBody.appendChild(bigCardSlider);
          bigCardBody.appendChild(bigCardDescription);
          bigCardBody.appendChild(bigCardPrice);
          bigCardBody.appendChild(bigCardMakeBuy);
          bigCardBody.appendChild(prevButton);
          bigCardBody.appendChild(nextButton);
          bigCardWrapper.appendChild(bigCardBody);

          prevButton.addEventListener('click', function () {
            scrollSlider(-1);
          });

          nextButton.addEventListener('click', function () {
            scrollSlider(1);
          });

          // Добавление фотографий вместо слайдера
          addPhotos(desiredCard.photos, bigCardSlider);

          // Добавляем блок большой карточки в нужное место на странице
          let bigCardPlace = document.querySelector('.big-card-place');
          if (bigCardPlace) {
            bigCardPlace.innerHTML = '';
            bigCardPlace.appendChild(bigCardWrapper);

            // Добавление обработчика события клика для закрытия карточки
            bigCardWrapper.addEventListener('click', function (event) {
              if (
                event.target === bigCardWrapper ||
                event.target.classList.contains('big-card__close')
              ) {
                bigCardPlace.innerHTML = '';
              }
            });
          } else {
            console.error('Элемент .big-card-place не найден на странице');
          }
        } else {
          console.log('Карта не найдена в JSON файле');
        }
      })
      .catch(error => {
        console.error('Ошибка загрузки JSON файла:', error);
      });
  }
};

function addPhotos(photos, sliderElement) {
  sliderElement.innerHTML = '';

  photos.forEach(photoSrc => {
    let photo = document.createElement('div');
    photo.classList.add('photo');
    photo.style.backgroundImage = `url(./${photoSrc})`; // Измененный путь к фотографии

    sliderElement.appendChild(photo);
  });
}

// Остальной код без изменений

document.addEventListener('DOMContentLoaded', function () {
  let defaultUrl = './project/pages/home.html';
  loadContent(defaultUrl);

  let menuItems = document.querySelectorAll('.navigation-bar_item a');
  menuItems.forEach(menuItem => {
    menuItem.addEventListener('click', function (event) {
      event.preventDefault();
      let url = this.getAttribute('href');
      loadContent(url);
    });
  });
});

document.addEventListener('DOMContentLoaded', function () {
  let defaultUrl = './project/pages/home.html';
  loadContent(defaultUrl);

  let menuItems = document.querySelectorAll('.navigation-bar_item a');
  menuItems.forEach(menuItem => {
    menuItem.addEventListener('click', function (event) {
      event.preventDefault();
      let url = this.getAttribute('href');
      loadContent(url);
    });
  });
});

function addSliderButtons() {
  let bigCardPlace = document.querySelector('.big-card-place');

  if (bigCardPlace) {
    let prevButton = document.createElement('button');
    prevButton.classList.add('slider-button', 'prev');
    prevButton.innerHTML = '&lt;'; // Код стрелки влево

    let nextButton = document.createElement('button');
    nextButton.classList.add('slider-button', 'next');
    nextButton.innerHTML = '&gt;'; // Код стрелки вправо

    bigCardPlace.appendChild(prevButton);
    bigCardPlace.appendChild(nextButton);

    prevButton.addEventListener('click', function () {
      scrollSlider(-1);
    });

    nextButton.addEventListener('click', function () {
      scrollSlider(1);
    });
  }
}

// Функция для прокрутки слайдера
function scrollSlider(direction) {
  let slider = document.querySelector('.big-card__slider');
  let scrollAmount = 300 * direction; // Измените значение 300 на желаемую ширину прокрутки

  slider.scrollBy({
    left: scrollAmount,
    behavior: 'smooth'
  });
}

// Вызываем функцию для добавления кнопок и функционала
addSliderButtons();