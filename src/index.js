import axios from "axios";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const searchInput = document.querySelector("input");
const searchForm = document.querySelector("#search-form")
const gallery = document.querySelector(".gallery");
const loadMore = document.querySelector(".load-more");
const switchBtn = document.querySelector("#switch");
const switchBtnBox = document.querySelector(".switch-btn__box")
let page = 1;

searchForm.addEventListener("submit", handleSubmit);

function handleSubmit(e) {
  gallery.innerHTML = null;
  e.preventDefault();
  page = 1;
  const searchQ = searchInput.value

  if (searchQ.length === 0) {
    Notify.failure("Please write what you are looking for.")
  } else  {
    getImages(searchQ)
  }
  endObserver.unobserve(document.querySelector(".load-more__box"));
  observer.unobserve(document.querySelector(".load-more__box"));
  switchBtnBox.classList.replace("is-hidden", "switch-btn__box");

}

async function getImages(inputValue) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: "31759222-00acf71bf0a65e43bd085eba1",
        q: `${inputValue}`,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        page,
        per_page: 40,
      }
    });
   
    const totalHits = response.data.totalHits;
    checkResult(totalHits)

    const hits = response.data.hits
    renderImage(hits);
  } catch (error) {
    console.error(error);
  }
}

function checkResult(totalHits) {
  const numberOfPages = Math.ceil(totalHits / 40);
 
  if (totalHits === 0) {
    Notify.failure("Sorry, there are no images matching your search query. Please try again.")
  } else if (page === 1) {
    Notify.success(`Hooray! We found ${totalHits} images.`)
  }
  endObserverToggle(numberOfPages);
  checkSwitchStatus(numberOfPages);
}


function checkSwitchStatus(numberOfPages) {
    
   if (switchStatus === true) {
    if (numberOfPages > 1) {
      observer.observe(document.querySelector(".load-more__box"));
     }
     if (page === numberOfPages) {
      switchBtnBox.classList.replace("switch-btn__box","is-hidden");
     }
  } else if (switchStatus === false) {
    if (numberOfPages > 1) {
      loadMore.removeAttribute("hidden")
    }
    if (page === numberOfPages) { 
      loadMore.setAttribute("hidden", "")
      switchBtnBox.classList.replace("switch-btn__box","is-hidden");
    }
  }
}

function endObserverToggle(numberOfPages) {
  if (numberOfPages > 1) {
    endObserver.unobserve(document.querySelector(".load-more__box"));
  }
  
  if (page === numberOfPages) {
    endObserver.observe(document.querySelector(".load-more__box"));
  } 
}

function renderImage(hits) {
  const markup = hits.map((hit) => {
    const markupText = `<div class="photo-card">
    <a class="photo-card__link" href=${hit.largeImageURL}><img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" class="photo-card__img"/></a>
    <div class="info">
    <p class="info-item">
    <b>Likes</b> ${hit.likes}
    </p>
    <p class="info-item">
      <b>Views</b> ${hit.views}
    </p>
    <p class="info-item">
      <b>Comments</b> ${hit.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b> ${hit.downloads}
    </p>
  </div>
    </div>`
    return markupText;
  }).join("");
  gallery.insertAdjacentHTML("beforeend", markup)
  let lightbox = new SimpleLightbox(".gallery a")
  lightbox.refresh();
}

// --- nieskończone przewijanie ---//

let observer = new IntersectionObserver(([entry]) => {
  const searchQ = searchInput.value

  if (searchQ.length === 0) {
    Notify.failure("Please write what you are looking for.")
    return;
  }
  
  if (!entry.isIntersecting) return;
    page += 1;   
    getImages(searchQ);   
  }) 


// --- powiadomienie o braku dalszych wyszukiwań dopiero pod koniec scrollowania --- //

let endObserver = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) {
      Notify.failure("We're sorry, but you've reached the end of search results.")
  } else {
    return;
    }
}) 

// --- przycisk załaduj więcej --- //

loadMore.addEventListener("click", handleClick);

function handleClick() {
  const searchQ = searchInput.value
  page += 1;
  getImages(searchQ);
}

// --- zmiana sposobu ładowania --- //
let switchStatus = false;

switchBtn.addEventListener("click", generalInfiniteScroll)

function generalInfiniteScroll() {
  const searchQ = searchInput.value
  console.log(searchQ.length)
  if (switchBtn.checked === true) {
    Notify.success("Infinite scroll is on")
    switchStatus = true;
    loadMore.setAttribute("hidden", "")
    observer.observe(document.querySelector(".load-more__box"));
  } else {
    Notify.failure("infinite scroll is off")
    switchStatus = false;
    observer.unobserve(document.querySelector(".load-more__box"));
    if (searchQ.length > 0) {
      loadMore.removeAttribute("hidden")
    }
  }
  console.log("After click",switchStatus)
}