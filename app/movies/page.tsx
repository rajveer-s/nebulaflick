import { Suspense } from 'react';
import { tmdb } from '@/app/utils/tmdb';
import { getPrimaryGenre } from '../utils/genres';
import FeaturedBanner from '../components/FeaturedBanner';
import MovieCarousel from '../components/MovieCarousel';
import LoadingSpinner from '../components/LoadingSpinner';
import { PROVIDER_NAMES } from '../utils/providers';

async function getMovies() {
  try {
    // Get trending movies for the featured banner
    const trending = await tmdb.getTrendingMovies();
    
    // Get top 5 trending movies for the featured banner
    const featured = trending.slice(0, 5);
    
    // Get all catalogs of movies by streaming service
    const catalogs = await tmdb.getMovieCatalogs();
    
    return {
      featured,            // Use top 5 trending movies for the featured banner
      trending: trending,  // Keep all trending movies in the trending section
      ...catalogs
    };
  } catch (error) {
    console.error('Error fetching movies:', error);
    return {
      featured: [],
      trending: [],
      popular: [],
      netflix: [],
      hboMax: [],
      disney: [],
      hulu: [],
      prime: [],
      paramount: [],
      peacock: []
    };
  }
}

export default async function MoviesPage() {
  const movies = await getMovies();
  const { featured, trending } = movies;

  if (!featured.length) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-black via-nebula-950 to-black">
        <div className="flex items-center justify-center h-screen">
          <p>Failed to load movies. Please try again later.</p>
        </div>
      </main>
    );
  }

  // Transform TMDb movie data to match our component props
  const transformMovie = (movie: any) => ({
    id: movie.id.toString(),
    title: movie.title,
    description: movie.overview,
    backdropUrl: tmdb.getImageUrl(movie.backdrop_path),
    posterUrl: movie.posterUrl || tmdb.getImageUrl(movie.poster_path, 'w500'),
    year: movie.release_date ? tmdb.formatYear(movie.release_date) : 0, // Default to 0 if undefined
    rating: movie.vote_average ? movie.vote_average.toFixed(1) : undefined,
    duration: movie.runtime ? tmdb.formatRuntime(movie.runtime) : '',
    genre: movie.genre || getPrimaryGenre(movie.genre_ids),
  });

  // Streaming service styling
  const providerStyles = {
    netflix: "text-red-600",
    hboMax: "text-purple-500",
    disney: "text-blue-500",
    hulu: "text-green-500",
    prime: "text-blue-400",
    paramount: "text-blue-800",
    peacock: "text-yellow-400"
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-nebula-950 to-black">
      <div className="relative">
        <Suspense fallback={<LoadingSpinner />}>
          <FeaturedBanner movies={featured.map(transformMovie)} type="movie" />
        </Suspense>

        <div className="relative z-10 px-4 pb-20 sm:px-6 lg:px-8">
          <Suspense fallback={<LoadingSpinner />}>
            <section className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Trending Movies</h2>
              {trending.length > 0 && (
                <MovieCarousel movies={trending.map(transformMovie)} type="movie" />
              )}
            </section>
            
            {/* Netflix movies section */}
            {movies.netflix && movies.netflix.length > 0 && (
              <section className="mt-12">
                <h2 className="text-xl font-semibold mb-4">
                  <span className={providerStyles.netflix}>Netflix</span> Movies
                </h2>
                <MovieCarousel movies={movies.netflix.map(transformMovie)} type="movie" />
              </section>
            )}
            
            {/* HBO Max movies section */}
            {movies.hboMax && movies.hboMax.length > 0 && (
              <section className="mt-12">
                <h2 className="text-xl font-semibold mb-4">
                  <span className={providerStyles.hboMax}>HBO Max</span> Movies
                </h2>
                <MovieCarousel movies={movies.hboMax.map(transformMovie)} type="movie" />
              </section>
            )}
            
            {/* Disney+ movies section */}
            {movies.disney && movies.disney.length > 0 && (
              <section className="mt-12">
                <h2 className="text-xl font-semibold mb-4">
                  <span className={providerStyles.disney}>Disney+</span> Movies
                </h2>
                <MovieCarousel movies={movies.disney.map(transformMovie)} type="movie" />
              </section>
            )}
            
            {/* Hulu movies section */}
            {movies.hulu && movies.hulu.length > 0 && (
              <section className="mt-12">
                <h2 className="text-xl font-semibold mb-4">
                  <span className={providerStyles.hulu}>Hulu</span> Movies
                </h2>
                <MovieCarousel movies={movies.hulu.map(transformMovie)} type="movie" />
              </section>
            )}
            
            {/* Prime Video movies section */}
            {movies.prime && movies.prime.length > 0 && (
              <section className="mt-12">
                <h2 className="text-xl font-semibold mb-4">
                  <span className={providerStyles.prime}>Prime Video</span> Movies
                </h2>
                <MovieCarousel movies={movies.prime.map(transformMovie)} type="movie" />
              </section>
            )}
            
            {/* Paramount+ movies section */}
            {movies.paramount && movies.paramount.length > 0 && (
              <section className="mt-12">
                <h2 className="text-xl font-semibold mb-4">
                  <span className={providerStyles.paramount}>Paramount+</span> Movies
                </h2>
                <MovieCarousel movies={movies.paramount.map(transformMovie)} type="movie" />
              </section>
            )}
            
            {/* Peacock movies section */}
            {movies.peacock && movies.peacock.length > 0 && (
              <section className="mt-12">
                <h2 className="text-xl font-semibold mb-4">
                  <span className={providerStyles.peacock}>Peacock</span> Movies
                </h2>
                <MovieCarousel movies={movies.peacock.map(transformMovie)} type="movie" />
              </section>
            )}
          </Suspense>
        </div>
      </div>
    </main>
  );
}
