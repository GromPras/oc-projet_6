const apiUrl = "http://localhost:8000/api/v1";

const query = async (route: string, params?: {}): Promise<any> => {
  try {
    const response = await fetch(`${apiUrl}/${route}`, params);
    const results = await response.json();

    return results;
  } catch (error) {
    console.log(error);
  }
};

const getBestMovies = async (): Promise<any> => {
  try {
    const { results } = await query(`titles?sort_by=-imdb_score&page_size=8`);
    return results;
  } catch (error) {
    console.log(error);
  }
};

const getBestCategoryMovies = async (category: string): Promise<any> => {
  try {
    const { results } = await query(
      `titles?genre=${category}&sort_by=-imdb_score&page_size=7`
    );
    return results;
  } catch (error) {
    console.log(error);
  }
};

const getMovie = async (movieId: string): Promise<any> => {
  try {
    const result = await query(`titles/${movieId}`);
    return result;
  } catch (error) {
    console.log(error);
  }
};

const createMediaScroller = (
  category: string,
  index: number,
  medias: [any]
): string => {
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

const handleSlide = (classList: string, id: string) => {
  let mediaGroup;
  if (classList.includes("left")) {
    mediaGroup = document
      .getElementById(id)
      .parentElement.querySelector(".media-group");
    console.log(mediaGroup.style.transform);

    mediaGroup.style.transform = "translateX(100%)";
  } else {
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
    const sliderHandles = document.querySelectorAll(".handle");
    sliderHandles.forEach((e) => {
      e.addEventListener("click", function () {
        handleSlide(e.classList.toString(), e.getAttribute("id"));
      });
    });
  } catch (error) {
    console.log(error);
  }
});
