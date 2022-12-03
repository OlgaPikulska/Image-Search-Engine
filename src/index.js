import axios from "axios";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const searchInput = document.querySelector("input");
const searchBtn = document.querySelector("button");
const searchForm = document.querySelector("#search-form")
const gallery = document.querySelector(".gallery");
const loadMore = document.querySelector(".load-more")
//const largeImgGallery = document.querySelector(".large-img-gallery")
console.log(loadMore)

let page = 1;

searchForm.addEventListener("submit", handleSubmit);

function handleSubmit(e) {
  e.preventDefault();
  //const inputValue = e.currentTarget.value;
  const searchQ = searchInput.value
  //console.log(inputValue);
  console.log(searchQ)
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
    console.log(hits);
    console.log(hits.length);
    if (hits.length === 0) {
      Notify.failure("Sorry, there are no images matching your search query. Please try again.")
    } else {
      Notify.success(`Hooray! We found ${response.data.totalHits} images.`)
      renderImage(hits);
    }
    
  } catch (error) {
    console.error(error);
  }
}

function renderImage(hits) {
  gallery.innerHTML = null;
  //const markup = hits.map((hit) => {
  //   const markupText = `<div class="photo-card"><a class="photo-card__img" href=${hit.largeImageURL}><img class="gallery__image" src=${hit.webformatURL} alt=${hit.tags} loading="lazy"/></a></div>`
  //   return markupText;
  // }).join("");
  const markup = hits.map((hit) => {
    const markupText = `<div class="photo-card">
    <a href=${hit.largeImageURL}><img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" class="photo-card__img"/></a>
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
  // nie mam pojęcia, czy będzie jakieś undefined//
  const markupReplaced = markup.replaceAll("undefined", "")
  gallery.innerHTML = markupReplaced;
  let lightbox = new SimpleLightbox(".gallery a")
}

loadMore.addEventListener("click", handleClick);

function handleClick() {
  const searchQ = searchInput.value
  page += 1;
  getImages(searchQ);
}


{/* <div class="info">
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
  </div> */}

//     axios.get('https://pixabay.com/api/', {
//     params: {
//         key:"31759222-00acf71bf0a65e43bd085eba1",
//         q:"${searchQ}",
//         image_type: "photo",
//         orientattion: "horizontal",
//         safesearch:true,
//     }
//   })
//     .then(function (response) {
//     console.log(typeof response)
//     console.log(response);
//     })
//   .catch(function (error) {
//     console.log(error);
//   })
//   .then(function () {
//     // always executed
//   });  
// }

// searchInput.addEventListener("input", (e) => {
// let inputValue = e.currentTarget.value
//     console.log(inputValue);
//     axios.get('https://pixabay.com/api/', {
//     params: {
//         key:"31759222-00acf71bf0a65e43bd085eba1",
//         q:"${inputValue}",
//         image_type: "photo",
//         orientattion: "horizontal",
//         safesearch:true,
//     }
//   })
//         .then(function (response) {
//       console.log(typeof response)
//     console.log(response);
//   })
//   .catch(function (error) {
//     console.log(error);
//   })
//   .then(function () {
//     // always executed
//   });  
// })

