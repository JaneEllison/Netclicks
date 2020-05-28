const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const API_KEY = '3f2ac48c16c55047b57ca3867e1810f1';

// меню

const leftMenu = document.querySelector('.left-menu'),
  hamburger = document.querySelector('.hamburger'),
  tvShowsList = document.querySelector('.tv-shows__list'),
  modal = document.querySelector('.modal');


// класс, который делает запросы серверу

class DBservice { 
  getData = async (url) => {  
    const res = await fetch(url); //отдельное api, которое есть в браузере
    if (res.ok) {
      return res.json();
    } else {
      throw new Error(`Не удалось получить данные по адресу ${url}`)
    }
  }

  getTestData = () => { //ф-ция асинхронная
    return this.getData('test.json') //перед тем как выполнить дождись выполнения
  }
};


// создание новых карточек
const renderCard = responce => {
  console.log (responce);
  tvShowsList.textContent=''; //очистили предыдущие карточки

  responce.results.forEach(item => {

    const {
      backdrop_path: backdrop,
      name: title, 
      poster_path: poster, 
      vote_average: vote
      } = item;  //поменяли название переменных, деструктуризация

    const posterImg = poster ? IMG_URL + poster : 'img/no-poster.jpg'; //если нет постера, то картинка вместо него
    const backDropIMG = backdrop ? IMG_URL + backdrop : ''; //если нет второго постера, то ничего не добавляем
    const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : ''; //если нет рейтинга, то ничего не добавляем

    const card = document.createElement('li'); //создали список, сколько карточек, столько и лишек
    card.className = 'tv-shows__item'; //добавили класс каждой лишке
    card.innerHTML = `
      <a href="#" class="tv-card">
        ${voteElem}
        <img class="tv-card__img"
          src="${posterImg}"
          data-backdrop="${backDropIMG}"
          alt="${title}">
         <h4 class="tv-card__head">${title}</h4>
      </a>
    `; //создали верстку для карточек

    tvShowsList.append(card); //вставляет в конец
  });

};

new DBservice().getTestData().then(renderCard); //вызывается renderCard


// открытие/закрытие меню

hamburger.addEventListener('click', () =>{
  leftMenu.classList.toggle('openMenu');
  hamburger.classList.toggle('open');
} );


// закрытие меню при клике вне

document.addEventListener('click', event => {
  const target = event.target;
  if (!target.closest('.left-menu')){
    leftMenu.classList.remove ('openMenu');
    hamburger.classList.remove ('open');
  }
});


// выпадающий список

leftMenu.addEventListener ('click', event =>{
  const target = event.target;
  const dropdown = target.closest ('.dropdown');
  if (dropdown) {
    dropdown.classList.toggle('active');
    leftMenu.classList.add('openMenu');
    hamburger.classList.add('open');
  }
});


// открытие модального окна

tvShowsList.addEventListener ('click', event => {
  
  event.preventDefault(); //не переходит в начало страницы
  
  const target = event.target; //показывает куда мы кликали
  const card = target.closest('.tv-card'); //получаем ссылку на карточку
  if (card) {
    document.body.style.overflow = 'hidden'; 
    modal.classList.remove ('hide');
  }
})


// закрытие модального окна

 modal.addEventListener('click', event =>{

  if (event.target.closest('.cross') ||    //closest поднимается и ищет класс
    event.target.classList.contains('modal')){  //если есть класс, то это true
    document.body.style.overflow = ''; 
    modal.classList.add ('hide');
  }
  });

  // смена карточки

  const changeImage = event => {
    const card = event.target.closest('.tv-shows__item');
    //mathes возвращает true/false, если событие происходи

    if (card) {
      const img = card.querySelector('.tv-card__img');
      if (img.dataset.backdrop) {
        [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src];
      }
    }
  };
tvShowsList.addEventListener ('mouseover', changeImage);
tvShowsList.addEventListener ('mouseout', changeImage);


//

