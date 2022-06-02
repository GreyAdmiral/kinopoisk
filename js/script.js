"use strict";

const PATH = "https://kinopoiskapiunofficial.tech/api/v2.2/films",
	APIKEY = "02f6d188-80e6-4979-b879-9c77eead9796",
	OPTIONS = {
		method: "GET",
		headers: {
			"X-API-KEY": APIKEY,
			"Content-Type": "application/json",
		},
	},
	movies = document.getElementsByClassName("moovies")[0],
	pagination = document.getElementsByClassName("pagination")[0],
	getmore = document.getElementsByClassName("getmore")[0],
	search = document.querySelector(".search"),
	searchform = document.querySelector(".searchform"),
	searchField = document.querySelector(".search__field"),
	searchInput = document.querySelector(".search__field>input"),
	searchButton = document.querySelector(".search__button"),
	select = document.querySelector(".select"),
	sortdirection = document.querySelector(".sortdirection"),
	sortcheckbox = document.querySelector(".sortdirection input"),
	topbutton = document.querySelector(".topbutton");
let fragment = new DocumentFragment(),
	total, totalPages, activeTag, keyWord, pageNumber, errors,
	selectCurrent = select.querySelector(".select__current"),
	selectList = select.querySelector(".select__list"),
	selectInput = select.querySelector(".select__input");

sessionStorage.clear();
moveLoad();
resezeSort();
pagination.onclick = (e) => clickPagination(e);
getmore.onclick = (e) => {
	if (+pageNumber < totalPages) {
		moveLoad(++pageNumber);
		if (++pageNumber > totalPages) {
			getmore.classList.add("hidden");
		}
	}
	e.stopPropagation();
};
topbutton.onclick = (e) => {
	if (e.target.closest(".topbutton")) {
		topSmooth();
	}
	e.stopPropagation();
} 
searchButton.onclick = (e) => {
	keyWord = searchInput.value;
	sessionStorage.removeItem("promData");
	moveLoad();
	e.stopPropagation();
};
searchInput.onkeydown = (e) => keyPress(e);
select.onclick = (e) => sortSelect(e);
document.body.onclick = (e) => {
	if (!e.target.closest(".select")) {
		selectListHide();
	}
};
window.onscroll = (e) => topclick(e);
window.onresize = () => resezeSort();

async function moveLoad(page) {
	try {
		let number = page || 1,
			fUrl = PATH + "?" + `page=${number}` + compositeUrl();
		let resolve = await fetch(fUrl, OPTIONS);
		if (!resolve.ok) {
			sessionStorage.setItem("errData", "Произошла ошибка!");
			switch (resolve.ok) {
				case 401:
					throw `Wrong token. Status Code: ${resolve.status}`;
					break;

				case 402:
					throw `Request limit exceeded. Status Code: ${resolve.status}`;
					break;

				case 403:
					throw `Request limit exceeded. Status Code: ${resolve.status}`;
					break;

				case 404:
					throw `Request limit exceeded. Status Code: ${resolve.status}`;
					break;

				case 429:
					throw `Too many requests. Status Code: ${resolve.status}`;
					break;

				default:
					throw `Looks like there was a problem. Status Code: ${resolve.status}`;
					break;
			}
		}
		let resp = await resolve.json();
		sessionStorage.setItem("pageNumber", number);
		errors = false;
		firstProcessing(resp);
	} catch (err) {
		console.log(err);
		errors = true;
		pagination.innerHTML = "";
		getmore.innerHTML = "";
		movies.innerHTML = "";
		document.querySelector(".main").classList.add("error__container");
		fragment.append(createTag("error", sessionStorage.getItem("errData")));
		movies.append(fragment);
		movies.classList.remove("hidden");
		setTimeout(blink, 700, 3, document.querySelector(".error"));
	}
}

function firstProcessing(data) {
	let fArr = firstTreatment(data);
	let twoArr = transProcessing(fArr);
	let number = +sessionStorage.getItem("pageNumber");
	promiseProcessing(twoArr, number);
}

function firstTreatment(obj) {
	total = obj.total;
	totalPages = obj.totalPages || 1;
	if (total == 0) {
		sessionStorage.setItem("errData", "Ничего не найдено!");
		throw new Error("Получен пустой список!");
	}
	return obj.items;
}

function transProcessing(arr) {
	arr.forEach(it => {
		let {countries, genres, type, nameRu, nameEn, nameOriginal} = it;
		it.country = countries.map((item) => item.country).join(" / ");
		it.genre = genres.map((item) => item.genre).join(" / ");
		it.ruType = translator(type);
		it.name = nameRu || nameEn || nameOriginal;
	});
	return arr;
}

function promiseProcessing(resp, num) {
	let resArr = sortArr(resp);
	appStorage(resArr);
	treatment(JSON.parse(sessionStorage.getItem("promData")));
	contentVisible();
	movies.innerHTML = "";
	movies.append(fragment);
	if (getComputedStyle(pagination).display !== "none") {
		insertPagination(num - 1);
	} else {
		pagination.innerHTML = "";
		getmore.innerHTML = "";
		getmore.append(createTag("getmore__body", "Показать еще"));
	}
	pageNumber = num;
	lazyLoading();
}

function compositeUrl() {
	let link = "";
	if (keyWord) {
		link = link + `&keyword=${encodeURIComponent(keyWord)}`;
	}
	return link;
}

function treatment(arr) {
	arr.forEach((it) => createDOM(it));
}

function translator(type) {
	switch (type) {
		case "VIDEO":
			type = "видео";
			break;

		case "FILM":
			type = "фильм";
			break;

		case "TV_SERIES":
			type = "сериал";
			break;

		case "MINI_SERIES":
			type = "мини-сериал";
			break;

		case "TV_SHOW":
			type = "шоу";
			break;
	}
	return type;
}

function sortArr(arr) {
	let sortValue = selectInput.value;
	if (sortValue) {
		if (isFinite(arr[0][sortValue])) {
			arr.sort((a, b) => a[sortValue] - b[sortValue]);
		} else {
			arr.sort((a, b) => a[sortValue].localeCompare(b[sortValue]));
		}
	}
	return sortcheckbox.checked ? arr.reverse() : arr;
}

function appStorage(arr) {
	if (getComputedStyle(pagination).display !== "none") {
		sessionStorage.setItem("promData", JSON.stringify(arr, null, 3));
	} else {
		let tempArr = JSON.parse(sessionStorage.getItem("promData")) || [];
		tempArr.push(...arr);
		sessionStorage.setItem("promData", JSON.stringify(tempArr, null, 3));
	}
}

function createDOM(obj) {
	let {ratingKinopoisk, ratingImdb, year, posterUrl, posterUrlPreview, kinopoiskId, imdbId, ruType, name, country, genre} = obj,
		dom = `
   <div class="movie__head">
      <div class="movie__title">${name}</div>
      <div class="movie__rating">
         <span class="movie__kip">KP ${ratingKinopoisk || 0}</span>
         <span class="movie__imdb">IMDB ${ratingImdb || 0}</span>
      </div>
   </div>
   <div class="movie__body">
      <div class="movie__image">
         <img src="img/loading.svg" data-src=${posterUrlPreview} alt="">
      </div>
      <div class="movie__text">
         <div class="movie__text--title">
            <div class="text__row"><span>Год выпуска: </span>${checkItem(year)}</div>
            <div class="text__row"><span>Страна: </span>${checkItem(country)}</div>
            <div class="text__row"><span>Жанр: </span>${checkItem(genre)}</div>
            <div class="text__row"><span>Тип: </span>${checkItem(ruType)}</div>
         </div>
         <div class="movie__text--body">
            Далеко-далеко за, словесными горами в стране гласных и согласных живут рыбные тексты. Однажды, послушавшись решила! Рыбного, реторический! Маленькая послушавшись они если осталось, вскоре агентство злых журчит реторический оксмокс мир лучше снова она жаренные составитель он власти! Силуэт имеет безопасную семантика безорфографичный если назад. Толку алфавит до меня наш силуэт сбить пунктуация но вскоре необходимыми по всей, свою коварный всеми за лучше раз выйти грустный имени на берегу они эта возвращайся моей. Диких грамматики вдали сих рукописи, океана заглавных живет снова за о пустился прямо ему последний однажды маленький его. Свою домах курсивных злых знаках маленькая свой пояс живет, деревни своих. Щеке ручеек обеспечивает меня агентство предупреждал дал. Себя свое власти жизни, злых знаках шаблон великий речью единственное lorem ipsum последний пунктуация запятых, заглавных однажды, силуэт щеке жаренные живет оксмокс рыбного.
         </div>
      </div>
   </div>
`,
		element = createTag("movie", dom);
	fragment.append(element);
}

function createTag(tagClass, inner) {
	let elTag = document.createElement("div");
	elTag.classList.add(tagClass);
	elTag.innerHTML = inner;
	return elTag;
}

function checkItem(value) {
	return value || "отсутствует";
}

function createPagination() {
	let pagFrag = new DocumentFragment();
	for (let i = 0; i < totalPages; i++) {
		let elementTag = createTag("pagination__item", i + 1);
		elementTag.title = `Страница ${i + 1}`;
		pagFrag.append(elementTag);
	}
	return pagFrag;
}

function insertPagination(number) {
	pagination.innerHTML = "";
	pagination.append(createPagination());
	activeTag = pagination.children[number];
	activeTag.classList.add("active");
	insertArrows();
	insertDoubleArrows();
	if (activeTag.textContent == 1) {
		document.querySelector(".pagination__item--before").classList.add("pagination__item--color");
		document.querySelector(".pagination__item--beforeDouble").classList.add("pagination__item--color");
	}
	if (activeTag.textContent == totalPages) {
		document.querySelector(".pagination__item--after").classList.add("pagination__item--color");
		document.querySelector(".pagination__item--afterDouble").classList.add("pagination__item--color");
	}
}

function insertArrows() {
	let beforeCl = createTag("pagination__item--before", "◄"),
		afterCl = createTag("pagination__item--after", "►");
	beforeCl.title = "Назад";
	afterCl.title = "Вперед";
	pagination.prepend(beforeCl);
	pagination.append(afterCl);
}

function insertDoubleArrows() {
	let beforeDoubleCl = createTag("pagination__item--beforeDouble", "<<"),
		afterDoubleCl = createTag("pagination__item--afterDouble", ">>");
	beforeDoubleCl.title = "Назад на 5 страниц";
	afterDoubleCl.title = "Вперед на 5 страниц";
	pagination.prepend(beforeDoubleCl);
	pagination.append(afterDoubleCl);
}

function clickPagination(e) {
	if (e.target.closest(".pagination__item:not(.active)")) {
		let pageNumber = e.target.textContent;
		moveLoad(pageNumber);
		// if (getComputedStyle(pagination).display !== "none") {
		// 	topSmooth();
		// }
	}
	if (e.target.closest(".pagination__item--before")) {
		pageNumber = activeTag.textContent;
		if (+pageNumber > 1) {
			moveLoad(--pageNumber);
		}
	}
	if (e.target.closest(".pagination__item--after")) {
		let pageNumber = activeTag.textContent;
		if (+pageNumber < totalPages) {
			moveLoad(++pageNumber);
		}
	}
	if (e.target.closest(".pagination__item--beforeDouble")) {
		let pageNumber = activeTag.textContent;
		if (+pageNumber > 1) {
			+pageNumber - 5 > 0 ? moveLoad(+pageNumber - 5) : moveLoad(1);
		}
	}
	if (e.target.closest(".pagination__item--afterDouble")) {
		let pageNumber = activeTag.textContent;
		if (+pageNumber < totalPages) {
			+pageNumber + 5 < totalPages ? moveLoad(+pageNumber + 5) : moveLoad(+totalPages);
		}
	}
	e.stopPropagation();
}

function contentVisible() {
	searchform.classList.remove("hidden");
	movies.classList.remove("hidden");
}

function topSmooth() {
	// window.scrollTo(0, 0);
	window.scrollTo({top: 0, left: 0, behavior: "smooth"});
}

{
	let placeholder;
	document.querySelector(".search").addEventListener("focusin", (e) => {
		if (e.target.hasAttribute("placeholder")) {
			placeholder = e.target.placeholder;
			e.target.placeholder = "";
		}
		e.stopPropagation();
	});

	document.querySelector(".search").addEventListener("focusout", (e) => {
		if (e.target.hasAttribute("placeholder")) {
			e.target.placeholder = placeholder;
		}
		e.stopPropagation();
	});
}

function keyPress(e) {
	if (e.code == "Enter" || e.code == "NumpadEnter") {
		e.preventDefault();
		searchButton.click();
	}
	if (e.code == "Escape") {
		e.preventDefault();
		searchInput.blur();
	}
	e.stopPropagation();
}

function lazyLoading() {
	let images = movies.querySelectorAll("img");
	if (!!window.IntersectionObserver) {
		let opt = {
				rootMargin: "200px 0px 200px 0px",
				threshold: 0,
			},
			myLoader = (ent, obs) => {
				ent.forEach((en) => {
					if (en.isIntersecting) {
						en.target.src = en.target.dataset.src;
						obs.unobserve(en.target);
					}
				});
			},
			observer = new IntersectionObserver(myLoader, opt);
		images.forEach((it) => observer.observe(it));
	} else {
		images.forEach((it) => it.src = it.dataset.src);
	}
}

function blink(num, tag) {
	tag.classList.toggle("message--blink");
	let timeId = setTimeout(blink, 700, ++num, tag);
	if (num === 8) {
		clearTimeout(timeId);
	}
}

function topclick(e) {
	if (document.body.scrollTop > 550 || document.documentElement.scrollTop > 550) {
		topbutton.classList.remove("hidden");
	} else {
		topbutton.classList.add("hidden");
	}
	e.stopPropagation();
}

function sortSelect(e) {
	let targetTag = e.target;
	if (e.target.closest(".select__current")) {
		selectList.classList.toggle("select__list--show");
	}
	if (e.target.closest(".select__item")) {
		let itemValue = targetTag.getAttribute("data-value"),
			itemText = targetTag.textContent,
			number = +sessionStorage.getItem("pageNumber"),
			tempArr = JSON.parse(sessionStorage.getItem("promData"));
		selectInput.value = itemValue;
		selectCurrent.textContent = itemText;
		if (!errors) {
			sessionStorage.removeItem("promData");
			promiseProcessing(tempArr, number);
		}
		selectListHide();
	}
	e.stopPropagation();
}

function selectListHide() {
	selectList.classList.remove("select__list--show");
}

function resezeSort() {
	let formHeight = parseFloat(getComputedStyle(search).height);
	document.documentElement.style.setProperty("--selectlisttop", `${formHeight + 2}px`);
	document.documentElement.style.setProperty("--formhight", `${formHeight}px`);
}