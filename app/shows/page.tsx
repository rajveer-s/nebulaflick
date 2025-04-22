import { Suspense } from 'react';
import { tmdb } from '../utils/tmdb';
import { getPrimaryGenre } from '../utils/genres';
import FeaturedBanner from '../components/FeaturedBanner';
import MovieCarousel from '../components/MovieCarousel';
import LoadingSpinner from '../components/LoadingSpinner';

// Define a proper interface for TV show data from TMDb
interface TMDbShow {
  id: number;
  name: string;
  title?: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  first_air_date: string;
  vote_average: number;
  episode_run_time?: number[];
  genre_ids?: number[];
  genre?: string;
  posterUrl?: string;
}

async function getShows() {
  try {
    // Get trending shows for the featured banner
    const trending = await tmdb.getTrendingShows();
    
    // Get top 5 trending shows for the featured banner
    const featured = trending.slice(0, 5);
    
    // Get all catalogs of shows by streaming service
    const catalogs = await tmdb.getShowCatalogs();
    
    return {
      featured,            // Use top 5 trending shows for the featured banner
      trending: trending,  // Keep all trending shows in the trending section
      ...catalogs
    };
  } catch (error) {
    console.error('Error fetching shows:', error);
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

export default async function ShowsPage() {
  const shows = await getShows();
  const { featured, trending } = shows;

  if (!featured.length) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-black via-nebula-950 to-black">
        <div className="flex items-center justify-center h-screen">
          <p>Failed to load shows. Please try again later.</p>
        </div>
      </main>
    );
  }

  // Transform TMDb show data to match our component props
  const transformShow = (show: TMDbShow) => ({
    id: show.id.toString(),
    title: show.name || show.title || 'Unknown Show',
    description: show.overview,
    backdropUrl: tmdb.getImageUrl(show.backdrop_path),
    posterUrl: show.posterUrl || tmdb.getImageUrl(show.poster_path, 'w500'),
    year: show.first_air_date ? tmdb.formatYear(show.first_air_date) : 0,
    rating: show.vote_average ? show.vote_average.toFixed(1) : '0.0',
    duration: show.episode_run_time ? `${show.episode_run_time?.[0] || 45}m` : '45m',
    genre: show.genre || getPrimaryGenre(show.genre_ids),
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
          <FeaturedBanner movies={featured.map(transformShow)} type="show" />
        </Suspense>

        <div className="relative z-10 px-4 pb-20 sm:px-6 lg:px-8">
          <Suspense fallback={<LoadingSpinner />}>
            <section className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Trending TV Shows</h2>
              {trending.length > 0 && (
                <MovieCarousel movies={trending.map(transformShow)} type="show" />
              )}
            </section>
            
            {/* Netflix shows section */}
            {shows.netflix && shows.netflix.length > 0 && (
              <section className="mt-12">
                <h2 className="text-xl font-semibold mb-4">
                  <span className={providerStyles.netflix}>Netflix</span> TV Shows
                </h2>
                <MovieCarousel movies={shows.netflix.map(transformShow)} type="show" />
              </section>
            )}
            
            {/* HBO Max shows section */}
            {shows.hboMax && shows.hboMax.length > 0 && (
              <section className="mt-12">
                <h2 className="text-xl font-semibold mb-4">
                  <span className={providerStyles.hboMax}>HBO Max</span> TV Shows
                </h2>
                <MovieCarousel movies={shows.hboMax.map(transformShow)} type="show" />
              </section>
            )}
            
            {/* Disney+ shows section */}
            {shows.disney && shows.disney.length > 0 && (
              <section className="mt-12">
                <h2 className="text-xl font-semibold mb-4">
                  <span className={providerStyles.disney}>Disney+</span> TV Shows
                </h2>
                <MovieCarousel movies={shows.disney.map(transformShow)} type="show" />
              </section>
            )}
            
            {/* Hulu shows section */}
            {shows.hulu && shows.hulu.length > 0 && (
              <section className="mt-12">
                <h2 className="text-xl font-semibold mb-4">
                  <span className={providerStyles.hulu}>Hulu</span> TV Shows
                </h2>
                <MovieCarousel movies={shows.hulu.map(transformShow)} type="show" />
              </section>
            )}
            
            {/* Prime Video shows section */}
            {shows.prime && shows.prime.length > 0 && (
              <section className="mt-12">
                <h2 className="text-xl font-semibold mb-4">
                  <span className={providerStyles.prime}>Prime Video</span> TV Shows
                </h2>
                <MovieCarousel movies={shows.prime.map(transformShow)} type="show" />
              </section>
            )}
            
            {/* Paramount+ shows section */}
            {shows.paramount && shows.paramount.length > 0 && (
              <section className="mt-12">
                <h2 className="text-xl font-semibold mb-4">
                  <span className={providerStyles.paramount}>Paramount+</span> TV Shows
                </h2>
                <MovieCarousel movies={shows.paramount.map(transformShow)} type="show" />
              </section>
            )}
            
            {/* Peacock shows section */}
            {shows.peacock && shows.peacock.length > 0 && (
              <section className="mt-12">
                <h2 className="text-xl font-semibold mb-4">
                  <span className={providerStyles.peacock}>Peacock</span> TV Shows
                </h2>
                <MovieCarousel movies={shows.peacock.map(transformShow)} type="show" />
              </section>
            )}
          </Suspense>
        </div>
      </div>
    </main>
  );
}
