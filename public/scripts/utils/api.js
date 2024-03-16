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
