import { Suspense } from 'react';
import { tmdb } from '@/app/utils/tmdb';
import { getPrimaryGenre } from '../utils/genres';
import FeaturedBanner from '../components/FeaturedBanner';
import MovieCarousel from '../components/MovieCarousel';
import LoadingSpinner from '../components/LoadingSpinner';

async function getMovies() {
  try {
    const [trending, popular, topRated] = await Promise.all([
      tmdb.getTrendingMovies(),
      tmdb.getPopularMovies(),
      tmdb.getTopRatedMovies(),
    ]);

    return {
      featured: trending[0],
      trending: trending.slice(1),
      popular,
      topRated,
    };
  } catch (error) {
    console.error('Error fetching movies:', error);
    return {
      featured: null,
      trending: [],
      popular: [],
      topRated: [],
    };
  }
}

export default async function MoviesPage() {
  const { featured, trending, popular, topRated } = await getMovies();

  if (!featured) {
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
    posterUrl: tmdb.getImageUrl(movie.poster_path, 'w500'),
    year: tmdb.formatYear(movie.release_date),
    rating: movie.vote_average.toFixed(1),
    duration: tmdb.formatRuntime(movie.runtime) || '2h',
    genre: getPrimaryGenre(movie.genre_ids),
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-nebula-950 to-black">
      <div className="relative">
        <Suspense fallback={<LoadingSpinner />}>
          <FeaturedBanner movie={transformMovie(featured)} type="movie" />
        </Suspense>

        <div className="relative z-10 px-4 pb-20 sm:px-6 lg:px-8">
          <Suspense fallback={<LoadingSpinner />}>
            <section className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Trending Movies</h2>
              <MovieCarousel movies={trending.map(transformMovie)} type="movie" />
            </section>

            <section className="mt-12">
              <h2 className="text-xl font-semibold mb-4">Popular Movies</h2>
              <MovieCarousel movies={popular.map(transformMovie)} type="movie" />
            </section>

            <section className="mt-12">
              <h2 className="text-xl font-semibold mb-4">Top Rated Movies</h2>
              <MovieCarousel movies={topRated.map(transformMovie)} type="movie" />
            </section>
          </Suspense>
        </div>
      </div>
    </main>
  );
}
