'use client';

import { useState, useEffect } from 'react';
import { tmdb } from '@/app/utils/tmdb';
import { TMDB_GENRES } from '@/app/utils/genres';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/Select';
import Navbar from '@/app/components/Navbar';
import Link from 'next/link';
import Image from 'next/image';
import FeaturedBanner from '../components/FeaturedBanner';
import MovieCarousel from '../components/MovieCarousel';
import { getPrimaryGenre } from '../utils/genres';

const genreOptions = [
  { value: 'all', label: 'All Genres' },
  ...Object.entries(TMDB_GENRES).map(([id, name]) => ({
    value: id,
    label: name,
  })),
];

async function getMovies() {
  const [trending, popular, topRated] = await Promise.all([
    tmdb.getTrending('movie'),
    tmdb.getPopular('movie'),
    tmdb.getTopRated('movie'),
  ]);

  return {
    featured: trending[0],
    trending: trending.slice(1),
    popular,
    topRated,
  };
}

export default async function MoviesPage() {
  const { featured, trending, popular, topRated } = await getMovies();

  // Transform TMDb movie data to match our component props
  const transformMovie = (movie: TMDbMovie) => ({
    id: movie.id.toString(),
    title: movie.title,
    description: movie.overview,
    backdropUrl: tmdb.getImageUrl(movie.backdrop_path),
    posterUrl: tmdb.getImageUrl(movie.poster_path, 'w500'),
    year: tmdb.formatYear(movie.release_date),
    rating: movie.vote_average.toFixed(1),
    duration: '2h 15m', // We'll get actual runtime from movie details API
    genre: getPrimaryGenre(movie.genre_ids),
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-nebula-950 to-black">
      <Navbar />
      
      <div className="relative">
        <FeaturedBanner movie={transformMovie(featured)} />
        
        <div className="relative z-10 px-4 pb-20 sm:px-6 lg:px-8">
          <section className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Trending Now</h2>
            <MovieCarousel movies={trending.map(transformMovie)} />
          </section>
          
          <section className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Popular Movies</h2>
            <MovieCarousel movies={popular.map(transformMovie)} />
          </section>
          
          <section className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Top Rated</h2>
            <MovieCarousel movies={topRated.map(transformMovie)} />
          </section>
        </div>
      </div>
    </main>
  );
} 