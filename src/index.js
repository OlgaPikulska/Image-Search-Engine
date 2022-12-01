import axios from "axios";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const searchInput = document.querySelector("input");
const searchBtn = document.querySelector("button");
const searchForm = document.querySelector("#search-form")
console.log(searchBtn)

searchForm.addEventListener("submit", handleSubmit);

function handleSubmit(e) {
    e.preventDefault();
    const inputValue = e.currentTarget.value;
    console.log(inputValue);

    axios.get('https://pixabay.com/api/', {
    params: {
        key:"31759222-00acf71bf0a65e43bd085eba1",
        q:"${inputValue}",
        image_type: "photo",
        orientattion: "horizontal",
        safesearch:true,
    }
  })
    .then(function (response) {
    console.log(typeof response)
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  })
  .then(function () {
    // always executed
  });  
}

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

