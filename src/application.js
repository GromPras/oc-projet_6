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

const createMediaScroller = (category, index, medias) => {
  const mediaGroup = document.createElement("div");
  medias.forEach((m) => {
    mediaGroup.insertAdjacentHTML(
      "beforeend",
      `<a href="${apiUrl}/titles/${m.id}"><img src="${m.image_url}" alt="${m.title}"></a>`
    );
  });

  const mediaScroller = `
<div class="media-scroller">
    <div class="media-scroller__header">
        <h2 class="media-scroller__title">${category} best movies</h2>
        <div class="media-scroller__groups">
            <div class="scroller-group"></div>
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
    `<a href="${apiUrl}/titles/${movie.id}">&#128712; More info</a>`
  );
});

const featuredCategories = ["Sci-Fi", "Biography", "Comedy"];
const mainContent = document.querySelector(".main__content");

featuredCategories.forEach(async (c, index) => {
  try {
    const bestCategoryMovies = await getBestCategoryMovies(c);
    const mediaScroller = createMediaScroller(c, index, bestCategoryMovies);

    mainContent.insertAdjacentHTML("beforeend", mediaScroller);
  } catch (error) {
    console.log(error);
  }
});

const onHandleClick = (handle) => {
  const slider = handle
    .closest(".media-scroller__content")
    .querySelector(".media-group");
  const sliderIndex = parseInt(
    getComputedStyle(slider).getPropertyValue("--slider-index")
  );
  if (handle.classList.contains("left-handle")) {
    slider.style.setProperty("--slider-index", sliderIndex - 1);
  }
  if (handle.classList.contains("right-handle")) {
    slider.style.setProperty("--slider-index", sliderIndex + 1);
  }
};

document.addEventListener("click", (e) => {
  let handle;
  if (e.target.matches(".handle")) {
    handle = e.target;
  } else {
    handle = e.target.closest(".handle");
  }

  onHandleClick(handle);
});
