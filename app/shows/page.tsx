'use client';

import { useState, useEffect } from 'react';
import { tmdb, type TMDbMovie } from '../utils/tmdb';
import { getPrimaryGenre } from '../utils/genres';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/Select';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import Image from 'next/image';
import FeaturedBanner from '../components/FeaturedBanner';
import MovieCarousel from '../components/MovieCarousel';

const genreOptions = [
  { value: 'all', label: 'All Genres' },
  ...Object.entries(TMDB_GENRES).map(([id, name]) => ({
    value: id,
    label: name,
  })),
];

async function getShows() {
  const [trending, popular, topRated] = await Promise.all([
    tmdb.getTrending('tv'),
    tmdb.getPopular('tv'),
    tmdb.getTopRated('tv'),
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
  const transformShow = (show: TMDbMovie) => ({
    id: show.id.toString(),
    title: show.name || show.title,
    description: show.overview,
    backdropUrl: tmdb.getImageUrl(show.backdrop_path),
    posterUrl: tmdb.getImageUrl(show.poster_path, 'w500'),
    year: tmdb.formatYear(show.first_air_date || show.release_date),
    rating: show.vote_average.toFixed(1),
    duration: '45m', // Default episode duration
    genre: getPrimaryGenre(show.genre_ids),
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-nebula-950 to-black">
      <Navbar />
      
      <div className="relative">
        <FeaturedBanner movie={transformShow(featured)} />
        
        <div className="relative z-10 px-4 pb-20 sm:px-6 lg:px-8">
          <section className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Trending Now</h2>
            <MovieCarousel movies={trending.map(transformShow)} />
          </section>
          
          <section className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Popular Shows</h2>
            <MovieCarousel movies={popular.map(transformShow)} />
          </section>
          
          <section className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Top Rated</h2>
            <MovieCarousel movies={topRated.map(transformShow)} />
          </section>
        </div>
      </div>
    </main>
  );
} 