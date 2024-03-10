const apiUrl = "http://localhost:8000/api/v1";

const query = async (route, params) => {
  try {
    const response = await fetch(`${apiUrl}/${route}`, params);
    const results = await response.json();

    return results;
  } catch (error) {
    console.log(error);
  }
};

const getBestMovies = async () => {
  try {
    const { results } = await query(`titles?sort_by=-imdb_score&page_size=8`);
    return results;
  } catch (error) {
    console.log(error);
  }
};

const getBestCategoryMovies = async (category) => {
  try {
    const { results } = await query(
      `titles?genre=${category}&sort_by=-imdb_score&page_size=7`
    );
    return results;
  } catch (error) {
    console.log(error);
  }
};

const getMovie = async (movieId) => {
  try {
    const result = await query(`titles/${movieId}`);
    return result;
  } catch (error) {
    console.log(error);
  }
};

const calculateScrollerProgress = () => {
  const mediaScrollerProgress = document.createElement("div");
  mediaScrollerProgress.classList.add("media-scroller__progress");
  const itemsPerSlide = parseInt(
    getComputedStyle(document.body).getPropertyValue("--item-per-slide")
  );
  // const sliderIndex = parseInt(
  //   getComputedStyle(slider).getPropertyValue("--slider-index")
  // );
  const scrollerProgressCount = Math.ceil(7 / itemsPerSlide);
  for (let i = 0; i < scrollerProgressCount; i++) {
    mediaScrollerProgress.insertAdjacentHTML(
      "beforeend",
      "<div class='scroller-progress'></div>"
    );
  }
  mediaScrollerProgress.children[0].classList.add("active-group");
  return mediaScrollerProgress;
};

const createMediaScroller = (category, index, medias) => {
  const mediaGroup = document.createElement("div");
  medias.forEach((m) => {
    mediaGroup.insertAdjacentHTML(
      "beforeend",
      `<a class="movie-link" href="${apiUrl}/titles/${m.id}"><img src="${m.image_url}" alt="${m.title}" data-id="${m.id}"></a>`
    );
  });
  const mediaScrollerProgress = calculateScrollerProgress();

  const mediaScroller = `
<div class="media-scroller">
    <div class="media-scroller__header">
        <h2 class="media-scroller__title">${category}</h2>
        <div class="media-scroller__progress">
            ${mediaScrollerProgress.innerHTML}
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

const onHandleClick = (handle) => {
  const progress = handle
    .closest(".media-scroller")
    .querySelector(".media-scroller__progress");
  const slider = handle
    .closest(".media-scroller__content")
    .querySelector(".media-group");
  const sliderIndex = parseInt(
    getComputedStyle(slider).getPropertyValue("--slider-index")
  );
  if (handle.classList.contains("left-handle")) {
    slider.style.setProperty("--slider-index", sliderIndex - 1);
    progress.children[sliderIndex].classList.remove("active-group");
    progress.children[sliderIndex - 1].classList.add("active-group");
  }
  if (handle.classList.contains("right-handle")) {
    slider.style.setProperty("--slider-index", sliderIndex + 1);
    progress.children[sliderIndex].classList.remove("active-group");
    progress.children[sliderIndex + 1].classList.add("active-group");
  }
};

onMoreInfoClick = async (data) => {
  const response = await query(`titles/${data.id}`);
  console.log(response);
  const modal = document.getElementById("modal");
  const card = modal.querySelector(".card");
  document.body.classList.toggle("noscroll");
  modal.classList.toggle("show-modal");
  card.style.backgroundImage = `url("${response.image_url}")`;
  card.querySelector(".card__content").insertAdjacentHTML(
    "afterbegin",
    `
  <h2>${response.title}</h2>
  <p>${response.genres.toString()}</p>
  <p>${response.date_published}</p>
  <p>${response.rated}</p>
  <p>${response.imbd_score}</p>
  <p>${response.directors.toString()}</p>
  <p>${response.actors.toString()}</p>
  <p>${response.duration}</p>
  <p>${response.countries.toString()}</p>
  <p>${response.worldwide_gross_income}</p>
  <p>${response.long_description}</p>
  `
  );
};

// Create Hero Section and first Slider
const featuredFilm = document.getElementById("hero");
const featuredFilmContent = document.querySelector(".hero__content");
const heroLink = document.getElementById("heroLink");
getBestMovies().then(async (response) => {
  const movie = await getMovie(response[0].id);
  featuredFilm.style.backgroundImage = `url("${movie.image_url}")`;
  const heroContent = `<h2>${movie.title}</h2><p>${movie.description}</p>`;
  featuredFilmContent.insertAdjacentHTML("afterbegin", heroContent);
  heroLink.insertAdjacentHTML(
    "afterbegin",
    `<a href="${apiUrl}/titles/${movie.id}" class="movie-link" data-id="${movie.id}">&#128712; More info</a>`
  );
  response.shift();
  const mediaScroller = createMediaScroller(
    "Films les mieux notés",
    0,
    response
  );
  mainContent.insertAdjacentHTML("afterbegin", mediaScroller);

  // Listen for clicks on handles
  const sliderHandles = document.querySelectorAll(".handle");
  sliderHandles.forEach(function (element) {
    element.addEventListener("click", function (event) {
      onHandleClick(event.target);
    });
  });

  // Listen for click on More Info or movies
  const moreInfo = document.querySelectorAll(".movie-link");
  moreInfo.forEach(function (element) {
    element.addEventListener("click", function (event) {
      event.preventDefault();
      onMoreInfoClick(event.target.dataset);
    });
  });
});

// Create other Sliders
const featuredCategories = ["Sci-Fi", "Biography", "Comedy"];
const mainContent = document.querySelector(".main__content");

featuredCategories.forEach(async (c, index) => {
  try {
    const bestCategoryMovies = await getBestCategoryMovies(c);
    const mediaScroller = createMediaScroller(c, index + 1, bestCategoryMovies);

    mainContent.insertAdjacentHTML("beforeend", mediaScroller);
  } catch (error) {
    console.log(error);
  }
});

const closeModal = document.getElementById("close-modal");
closeModal.addEventListener("click", () => {
  const modal = document.getElementById("modal");
  modal.classList.remove("show-modal");
  document.body.classList.remove("noscroll");
});
