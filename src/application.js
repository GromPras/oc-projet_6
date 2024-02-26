"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("./utils/api");
const getBestMovies = (category, pageSize) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield (0, api_1.apiCall)("titles", pageSize ? pageSize : 7, category ? category : undefined, {
            sortBy: "imdb_score",
        });
        const bestMovies = results;
        return bestMovies;
    }
    catch (error) { }
});
const getMovie = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, api_1.apiCall)(`titles/${id}`);
        const movie = result;
        return movie;
    }
    catch (error) { }
});
// const getCategories = async (): Promise<any> => {
//   try {
//     const results = await apiCall("genres", 25);
//     return results;
//   } catch (error) {}
// };
// const createCarousel = (carousel, movies) => {
//   movies.forEach((m) => {
//     const div = document.createElement("div");
//     const img = document.createElement("img");
//     img.src = m.image_url;
//     img.alt = m.title;
//     div.appendChild(img);
//     carousel.appendChild(div);
//   });
//   return carousel;
// };
// const createCarouselSection = (id, category) => {
//   getBestMovies(category).then((response) => {
//     console.log(response);
//     id.firstChild.textContent = `Best ${category} Movies`;
//     id = createCarousel(id, response);
//   });
//   return id;
// };
const featuredFilm = document.getElementById("hero");
getBestMovies(null, 8).then((response) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(response[0].id);
    yield getMovie(response[0].id).then((movie) => {
        const img = `<img src="${movie.image_url}" alt="${movie.title}">`;
        const info = `<h2>${movie.title}</h2><p>${movie.description}</p>`;
        featuredFilm.insertAdjacentHTML("afterbegin", img);
        featuredFilm.insertAdjacentHTML("beforeend", info);
    });
}));
// Create first cat best of
// let bestOfCat1 = document.getElementById("cat1");
// bestOfCat1 = createCarouselSection(bestOfCat1, "Sci-Fi");
// Create second cat best of
// let bestOfCat2 = document.getElementById("cat2");
// bestOfCat2 = createCarouselSection(bestOfCat2, "Biography");
// Create third cat best of
// let bestOfCat3 = document.getElementById("cat3");
// bestOfCat3 = createCarouselSection(bestOfCat3, "Comedy");
// let categoriesList: HTMLUListElement =
//   document.getElementsByClassName("header__nav__list");
// getCategories().then((response) => {
//   console.log(response);
//   // response.forEach((e) => {
//   //   categoriesList.appendChild();
//   // });
// });
