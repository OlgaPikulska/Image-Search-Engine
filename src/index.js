import axios from "axios";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const searchInput = document.querySelector("input");
const searchForm = document.querySelector("#search-form")
const gallery = document.querySelector(".gallery");
//const loadMore = document.querySelector(".load-more")

let page = 1;

searchForm.addEventListener("submit", handleSubmit);

function handleSubmit(e) {
  gallery.innerHTML = null;
  e.preventDefault();
  page = 1;
  const searchQ = searchInput.value
  getImages(searchQ)
  console.log("od nowa", page)
  endObserver.unobserve(document.querySelector(".load-more__box"));
  observer.unobserve(document.querySelector(".load-more__box"));
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
    const numberOfPages = Math.ceil(totalHits / 40);

    const hits = response.data.hits
    
    if (totalHits === 0) {
      Notify.failure("Sorry, there are no images matching your search query. Please try again.")
    } else if (page === 1) {
      Notify.success(`Hooray! We found ${totalHits} images.`)
    }

    if (numberOfPages > 1) {
      observer.observe(document.querySelector(".load-more__box"));
      endObserver.unobserve(document.querySelector(".load-more__box"));
    } 

    if (page === numberOfPages) {
      //loadMore.setAttribute("hidden", "")
      observer.unobserve(document.querySelector(".load-more__box"));
      endObserver.observe(document.querySelector(".load-more__box"));
    } 
    renderImage(hits);
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

 let observer = new IntersectionObserver(([entry]) => {
        console.log("Infinite",entry);
   if (!entry.isIntersecting) return;
     const searchQ = searchInput.value
      page += 1;   
      getImages(searchQ);
      
  }) 


// --- powiadomienie o braku dalszych wyszukiwań dopiero pod koniec scrollowania --- //

let endObserver = new IntersectionObserver(([entry]) => {
  console.log("Koniec",entry);
  if (entry.isIntersecting) {
    console.log("koniec strony~powiadomienie",entry.isIntersecting);
      Notify.failure("We're sorry, but you've reached the end of search results.")
  } else {
    return;
    }
}) 

// --- przycisk załaduj więcej --- //

// loadMore.addEventListener("click", handleClick);

// function handleClick() {
//   const searchQ = searchInput.value
//   page += 1;
//   getImages(searchQ);
// }








// --- próba zmiany sposobu przewijania z infinite scroll na klikanie poprzez przycisk --- //

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

