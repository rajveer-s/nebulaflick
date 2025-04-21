'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Play, Star, Clock, Calendar, Loader2 } from 'lucide-react';
import { tmdb } from '@/app/utils/tmdb';
import { getGenreName } from '@/app/utils/genres';
import { torrentio } from '@/app/utils/torrentio';
import MovieCarousel from '@/app/components/MovieCarousel';
import StreamModal from '@/app/components/StreamModal';

export default function MoviePage() {
  const params = useParams();
  const movieId = params.id as string;

  const [movie, setMovie] = useState<any>(null);
  const [streams, setStreams] = useState<any[]>([]);
  const [showStreamModal, setShowStreamModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    async function loadMovie() {
      try {
        // Fetch movie details from TMDB
        const movieData = await tmdb.getMovie(movieId);
        const imdbId = await tmdb.getImdbId('movie', movieId);
        setMovie({ ...movieData, imdbId });
      } catch (error) {
        console.error('Failed to load movie:', error);
      } finally {
        setIsInitialLoading(false);
      }
    }
    loadMovie();
  }, [movieId]);

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

  const trailerUrl = movie.videos ? tmdb.getTrailer(movie.videos) : null;
  const posterUrl = tmdb.getImageUrl(movie.poster_path);
  const backdropUrl = tmdb.getImageUrl(movie.backdrop_path);

  // Convert trailer URL to embed format for iframe with additional parameters
  // rel=0 removes related videos, modestbranding=1 shows minimal YouTube branding
  // hd=1 forces HD quality if available, controls=1 ensures player controls are shown
  const embedTrailerUrl = trailerUrl
    ? trailerUrl.replace('youtube.com/watch?v=', 'youtube.com/embed/').replace('?v=', '/') + '?rel=0&modestbranding=1&hd=1&controls=1&autoplay=0' 
    : null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-nebula-950 to-black">
      {/* Hero Section - Added padding-top for better visibility on all screens */}
      <div className="relative min-h-screen w-full">
        <div className="absolute inset-0">
          {backdropUrl && (
            <Image
              src={backdropUrl}
              alt={movie.title}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/20 to-transparent" />
        </div>

        <div className="relative min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Changed to flex with proper padding instead of absolute positioning */}
          <div className="flex flex-col justify-center pt-24 pb-16 min-h-screen">
            <div className="w-full">
              {/* Poster and Trailer Section */}
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                {/* Poster */}
                <div className="shrink-0 w-48 md:w-64 rounded-lg overflow-hidden">
                  {posterUrl && (
                    <Image
                      src={posterUrl}
                      alt={movie.title}
                      width={256}
                      height={384}
                      className="w-full rounded-lg shadow-lg"
                    />
                  )}
                </div>

                {/* Trailer Player */}
                {trailerUrl && (
                  <div className="flex-1 w-full aspect-video rounded-lg overflow-hidden shadow-lg">
                    <iframe
                      className="w-full h-full rounded-lg"
                      src={embedTrailerUrl || undefined}
                      title={`${movie.title} Trailer`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
              </div>

              {/* Movie Info Section - Below poster and trailer */}
              <div className="max-w-3xl">
                <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
                  {movie.vote_average && (
                    <span className="flex items-center bg-white/10 rounded-full px-3 py-1">
                      <Star className="w-4 h-4 mr-1" />
                      {typeof movie.vote_average === 'number' ? movie.vote_average.toFixed(1) : movie.vote_average}
                    </span>
                  )}
                  {movie.runtime && (
                    <span className="flex items-center bg-white/10 rounded-full px-3 py-1">
                      <Clock className="w-4 h-4 mr-1" />
                      {tmdb.formatRuntime(movie.runtime)}
                    </span>
                  )}
                  {movie.release_date && (
                    <span className="flex items-center bg-white/10 rounded-full px-3 py-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      {typeof movie.release_date === 'string' 
                        ? tmdb.formatYear(movie.release_date) 
                        : movie.release_date}
                    </span>
                  )}
                  {movie.genres && (
                    <span className="bg-white/10 rounded-full px-3 py-1">{movie.genres?.map((g: any) => g.name).join(', ')}</span>
                  )}
                </div>
                
                <p className="text-lg text-white/90 mb-8">{movie.overview}</p>
                
                {movie.imdbId && (
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
                )}
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
          movieTitle={movie.title}
        />
      )}
    </main>
  );
}