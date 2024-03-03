var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const apiUrl = "http://localhost:8000/api/v1";
const query = (route, params) => __awaiter(this, void 0, void 0, function* () {
    try {
        const response = yield fetch(`${apiUrl}/${route}`, params);
        const results = yield response.json();
        return results;
    }
    catch (error) {
        console.log(error);
    }
});
const getBestMovies = () => __awaiter(this, void 0, void 0, function* () {
    try {
        const { results } = yield query(`titles?sort_by=-imdb_score&page_size=8`);
        return results;
    }
    catch (error) {
        console.log(error);
    }
});
const getBestCategoryMovies = (category) => __awaiter(this, void 0, void 0, function* () {
    try {
        const { results } = yield query(`titles?genre=${category}&sort_by=-imdb_score&page_size=7`);
        return results;
    }
    catch (error) {
        console.log(error);
    }
});
const getMovie = (movieId) => __awaiter(this, void 0, void 0, function* () {
    try {
        const result = yield query(`titles/${movieId}`);
        return result;
    }
    catch (error) {
        console.log(error);
    }
});
const createMediaScroller = (category, index, medias) => {
    const mediaGroup = document.createElement("div");
    medias.forEach((m) => {
        mediaGroup.insertAdjacentHTML("beforeend", `<a href="${apiUrl}/titles/${m.id}"><img src="${m.image_url}" alt="${m.title}"></a>`);
    });
    const mediaScroller = `
<div class="media-scroller">
    <div class="media-scroller__header">
        <h2 class="media-scroller__title">${category} best movies</h2>
        <div class="media-scroller__groups">
            <div class="scroller-group active-group"></div>
            <div class="scroller-group"></div>
        </div>
    </div>
    <div class="media-scroller__content">
        <button class="handle left-handle" id="left-scroller-${index}">&#8249;</button>
        <div class="media-group">
            ${mediaGroup.innerHTML}
        </div>
        <button class="handle right-handle" id="right-scroller-${index}">&#8250</button>
    </div>
</div>`;
    return mediaScroller;
};
const handleSlide = (classList, id) => {
    let mediaGroup;
    if (classList.includes("left")) {
        mediaGroup = document
            .getElementById(id)
            .parentElement.querySelector(".media-group");
        console.log(mediaGroup.style.transform);
        mediaGroup.style.transform = "translateX(100%)";
    }
    else {
        mediaGroup = document
            .getElementById(id)
            .parentElement.querySelector(".media-group");
        mediaGroup.style.transform = "translateX(-100%)";
    }
    console.log(mediaGroup.style);
};
const featuredFilm = document.getElementById("hero");
const featuredFilmContent = document.querySelector(".hero__content");
const heroLink = document.getElementById("heroLink");
getBestMovies().then((response) => __awaiter(this, void 0, void 0, function* () {
    const movie = yield getMovie(response[0].id);
    featuredFilm.style.backgroundImage = `url("${movie.image_url}")`;
    const heroContent = `<h2>${movie.title}</h2><p>${movie.description}</p>`;
    featuredFilmContent.insertAdjacentHTML("afterbegin", heroContent);
    heroLink.insertAdjacentHTML("afterbegin", `<a href="${apiUrl}/titles/${movie.id}">&#128712; More info</a>`);
}));
const featuredCategories = ["Sci-Fi", "Biography", "Comedy"];
const mainContent = document.querySelector(".main__content");
featuredCategories.forEach((c, index) => __awaiter(this, void 0, void 0, function* () {
    try {
        const bestCategoryMovies = yield getBestCategoryMovies(c);
        const mediaScroller = createMediaScroller(c, index, bestCategoryMovies);
        mainContent.insertAdjacentHTML("beforeend", mediaScroller);
        const sliderHandles = document.querySelectorAll(".handle");
        sliderHandles.forEach((e) => {
            e.addEventListener("click", function () {
                handleSlide(e.classList.toString(), e.getAttribute("id"));
            });
        });
    }
    catch (error) {
        console.log(error);
    }
}));
