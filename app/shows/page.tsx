// 'use client';

import { useState, useEffect } from 'react';
import { tmdb } from '../utils/tmdb';
import { getPrimaryGenre, TMDB_GENRES } from '../utils/genres';
import FeaturedBanner from '../components/FeaturedBanner';
import MovieCarousel from '../components/MovieCarousel';

async function getShows() {
  const [trending, popular, topRated] = await Promise.all([
    tmdb.getTrendingShows(),
    tmdb.getPopularShows(),
    tmdb.getTopRatedShows(),
  ]);

  return {
    featured: trending[0],
    trending: trending.slice(1),
    popular,
    topRated,
  };
}

export default async function ShowsPage() {
  const { featured, trending, popular, topRated } = await getShows();

  // Transform TMDb show data to match our component props
  const transformShow = (show: any) => ({
    id: show.id.toString(),
    title: show.name,
    description: show.overview,
    backdropUrl: tmdb.getImageUrl(show.backdrop_path),
    posterUrl: tmdb.getImageUrl(show.poster_path, 'w500'),
    year: tmdb.formatYear(show.first_air_date),
    rating: show.vote_average.toFixed(1),
    duration: `${show.episode_run_time?.[0] || 45}m`,
    genre: getPrimaryGenre(show.genre_ids),
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-nebula-950 to-black">
      <div className="relative">
        <FeaturedBanner movie={transformShow(featured)} type="show" />

        <div className="relative z-10 px-4 pb-20 sm:px-6 lg:px-8">
          <section className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Trending TV Shows</h2>
            <MovieCarousel movies={trending.map(transformShow)} type="show" />
          </section>

          <section className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Popular TV Shows</h2>
            <MovieCarousel movies={popular.map(transformShow)} type="show" />
          </section>

          <section className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Top Rated TV Shows</h2>
            <MovieCarousel movies={topRated.map(transformShow)} type="show" />
          </section>
        </div>
      </div>
    </main>
  );
}
