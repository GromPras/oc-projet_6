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

  const response = await fetch(`
        ${apiUrl}/${endpoint}?${query}page_size=${pageSize}`);
  const { results } = await response.json();
  return results;
};
console.log("JustStreamIt");

const getBestMovies = async (category?: string): Promise<any> => {
  const results = await apiCall("titles", 7, category ? category : "", {
    sortBy: "imdb_score",
  });
  //localhost:8000/api/v1/titles?genre=sci-fi&sort_by=-imdb_score&page_size=7
  const bestMovies = results;
  console.log(bestMovies);
  const bestMovieOverall = bestMovies[0];
  console.log(bestMovieOverall);
};

const getCategories = async (): Promise<any> => {
  const results = await apiCall("genres", 25);
  console.log(results);
};

getBestMovies();
getCategories();
