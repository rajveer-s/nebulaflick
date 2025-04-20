import { TMDB_GENRES } from './genres';

const TMDB_API_KEY = '59e5d9cd55843accffd306e516fb393f';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export interface TMDbMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  runtime?: number;
  genres?: { id: number; name: string }[];
  tagline?: string;
  status?: string;
  videos?: {
    results: {
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
    }[];
  };
  credits?: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }[];
    crew: {
      id: number;
      name: string;
      job: string;
    }[];
  };
  similar?: {
    results: TMDbMovie[];
  };
}

export interface TMDbResponse<T> {
  results: T[];
  page: number;
  total_pages: number;
  total_results: number;
}

export const tmdb = {
  // Get trending movies for the featured banner
  getTrending: async (): Promise<TMDbMovie[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/trending/movie/day?api_key=${TMDB_API_KEY}&language=en-US`
    );
    const data = await response.json() as TMDbResponse<TMDbMovie>;
    return data.results;
  },

  // Get popular movies
  getPopular: async (): Promise<TMDbMovie[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US`
    );
    const data = await response.json() as TMDbResponse<TMDbMovie>;
    return data.results;
  },

  // Get top rated movies
  getTopRated: async (): Promise<TMDbMovie[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US`
    );
    const data = await response.json() as TMDbResponse<TMDbMovie>;
    return data.results;
  },

  // Get movie details with videos, credits, and similar movies
  getMovie: async (id: string): Promise<TMDbMovie> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=videos,credits,similar`
    );
    return response.json();
  },

  // Get movie trailer
  getTrailer: (videos?: TMDbMovie['videos']): string | null => {
    if (!videos?.results?.length) return null;
    
    // First try to find official trailer
    const officialTrailer = videos.results.find(
      video => video.type === 'Trailer' && video.site === 'YouTube' && video.name.toLowerCase().includes('official')
    );
    
    // Then any trailer
    const anyTrailer = videos.results.find(
      video => video.type === 'Trailer' && video.site === 'YouTube'
    );
    
    // Finally, any YouTube video
    const anyVideo = videos.results.find(
      video => video.site === 'YouTube'
    );

    const video = officialTrailer || anyTrailer || anyVideo;
    return video ? `https://www.youtube.com/embed/${video.key}` : null;
  },

  // Helper function to get full image URL
  getImageUrl: (path: string | null, size: 'original' | 'w500' | 'w780' = 'original'): string => {
    if (!path) return '/placeholder-poster.jpg';
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
  },

  // Format movie duration
  formatRuntime: (minutes?: number): string => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  },

  // Format release year
  formatYear: (date: string): number => {
    return new Date(date).getFullYear();
  },

  // Format rating to one decimal place
  formatRating: (rating: number): string => {
    return (Math.round(rating * 10) / 10).toFixed(1);
  },

  // Helper functions for movies
  getTrendingMovies: async (): Promise<TMDbMovie[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/trending/movie/day?api_key=${TMDB_API_KEY}&language=en-US`
    );
    const data = await response.json() as TMDbResponse<TMDbMovie>;
    return data.results;
  },

  getPopularMovies: async (): Promise<TMDbMovie[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US`
    );
    const data = await response.json() as TMDbResponse<TMDbMovie>;
    return data.results;
  },

  getTopRatedMovies: async (): Promise<TMDbMovie[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US`
    );
    const data = await response.json() as TMDbResponse<TMDbMovie>;
    return data.results;
  },

  // Helper functions for TV shows
  getTrendingShows: async (): Promise<any[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/trending/tv/day?api_key=${TMDB_API_KEY}&language=en-US`
    );
    const data = await response.json() as TMDbResponse<any>;
    return data.results;
  },

  getPopularShows: async (): Promise<any[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&language=en-US`
    );
    const data = await response.json() as TMDbResponse<any>;
    return data.results;
  },

  getTopRatedShows: async (): Promise<any[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/top_rated?api_key=${TMDB_API_KEY}&language=en-US`
    );
    const data = await response.json() as TMDbResponse<any>;
    return data.results;
  },

  // Transform functions
  transformMovies: (movies: TMDbMovie[]) => {
    return movies.map(movie => ({
      id: movie.id,
      title: movie.title,
      posterUrl: tmdb.getImageUrl(movie.poster_path, 'w500'),
      genre: movie.genre_ids?.map(id => TMDB_GENRES[id]).join(', ') || 'Unknown',
    }));
  },

  transformShows: (shows: any[]) => {
    return shows.map(show => ({
      id: show.id,
      title: show.name,
      posterUrl: tmdb.getImageUrl(show.poster_path, 'w500'),
      genre: show.genre_ids?.map(id => TMDB_GENRES[id]).join(', ') || 'Unknown',
    }));
  },

  getMoviesByGenre: async (genreId: string) => {
    const [trending, popular, topRated] = await Promise.all([
      tmdb.getTrendingMovies(),
      tmdb.getPopularMovies(),
      tmdb.getTopRatedMovies(),
    ]);

    if (genreId === 'all') {
      return {
        trending: tmdb.transformMovies(trending),
        popular: tmdb.transformMovies(popular),
        topRated: tmdb.transformMovies(topRated),
      };
    }

    const filterByGenre = (movies: TMDbMovie[]) => 
      movies.filter(movie => movie.genre_ids?.includes(Number(genreId)));

    return {
      trending: tmdb.transformMovies(filterByGenre(trending)),
      popular: tmdb.transformMovies(filterByGenre(popular)),
      topRated: tmdb.transformMovies(filterByGenre(topRated)),
    };
  },

  getShowsByGenre: async (genreId: string) => {
    const [trending, popular, topRated] = await Promise.all([
      tmdb.getTrendingShows(),
      tmdb.getPopularShows(),
      tmdb.getTopRatedShows(),
    ]);

    if (genreId === 'all') {
      return {
        trending: tmdb.transformShows(trending),
        popular: tmdb.transformShows(popular),
        topRated: tmdb.transformShows(topRated),
      };
    }

    const filterByGenre = (shows: any[]) => 
      shows.filter(show => show.genre_ids?.includes(Number(genreId)));

    return {
      trending: tmdb.transformShows(filterByGenre(trending)),
      popular: tmdb.transformShows(filterByGenre(popular)),
      topRated: tmdb.transformShows(filterByGenre(topRated)),
    };
  },

  async getShow(id: string) {
    const [show, credits, videos, similar] = await Promise.all([
      fetch(`${TMDB_BASE_URL}/tv/${id}?api_key=${TMDB_API_KEY}&language=en-US`).then(res => res.json()),
      fetch(`${TMDB_BASE_URL}/tv/${id}/credits?api_key=${TMDB_API_KEY}&language=en-US`).then(res => res.json()),
      fetch(`${TMDB_BASE_URL}/tv/${id}/videos?api_key=${TMDB_API_KEY}&language=en-US`).then(res => res.json()),
      fetch(`${TMDB_BASE_URL}/tv/${id}/similar?api_key=${TMDB_API_KEY}&language=en-US`).then(res => res.json()),
    ]);

    return {
      ...show,
      credits,
      videos,
      similar,
    };
  },
}; 