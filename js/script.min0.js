"use strict";async function moveLoad(e){try{let t=e||1,o=PATH+"?"+`page=${t}`+compositeUrl(),a=await fetch(o,OPTIONS);if(!a.ok)switch(sessionStorage.setItem("errData","Произошла ошибка!"),a.ok){case 401:throw`Wrong token. Status Code: ${a.status}`;case 402:case 403:case 404:throw`Request limit exceeded. Status Code: ${a.status}`;case 429:throw`Too many requests. Status Code: ${a.status}`;default:throw`Looks like there was a problem. Status Code: ${a.status}`}let n=await a.json();sessionStorage.setItem("pageNumber",t),errors=!1,firstProcessing(n)}catch(e){console.log(e),errors=!0,pagination.innerHTML="",getmore.innerHTML="",movies.innerHTML="",document.querySelector(".main").classList.add("error__container"),fragment.append(createTag("error",sessionStorage.getItem("errData"))),movies.append(fragment),movies.classList.remove("hidden"),setTimeout(blink,700,3,document.querySelector(".error"))}}function firstProcessing(e){let t=firstTreatment(e),o=transProcessing(t),a=+sessionStorage.getItem("pageNumber");promiseProcessing(o,a)}function firstTreatment(e){if(total=e.total,totalPages=e.totalPages||1,0==total)throw sessionStorage.setItem("errData","Ничего не найдено!"),new Error("Получен пустой список!");return e.items}function transProcessing(e){return e.forEach(e=>{let{countries:t,genres:o,type:a,nameRu:n,nameEn:r,nameOriginal:s}=e;e.country=t.map(e=>e.country).join(" / "),e.genre=o.map(e=>e.genre).join(" / "),e.ruType=translator(a),e.name=n||r||s}),e}function promiseProcessing(e,t){let o=sortArr(e);appStorage(o),treatment(JSON.parse(sessionStorage.getItem("promData"))),contentVisible(),movies.innerHTML="",movies.append(fragment),"none"!==getComputedStyle(pagination).display?insertPagination(t-1):(pagination.innerHTML="",getmore.innerHTML="",getmore.append(createTag("getmore__body","Показать еще"))),pageNumber=t,lazyLoading()}function compositeUrl(){let e="";return keyWord&&(e+=`&keyword=${encodeURIComponent(keyWord)}`),e}function treatment(e){e.forEach(e=>createDOM(e))}function translator(e){switch(e){case"VIDEO":e="видео";break;case"FILM":e="фильм";break;case"TV_SERIES":e="сериал";break;case"MINI_SERIES":e="мини-сериал";break;case"TV_SHOW":e="шоу"}return e}function sortArr(e){let t=selectInput.value;return t&&(isFinite(e[0][t])?e.sort((e,o)=>e[t]-o[t]):e.sort((e,o)=>e[t].localeCompare(o[t]))),sortcheckbox.checked?e.reverse():e}function appStorage(e){if("none"!==getComputedStyle(pagination).display)sessionStorage.setItem("promData",JSON.stringify(e,null,3));else{let t=JSON.parse(sessionStorage.getItem("promData"))||[];t.push(...e),sessionStorage.setItem("promData",JSON.stringify(t,null,3))}}function createDOM(e){let{ratingKinopoisk:t,ratingImdb:o,year:a,posterUrl:n,posterUrlPreview:r,kinopoiskId:s,imdbId:i,ruType:c,name:l,country:m,genre:g}=e,p=`\n   <div class="movie__head">\n      <div class="movie__title">${l}</div>\n      <div class="movie__rating">\n         <span class="movie__kip">KP ${t||0}</span>\n         <span class="movie__imdb">IMDB ${o||0}</span>\n      </div>\n   </div>\n   <div class="movie__body">\n      <div class="movie__image">\n         <img src="img/loading.svg" data-src=${r} alt="">\n      </div>\n      <div class="movie__text">\n         <div class="movie__text--title">\n            <div class="text__row"><span>Год выпуска: </span>${checkItem(a)}</div>\n            <div class="text__row"><span>Страна: </span>${checkItem(m)}</div>\n            <div class="text__row"><span>Жанр: </span>${checkItem(g)}</div>\n            <div class="text__row"><span>Тип: </span>${checkItem(c)}</div>\n         </div>\n         <div class="movie__text--body">\n            Далеко-далеко за, словесными горами в стране гласных и согласных живут рыбные тексты. Однажды, послушавшись решила! Рыбного, реторический! Маленькая послушавшись они если осталось, вскоре агентство злых журчит реторический оксмокс мир лучше снова она жаренные составитель он власти! Силуэт имеет безопасную семантика безорфографичный если назад. Толку алфавит до меня наш силуэт сбить пунктуация но вскоре необходимыми по всей, свою коварный всеми за лучше раз выйти грустный имени на берегу они эта возвращайся моей. Диких грамматики вдали сих рукописи, океана заглавных живет снова за о пустился прямо ему последний однажды маленький его. Свою домах курсивных злых знаках маленькая свой пояс живет, деревни своих. Щеке ручеек обеспечивает меня агентство предупреждал дал. Себя свое власти жизни, злых знаках шаблон великий речью единственное lorem ipsum последний пунктуация запятых, заглавных однажды, силуэт щеке жаренные живет оксмокс рыбного.\n         </div>\n      </div>\n   </div>\n`,u=createTag("movie",p);fragment.append(u)}function createTag(e,t){let o=document.createElement("div");return o.classList.add(e),o.innerHTML=t,o}function checkItem(e){return e||"отсутствует"}function createPagination(){let e=new DocumentFragment;for(let t=0;t<totalPages;t++){let o=createTag("pagination__item",t+1);o.title=`Страница ${t+1}`,e.append(o)}return e}function insertPagination(e){pagination.innerHTML="",pagination.append(createPagination()),activeTag=pagination.children[e],activeTag.classList.add("active"),insertArrows(),insertDoubleArrows(),1==activeTag.textContent&&(document.querySelector(".pagination__item--before").classList.add("pagination__item--color"),document.querySelector(".pagination__item--beforeDouble").classList.add("pagination__item--color")),activeTag.textContent==totalPages&&(document.querySelector(".pagination__item--after").classList.add("pagination__item--color"),document.querySelector(".pagination__item--afterDouble").classList.add("pagination__item--color"))}function insertArrows(){let e=createTag("pagination__item--before","◄"),t=createTag("pagination__item--after","►");e.title="Назад",t.title="Вперед",pagination.prepend(e),pagination.append(t)}function insertDoubleArrows(){let e=createTag("pagination__item--beforeDouble","<<"),t=createTag("pagination__item--afterDouble",">>");e.title="Назад на 5 страниц",t.title="Вперед на 5 страниц",pagination.prepend(e),pagination.append(t)}function clickPagination(e){if(e.target.closest(".pagination__item:not(.active)")){let t=e.target.textContent;moveLoad(t)}if(e.target.closest(".pagination__item--before")&&(pageNumber=activeTag.textContent,+pageNumber>1&&moveLoad(--pageNumber)),e.target.closest(".pagination__item--after")){let e=activeTag.textContent;+e<totalPages&&moveLoad(++e)}if(e.target.closest(".pagination__item--beforeDouble")){let e=activeTag.textContent;+e>1&&moveLoad(+e-5>0?+e-5:1)}if(e.target.closest(".pagination__item--afterDouble")){let e=activeTag.textContent;+e<totalPages&&moveLoad(+e+5<totalPages?+e+5:+totalPages)}e.stopPropagation()}function contentVisible(){searchform.classList.remove("hidden"),movies.classList.remove("hidden")}function topSmooth(){window.scrollTo({top:0,left:0,behavior:"smooth"})}function keyPress(e){"Enter"!=e.code&&"NumpadEnter"!=e.code||(e.preventDefault(),searchButton.click()),"Escape"==e.code&&(e.preventDefault(),searchInput.blur()),e.stopPropagation()}function lazyLoading(){let e=movies.querySelectorAll("img");if(window.IntersectionObserver){let t={rootMargin:"200px 0px 200px 0px",threshold:0},o=(e,t)=>{e.forEach(e=>{e.isIntersecting&&(e.target.src=e.target.dataset.src,t.unobserve(e.target))})},a=new IntersectionObserver(o,t);e.forEach(e=>a.observe(e))}else e.forEach(e=>e.src=e.dataset.src)}function blink(e,t){t.classList.toggle("message--blink");let o=setTimeout(blink,700,++e,t);8===e&&clearTimeout(o)}function topclick(e){document.body.scrollTop>550||document.documentElement.scrollTop>550?topbutton.classList.remove("hidden"):topbutton.classList.add("hidden"),e.stopPropagation()}function sortSelect(e){let t=e.target;if(e.target.closest(".select__current")&&selectList.classList.toggle("select__list--show"),e.target.closest(".select__item")){let e=t.getAttribute("data-value"),o=t.textContent,a=+sessionStorage.getItem("pageNumber"),n=JSON.parse(sessionStorage.getItem("promData"));selectInput.value=e,selectCurrent.textContent=o,errors||(sessionStorage.removeItem("promData"),promiseProcessing(n,a)),selectListHide()}e.stopPropagation()}function selectListHide(){selectList.classList.remove("select__list--show")}function changeCheckBox(e){let t=JSON.parse(sessionStorage.getItem("promData")),o=+sessionStorage.getItem("pageNumber");promiseProcessing(t,o),e.stopPropagation()}function resezeSort(){let e=parseFloat(getComputedStyle(search).height);document.documentElement.style.setProperty("--selectlisttop",`${e+2}px`),document.documentElement.style.setProperty("--formhight",`${e}px`)}const PATH="https://kinopoiskapiunofficial.tech/api/v2.2/films",APIKEY="02f6d188-80e6-4979-b879-9c77eead9796",OPTIONS={method:"GET",headers:{"X-API-KEY":APIKEY,"Content-Type":"application/json"}},movies=document.getElementsByClassName("moovies")[0],pagination=document.getElementsByClassName("pagination")[0],getmore=document.getElementsByClassName("getmore")[0],search=document.querySelector(".search"),searchform=document.querySelector(".searchform"),searchField=document.querySelector(".search__field"),searchInput=document.querySelector(".search__field>input"),searchButton=document.querySelector(".search__button"),select=document.querySelector(".select"),sortdirection=document.querySelector(".sortdirection"),sortcheckbox=document.querySelector(".sortdirection input"),topbutton=document.querySelector(".topbutton");let total,totalPages,activeTag,keyWord,pageNumber,errors,fragment=new DocumentFragment,selectCurrent=select.querySelector(".select__current"),selectList=select.querySelector(".select__list"),selectInput=select.querySelector(".select__input");sessionStorage.clear(),moveLoad(),resezeSort(),pagination.onclick=(e=>clickPagination(e)),getmore.onclick=(e=>{+pageNumber<totalPages&&(moveLoad(++pageNumber),++pageNumber>totalPages&&getmore.classList.add("hidden")),e.stopPropagation()}),topbutton.onclick=(e=>{e.target.closest(".topbutton")&&topSmooth(),e.stopPropagation()}),searchButton.onclick=(e=>{keyWord=searchInput.value,sessionStorage.removeItem("promData"),moveLoad(),e.stopPropagation()}),searchInput.onkeydown=(e=>keyPress(e)),select.onclick=(e=>sortSelect(e)),document.body.onclick=(e=>{e.target.closest(".select")||selectListHide()}),sortcheckbox.onchange=(e=>changeCheckBox(e)),window.onscroll=(e=>topclick(e)),window.onresize=(()=>resezeSort());{let e;document.querySelector(".search").addEventListener("focusin",t=>{t.target.hasAttribute("placeholder")&&(e=t.target.placeholder,t.target.placeholder=""),t.stopPropagation()}),document.querySelector(".search").addEventListener("focusout",t=>{t.target.hasAttribute("placeholder")&&(t.target.placeholder=e),t.stopPropagation()})}
