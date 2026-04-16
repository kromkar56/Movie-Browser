// OMDB API configuration
// Using a public demo key - users can replace with their own from https://www.omdbapi.com/
const API_KEY = 'b9bd48a6';
const BASE_URL = 'https://www.omdbapi.com/';

export const searchMovies = async (query, page = 1) => {
  try {
    const url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    if (data.Response === 'False') {
      return { error: data.Error, results: [], totalResults: 0 };
    }
    return {
      results: data.Search || [],
      totalResults: parseInt(data.totalResults) || 0,
      error: null,
    };
  } catch (err) {
    return { error: err.message, results: [], totalResults: 0 };
  }
};

export const getMovieDetails = async (imdbId) => {
  try {
    const url = `${BASE_URL}?apikey=${API_KEY}&i=${imdbId}&plot=full`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    if (data.Response === 'False') {
      return { error: data.Error, movie: null };
    }
    return { movie: data, error: null };
  } catch (err) {
    return { error: err.message, movie: null };
  }
};

export const getPopularMovies = async (query) => {
  return searchMovies(query, 1);
};
