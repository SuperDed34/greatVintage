// Функция для загрузки контента в блок "content"
function loadContent(url) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var content = xhr.responseText;
      document.querySelector('.content').innerHTML = content;
    }
  };
  xhr.send();
}

// Обработчик события при загрузке страницы
document.addEventListener('readystatechange', function () {
  var defaultUrl = './project/pages/home.html';
  loadContent(defaultUrl);

  var menuItems = document.querySelectorAll('.navigation-bar_item a');
  menuItems.forEach(function (menuItem) {
    menuItem.addEventListener('click', function (event) {
     
      event.preventDefault();
      var url = this.getAttribute('href');
      console.log(url);
      if (url === './project/pages/shop.html') {
        setTimeout(addShopCards, 20);
         }
      loadContent(url); 
    });
  });
});


const addShopCards = function () {
  // Проверка наличия карточек товаров
  var shopCardPlace = document.querySelector('.shop-card-place');
  var existingCards = shopCardPlace.querySelectorAll('.card__wrapper');

  if (existingCards.length === 0) {
    // Асинхронно загружаем JSON файл
    var xhr = new XMLHttpRequest();
    xhr.open('GET', './project/assortment/assortment.json', true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        var cards = data.cards;

        // Создаем карточку товара для каждого элемента в JSON файле
        cards.forEach(function (card) {
          var cardWrapper = document.createElement('div');
          cardWrapper.classList.add('card__wrapper');
          cardWrapper.style.backgroundImage = 'url(' + card.photo + ')';

          var cardImage = document.createElement('div');
          cardImage.classList.add('card__image');
          // Установите фото товара в качестве фона cardImage
          //cardImage.style.backgroundImage = 'url(' + card.photo + ')';

          var cardHeader = document.createElement('div');
          cardHeader.classList.add('card__header');
          cardHeader.textContent = card.title;

          var cardDescription = document.createElement('div');
          cardDescription.classList.add('card__description');
          cardDescription.textContent = card.description;

          var cardPrice = document.createElement('div');
          cardPrice.classList.add('card__price');
          cardPrice.textContent = card.price;

          var expandButton = document.createElement('button');
          expandButton.classList.add('expand');

          // Добавляем все элементы карточки товара в cardWrapper
          cardWrapper.appendChild(cardImage);
          cardWrapper.appendChild(cardHeader);
          cardWrapper.appendChild(cardDescription);
          cardWrapper.appendChild(cardPrice);
          cardWrapper.appendChild(expandButton);

          // Добавляем cardWrapper в shopCardPlace
          shopCardPlace.appendChild(cardWrapper);
        });
      } else {
        console.error('Ошибка загрузки JSON файла');
      }
    };
    xhr.send();
  }
};
