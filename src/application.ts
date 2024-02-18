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
      7,
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
    const results = await apiCall("genres", 25).then(() => results);
  } catch (error) {}
};

const carousel = document.getElementById("cat1");
getBestMovies().then((response) => {
  response.forEach((m) => {
    const div = document.createElement("div");
    const img = document.createElement("img");
    img.src = m.image_url;
    img.alt = m.title;
    div.appendChild(img);
    carousel.appendChild(div);
  });
});
// const bestSFMovies = getBestMovies("Sci-Fi");
// const categories = getCategories();
// console.log(categories);
