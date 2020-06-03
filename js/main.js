const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';


// меню

const leftMenu = document.querySelector('.left-menu'),
  hamburger = document.querySelector('.hamburger'),
  tvShowsList = document.querySelector('.tv-shows__list'),
  modal = document.querySelector('.modal'),
  twShows = document.querySelector ('.tv-shows'),
  tvCardImg = document.querySelector ('.tv-card__img'),
  modalTitle = document.querySelector('.modal__title'),
  genresList = document.querySelector('.genres-list'),
  rating = document.querySelector('.rating'),
  description = document.querySelector('.description'),
  modalLink = document.querySelector('.modal__link'),
  searchForm = document.querySelector('.search__form'),
  searchFormInput = document.querySelector('.search__form-input'),
  preloader = document.querySelector ('.preloader'),
  dropdown = document.querySelectorAll('.dropdown'),
  tvShowsHead = document.querySelector ('.tv-shows__head'),
  posterWrapper = document.querySelector ('.poster__wrapper'),
  modalContent = document.querySelector ('.modal__content'),
  pagination = document.querySelector ('.pagination');

const loading = document.createElement('div'); //создали новый эл-т
loading.className = 'loading';  //присвоили эл-ту класс

  // класс, который делает запросы серверу

class DBService { 
  
  constructor(){
    this.SERVER = 'https://api.themoviedb.org/3';
    this.API_KEY = '3f2ac48c16c55047b57ca3867e1810f1';
  }
  getData = async (url) => {  
    
    const res = await fetch(url); //отдельное api, которое есть в браузере
    if (res.ok) {
      return res.json();
    } else {
      throw new Error(`Не удалось получить данные по адресу ${url}`)
    }
  };

  getTestData = () => { //ф-ция асинхронная
    return this.getData('test.json'); //перед тем как выполнить дождись выполнения
  };

  getTestCard = () => {
    return this.getData('card.json');
  };

  getSearchResult = (query) => {
    this.temp = `${this.SERVER}/search/tv?api_key=${this.API_KEY}&language=ru-RU&query=${query}`;
    return this.getData(this.temp);
  }

  getNextPage = page =>{
    return this.getData (this.temp + '&page=' + page);
  }

  getTvShov = id => {
    return this.getData(`${this.SERVER}/tv/${id}?api_key=${this.API_KEY}&language=ru-RU`);
  }

  getTopRated = () => this.getData(`${this.SERVER}/tv/top_rated?api_key=${this.API_KEY}&language=ru-RU`);
  
  getPopular = () => this.getData(`${this.SERVER}/tv/popular?api_key=${this.API_KEY}&language=ru-RU`);
  
  getToday = () => this.getData(`${this.SERVER}/tv/airing_today?api_key=${this.API_KEY}&language=ru-RU`);
  
  getWeek = () => this.getData(`${this.SERVER}/tv/on_the_air?api_key=${this.API_KEY}&language=ru-RU`);

};

const dbService = new DBService();


// создание новых карточек
const renderCard = (responce, target) => {

  tvShowsList.textContent=''; //очистили предыдущие карточки

  if(!responce.total_results){
    loading.remove();
    tvShowsHead.textContent = 'К сожалению по вашему запросу ничего не найдено. :(';
    tvShowsHead.style.cssText = 'color:green'; //чтобы прописать несколько стилей
    return;
  }

  tvShowsHead.textContent = target ? target.textContent: 'Результат поиска:';

  responce.results.forEach(item => {
    const {
      backdrop_path: backdrop,
      name: title, 
      poster_path: poster, 
      vote_average: vote, 
      id
      } = item;  //поменяли название переменных, деструктуризация

    const posterImg = poster ? IMG_URL + poster : 'img/no-poster.jpg'; //если нет постера, то картинка вместо него
    const backDropIMG = backdrop ? IMG_URL + backdrop : ''; //если нет второго постера, то ничего не добавляем
    const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : ''; //если нет рейтинга, то ничего не добавляем

    const card = document.createElement('li'); //создали список, сколько карточек, столько и лишек
    card.idTV = id;
    card.className = 'tv-shows__item'; //добавили класс каждой лишке
    card.innerHTML = `
      <a href="#" id="${id}" class="tv-card">
        ${voteElem}
        <img class="tv-card__img"
          src="${posterImg}"
          data-backdrop="${backDropIMG}"
          alt="${title}">
         <h4 class="tv-card__head">${title}</h4>
      </a>
    `; //создали верстку для карточек
    
    loading.remove();
    tvShowsList.append(card); //вставляет в конец
  });

  pagination.textContent = '';
 
  if (!target && responce.total_pages > 1) {
    for (let i = 1; i <= responce.total_pages; i++) {
      pagination.innerHTML += `<li><a href="#" class ="pages">${i}</a></li>`
    }
  }
};

searchForm.addEventListener('submit', event => {
  event.preventDefault();
  const value = searchFormInput.value.trim(); //трим убирает пробелы
  if (value) {
    dbService.getSearchResult(value).then(renderCard); //вызывается renderCard  
    twShows.append(loading);
  }
  searchFormInput.value = "";
  
});



// открытие/закрытие меню

const closeDropdown = () => {
  dropdown.forEach(item => {
    item.classList.remove ('active');
  })
};

hamburger.addEventListener('click', () =>{
  leftMenu.classList.toggle('openMenu');
  hamburger.classList.toggle('open');
  closeDropdown();
} );


// закрытие меню при клике вне

document.addEventListener('click', event => {
  const target = event.target;
  if (!target.closest('.left-menu')){
    leftMenu.classList.remove ('openMenu');
    hamburger.classList.remove ('open');
    closeDropdown();
  }
});


// выпадающий список

leftMenu.addEventListener ('click', event =>{
  event.preventDefault ();
  const target = event.target;
  const dropdown = target.closest ('.dropdown');
  if (dropdown) {
    dropdown.classList.toggle('active');
    leftMenu.classList.add('openMenu');
    hamburger.classList.add('open');
  }
  
  if (target.closest('#top-rated')) {
    twShows.append(loading);
    dbService.getTopRated().then((responce) => renderCard(responce, target));
  }

  if (target.closest('#popular')) {
    twShows.append(loading);
    dbService.getPopular().then((responce) => renderCard(responce, target));
  }

  if (target.closest('#week')) {
    twShows.append(loading);
    dbService.getWeek().then((responce) => renderCard(responce, target));
  }

  if (target.closest('#today')) {
    twShows.append(loading);
    dbService.getToday().then((responce) => renderCard(responce, target));
  }

  if (target.closest('#search')) {
    tvShowsList.textContent='';
    tvShowsHead.textContent='';
  }

});


// открытие модального окна

tvShowsList.addEventListener ('click', event => {
  
  event.preventDefault(); //не переходит в начало страницы
  
  const target = event.target; //показывает куда мы кликали
  const card = target.closest('.tv-card'); //получаем ссылку на карточку
  if (card) {
    
    preloader.style.display = 'block';

    dbService.getTvShov(card.id) //создали объект
      .then(({ //обрабатываем, обращаемся к ф-ции
        poster_path: posterPath,
        name: title,
        genres,
        vote_average: voteAverage,
        overview,
        homepage }) =>{
        
          if (posterPath) {
            tvCardImg.src = IMG_URL + posterPath;
            tvCardImg.alt = title;
            posterWrapper.style.display = '';
            modalContent.style.paddingLeft = '';
          } else {
            posterWrapper.style.display = 'none';
            modalContent.style.paddingLeft = '25px';
          }
          
          modalTitle.textContent = title; //меняем текст
      // genresList.innerHTML = data.genres.reduce((acc, item) => `${acc}<li>${item.name}</li>`, ''); //аккамулирует данные, однотипные действия в основном
          genresList.textContent = ''; //очищаем предыдуще значение
          genres.forEach(item => {
            genresList.innerHTML += `<li>${item.name}</li>`;
          });
          rating.textContent = voteAverage;
          description.textContent = overview;
          modalLink.href = homepage;
        }) 
      .then(()=>{
        document.body.style.overflow = 'hidden';
        modal.classList.remove ('hide');
      })
      .finally(() =>{
        preloader.style.display = '';
      })
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


pagination.addEventListener ('click', event => {
  event.preventDefault();
  const target = event.target;
  
  if (target.classList.contains('pages')) {
    twShows.append(loading);
    dbService.getNextPage(target.textContent).then(renderCard);
  }
})