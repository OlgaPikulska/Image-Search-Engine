import axios from "axios";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const searchInput = document.querySelector("input");
const searchBtn = document.querySelector("button");
const searchForm = document.querySelector("#search-form")
const gallery = document.querySelector(".gallery");
console.log(gallery)

searchForm.addEventListener("submit", handleSubmit);

function handleSubmit(e) {
  e.preventDefault();
  const inputValue = e.currentTarget.value;
  const searchQ = searchInput.value
  console.log(inputValue);
  console.log(searchQ)
  getImages(searchQ)
  .then(friends => console.log(friends))
  .catch(error => console.error(error));
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
      }
    });
    console.log(response);
    const hits = response.data.hits
    console.log(hits);
    renderImage(hits);
    
  } catch (error) {
    console.error(error);
  }
}



function renderImage(hits) {
  gallery.innerHTML = null;
  const markup = hits.map((hit) => {
    const markupText = `<div class="photo-card">
    <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" class="photo-card__item"/>
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
    return markupText
  }).join("");
  // nie mam pojęcia, czy będzie jakieś undefined//
  const markupReplaced = markup.replaceAll("undefined", "")
  gallery.innerHTML = markupReplaced;
}






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

