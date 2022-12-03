import axios from "axios";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

//czy wszystkie funkcje powinny być async/await?

const searchInput = document.querySelector("input");
const searchForm = document.querySelector("#search-form")
const gallery = document.querySelector(".gallery");
const loadMore = document.querySelector(".load-more")

//loadMore.setAttribute("hidden","")

let page = 1;

searchForm.addEventListener("submit", handleSubmit);

function handleSubmit(e) {
  gallery.innerHTML = null;
  e.preventDefault();
  page = 1;
  const searchQ = searchInput.value
  getImages(searchQ)
  
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
        page: page,
        per_page: 40,
      }
    });
    console.log(response);
    console.log(response.request.responseURL);
    const hits = response.data.hits
    console.log(hits)
    if (hits.length === 0) {
      Notify.failure("Sorry, there are no images matching your search query. Please try again.")
    } else if (page === 1) {
      Notify.success(`Hooray! We found ${response.data.totalHits} images.`)
    }
    renderImage(hits);
    
    const totalHits = response.data.totalHits;
    const numberOfPages = Math.ceil(totalHits / 40);
    console.log(numberOfPages)
    
    if (page  === numberOfPages) {
      loadMore.setAttribute("hidden", "")
      Notify.failure("We're sorry, but you've reached the end of search results.")
    }
  } catch (error) {
    console.error(error);
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
  loadMore.removeAttribute("hidden")
  let lightbox = new SimpleLightbox(".gallery a")
  lightbox.refresh();
}

loadMore.addEventListener("click", handleClick);

function handleClick() {
  const searchQ = searchInput.value
  page += 1;
  getImages(searchQ);

  // sprawdzić czy to wgl działa 
  const { height: cardHeight } = gallery
  .firstElementChild.getBoundingClientRect();

  window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
}


// ZOSTAŁO: przewijanie strony i nieskończone przewijanie i poprawić I'm sorry you've reach