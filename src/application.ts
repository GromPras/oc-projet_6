const apiUrl = "http://localhost:8000/api/v1";

interface Sort {
  sortBy: string;
  asc?: boolean;
}

const apiCall = async (
  endpoint: string,
  pageSize = 7,
  category?: string,
  sort?: Sort
): Promise<any> => {
  const sortBy = sort?.sortBy ? sort.sortBy : null;
  const asc = sort?.asc ? sort.asc : true;
  let query = "";
  if (category) {
    query += `genre=${category}&`;
  }
  if (sortBy) {
    query += `sort_by=${asc ? "-" : ""}${sortBy}&`;
  }

  try {
    const response = await fetch(`
        ${apiUrl}/${endpoint}?${query}page_size=${pageSize}`);
    const { results } = await response.json();
    return results;
  } catch (error) {}
};
console.log("JustStreamIt");

const getBestMovies = async (category?: string): Promise<any> => {
  try {
    const results = await apiCall(
      "titles",
      8,
      category ? category : undefined,
      {
        sortBy: "imdb_score",
      }
    );
    const bestMovies = results;
    return bestMovies;
  } catch (error) {}
};

const getCategories = async (): Promise<any> => {
  try {
    const results = await apiCall("genres", 25);
    return results;
  } catch (error) {}
};

const createCarousel = (carousel, movies) => {
  movies.forEach((m) => {
    const div = document.createElement("div");
    const img = document.createElement("img");
    img.src = m.image_url;
    img.alt = m.title;
    div.appendChild(img);
    carousel.appendChild(div);
  });
  return carousel;
};

const createCarouselSection = (id, category) => {
  getBestMovies(category).then((response) => {
    id.firstChild.textContent = `Best ${category} Movies`;
    id = createCarousel(id, response);
  });
  return id;
};

const featuredFilm = document.getElementById("hero");
let bestMoviesCarousel = document.getElementById("bestOverall");
getBestMovies().then((response) => {
  const movie = response[0];
  const div = document.createElement("div");
  const img = document.createElement("img");
  img.src = movie.image_url;
  img.alt = movie.title;
  div.appendChild(img);
  featuredFilm.appendChild(div);
  bestMoviesCarousel.firstChild.textContent = "Best Movies Overall";
  bestMoviesCarousel = createCarousel(bestMoviesCarousel, response.slice(1));
});
// Create first cat best of
let bestOfCat1 = document.getElementById("cat1");
bestOfCat1 = createCarouselSection(bestOfCat1, "Sci-Fi");

// Create second cat best of
let bestOfCat2 = document.getElementById("cat2");
bestOfCat2 = createCarouselSection(bestOfCat2, "Biography");

// Create third cat best of
let bestOfCat3 = document.getElementById("cat3");
bestOfCat3 = createCarouselSection(bestOfCat3, "Comedy");

let categoriesList: HTMLUListElement =
  document.getElementsByClassName("header__nav__list");
getCategories().then((response) => {
  response.forEach((e) => {
    categoriesList.appendChild();
  });
});
