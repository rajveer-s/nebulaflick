'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Image from 'next/image';
import { Play, Star, Clock, Calendar, Loader2 } from 'lucide-react';
import { tmdb } from '@/app/utils/tmdb';
import { getGenreName } from '@/app/utils/genres';
import { torrentio } from '@/app/utils/torrentio';
import { realDebrid } from '@/app/utils/real-debrid';
import VideoPlayer from '@/app/components/VideoPlayer';
import MovieCarousel from '@/app/components/MovieCarousel';
import StreamModal from '@/app/components/StreamModal';

interface Genre {
  id: number;
  name: string;
}

export default function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [movie, setMovie] = useState<any>(null);
  const [streams, setStreams] = useState<any[]>([]);
  const [showStreamModal, setShowStreamModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    async function loadMovie() {
      try {
        const movieData = await tmdb.getMovie(resolvedParams.id);
        const imdbId = await tmdb.getImdbId('movie', resolvedParams.id);
        setMovie({ ...movieData, imdbId });
      } catch (error) {
        console.error('Failed to load movie:', error);
      } finally {
        setIsInitialLoading(false);
      }
    }
    loadMovie();
  }, [resolvedParams.id]);

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-nebula-600" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/70">Movie not found</p>
      </div>
    );
  }

  const handlePlayClick = async () => {
    try {
      setIsLoading(true);
      if (!movie.imdbId) {
        alert('IMDb ID not found for this movie');
        return;
      }

      // Fetch streams from configured Torrentio endpoint
      const streams = await torrentio.getStreams('movie', movie.imdbId);
      
      if (streams.length === 0) {
        alert('No streams found for this movie');
        return;
      }

      setStreams(streams);
      setShowStreamModal(true);
    } catch (error) {
      console.error('Failed to fetch streams:', error);
      alert('Failed to fetch streams. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const trailerUrl = tmdb.getTrailer(movie.videos);

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-nebula-950 to-black">
      {/* Hero Section */}
      <div className="relative h-[85vh] w-full">
        <div className="absolute inset-0">
          <Image
            src={tmdb.getImageUrl(movie.backdrop_path)}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/20 to-transparent" />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-full items-end pb-24">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Movie Poster */}
              <div className="shrink-0 w-48 md:w-64 rounded-lg overflow-hidden">
                <Image
                  src={tmdb.getImageUrl(movie.poster_path, 'w500')}
                  alt={movie.title}
                  width={256}
                  height={384}
                  className="w-full"
                />
              </div>

              {/* Movie Info */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
                  <span className="flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    {movie.vote_average.toFixed(1)}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {tmdb.formatRuntime(movie.runtime)}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {tmdb.formatYear(movie.release_date)}
                  </span>
                  <span>{movie.genres?.map((g: Genre) => g.name).join(', ')}</span>
                </div>

                <p className="text-lg text-white/90 mb-8">{movie.overview}</p>

                <div className="flex gap-4">
                  <button
                    onClick={handlePlayClick}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                    Watch Now
                  </button>
                  {trailerUrl && (
                    <button
                      onClick={() => window.open(trailerUrl, '_blank')}
                      className="flex items-center gap-2 px-8 py-3 bg-white/10 rounded-lg font-semibold hover:bg-white/20 transition"
                    >
                      Watch Trailer
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Movies */}
      {movie.similar?.results?.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold mb-6">Similar Movies</h2>
            <MovieCarousel
              movies={movie.similar.results.map((m: any) => ({
                id: m.id.toString(),
                title: m.title,
                posterUrl: tmdb.getImageUrl(m.poster_path, 'w500'),
                genre: getGenreName(m.genre_ids?.[0]),
              }))}
              type="movie"
            />
          </div>
        </section>
      )}

      {/* Stream Modal */}
      {showStreamModal && (
        <StreamModal
          streams={streams}
          onClose={() => setShowStreamModal(false)}
        />
      )}
    </main>
  );
}