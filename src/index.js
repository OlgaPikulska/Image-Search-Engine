import axios from "axios";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const searchInput = document.querySelector("input");
const searchForm = document.querySelector("#search-form")
const gallery = document.querySelector(".gallery");
//const loadMore = document.querySelector(".load-more")
//const changeBtn = document.querySelector(".change__btn");

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
    
    const hits = response.data.hits
    if (hits.length === 0) {
      Notify.failure("Sorry, there are no images matching your search query. Please try again.")
    } else if (page === 1) {
      Notify.success(`Hooray! We found ${response.data.totalHits} images.`)
    }

    renderImage(hits);
 
    const totalHits = response.data.totalHits;
    const numberOfPages = Math.ceil(totalHits / 40);
    
    if (page  === numberOfPages) {
      //loadMore.setAttribute("hidden", "")
      Notify.failure("We're sorry, but you've reached the end of search results.")
    }
    
    observer.observe(document.querySelector(".load-more__box"));
  
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
  //loadMore.removeAttribute("hidden")
  let lightbox = new SimpleLightbox(".gallery a")
  lightbox.refresh();
}

// --- nieskończone przewijanie ---//
  const observer = new IntersectionObserver(([entry]) => {
        console.log(entry);
    if (!entry.isIntersecting) return;
  
      const searchQ = searchInput.value
      page += 1;   
      getImages(searchQ)      
  })

// --- przycisk załaduj więcej --- //

// loadMore.addEventListener("click", handleClick);

// function handleClick() {
//   const searchQ = searchInput.value
//   page += 1;
//   getImages(searchQ);
// }








// --- NIEUDANA zmiana sposobu przewijania z infinite scroll na klikanie poprzez przycisk --- //

// changeBtn.addEventListener("click", () => {
//       console.log(loadMore.hasAttribute("hidden"))
//       loadMore.toggleAttribute("hidden")});

// if (loadMore.hasAttribute("hidden")) {
//     observer.unobserve(document.querySelector(".load-more__box"))
//   console.log("manual")
//   return;
//   } else {
//     observer.observe(document.querySelector(".load-more__box"));
//     console.log("infinite_scroll")
//   }

    