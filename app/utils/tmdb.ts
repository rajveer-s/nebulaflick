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
      genre: show.genre_ids?.map((id: string | number) => TMDB_GENRES[id]).join(', ') || 'Unknown',
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

  async getSeasonDetails(showId: string, seasonNumber: number) {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${showId}/season/${seasonNumber}?api_key=${TMDB_API_KEY}&language=en-US`
    );
    return response.json();
  },

  async getSeasonVideos(showId: string, seasonNumber: number) {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${showId}/season/${seasonNumber}/videos?api_key=${TMDB_API_KEY}&language=en-US`
    );
    return response.json();
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

  async getImdbId(type: 'movie' | 'show', id: string): Promise<string | null> {
    try {
      const endpoint = type === 'show' ? 'tv' : 'movie';
      const response = await fetch(
        `${TMDB_BASE_URL}/${endpoint}/${id}/external_ids?api_key=${TMDB_API_KEY}`
      );
      const data = await response.json();
      return data.imdb_id || null;
    } catch (error) {
      console.error('Failed to fetch IMDb ID:', error);
      return null;
    }
  },

  // Get streaming providers for a movie
  async getProviders(type: 'movie' | 'show', id: string): Promise<any> {
    try {
      const endpoint = type === 'show' ? 'tv' : 'movie';
      const response = await fetch(
        `${TMDB_BASE_URL}/${endpoint}/${id}/watch/providers?api_key=${TMDB_API_KEY}`
      );
      const data = await response.json();
      return data.results || {};
    } catch (error) {
      console.error('Failed to fetch providers:', error);
      return {};
    }
  },

  // Get movies available on a specific provider (like Netflix, Prime)
  async getMoviesByProvider(providerId: number, region: string = 'US'): Promise<TMDbMovie[]> {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_watch_providers=${providerId}&watch_region=${region}&language=en-US`
      );
      const data = await response.json() as TMDbResponse<TMDbMovie>;
      return data.results || [];
    } catch (error) {
      console.error('Failed to fetch movies by provider:', error);
      return [];
    }
  },

  // Get shows available on a specific provider (like Netflix, Prime)
  async getShowsByProvider(providerId: number, region: string = 'US'): Promise<any[]> {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_watch_providers=${providerId}&watch_region=${region}&language=en-US`
      );
      const data = await response.json() as TMDbResponse<any>;
      return data.results || [];
    } catch (error) {
      console.error('Failed to fetch shows by provider:', error);
      return [];
    }
  },
  
  // Catalog functions for movies
  async getMovieCatalogs(region: string = 'US'): Promise<Record<string, any[]>> {
    const { NETFLIX, HBO_MAX, DISNEY_PLUS, HULU, PRIME_VIDEO, PARAMOUNT_PLUS, PEACOCK } = 
      await import('./providers').then(mod => mod.STREAMING_PROVIDERS);
    
    const [popular, netflix, hboMax, disney, hulu, prime, paramount, peacock] = await Promise.all([
      this.getPopularMovies(),
      this.getMoviesByProvider(NETFLIX, region),
      this.getMoviesByProvider(HBO_MAX, region),
      this.getMoviesByProvider(DISNEY_PLUS, region),
      this.getMoviesByProvider(HULU, region),
      this.getMoviesByProvider(PRIME_VIDEO, region),
      this.getMoviesByProvider(PARAMOUNT_PLUS, region),
      this.getMoviesByProvider(PEACOCK, region)
    ]);

    return {
      popular: this.transformMovies(popular),
      netflix: this.transformMovies(netflix),
      hboMax: this.transformMovies(hboMax),
      disney: this.transformMovies(disney),
      hulu: this.transformMovies(hulu),
      prime: this.transformMovies(prime),
      paramount: this.transformMovies(paramount),
      peacock: this.transformMovies(peacock)
    };
  },

  // Catalog functions for shows
  async getShowCatalogs(region: string = 'US'): Promise<Record<string, any[]>> {
    const { NETFLIX, HBO_MAX, DISNEY_PLUS, HULU, PRIME_VIDEO, PARAMOUNT_PLUS, PEACOCK } = 
      await import('./providers').then(mod => mod.STREAMING_PROVIDERS);
    
    const [popular, netflix, hboMax, disney, hulu, prime, paramount, peacock] = await Promise.all([
      this.getPopularShows(),
      this.getShowsByProvider(NETFLIX, region),
      this.getShowsByProvider(HBO_MAX, region),
      this.getShowsByProvider(DISNEY_PLUS, region),
      this.getShowsByProvider(HULU, region),
      this.getShowsByProvider(PRIME_VIDEO, region),
      this.getShowsByProvider(PARAMOUNT_PLUS, region),
      this.getShowsByProvider(PEACOCK, region)
    ]);

    return {
      popular: this.transformShows(popular),
      netflix: this.transformShows(netflix),
      hboMax: this.transformShows(hboMax),
      disney: this.transformShows(disney),
      hulu: this.transformShows(hulu),
      prime: this.transformShows(prime),
      paramount: this.transformShows(paramount),
      peacock: this.transformShows(peacock)
    };
  }
};