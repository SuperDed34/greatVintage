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
document.addEventListener('DOMContentLoaded', function () {
  var defaultUrl = './project/pages/home.html';
  loadContent(defaultUrl);

  var menuItems = document.querySelectorAll('.navigation-bar_item a');
  menuItems.forEach(function (menuItem) {
    menuItem.addEventListener('click', function (event) {
      event.preventDefault();
      var url = this.getAttribute('href');
      loadContent(url);
    });
  });
});