const apiUrl = "http://localhost:8000/api/v1";

export const query = async (route, params) => {
  try {
    const response = await fetch(`${apiUrl}/${route}`, params);
    const results = await response.json();

    return results;
  } catch (error) {
    console.log(error);
  }
};
