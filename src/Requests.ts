const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const requests = {
  fetchTrending: `${BASE_URL}/trending/all/week?api_key=${API_KEY}&language=en-US`,
  fetchTopRated: `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US`,
  fetchActionMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=28&language=en-US`,
  fetchComedyMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=35&language=en-US`,
  fetchHorrorMovies: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=27&language=en-US`,
  searchMovies: `${BASE_URL}/search/multi?api_key=${API_KEY}&language=en-US&query=`,
  
  fetchNowPlaying: `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US`,
  fetchMarvel: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_companies=420&language=en-US`,
  fetchStarWars: `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_companies=1&language=en-US`,
};

export default requests;