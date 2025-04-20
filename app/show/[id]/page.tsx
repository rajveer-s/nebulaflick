'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Image from 'next/image';
import { Play, Star, Clock, Calendar, Loader2 } from 'lucide-react';
import { tmdb } from '@/app/utils/tmdb';
import { getGenreName } from '@/app/utils/genres';
import { torrentio } from '@/app/utils/torrentio';
import { realDebrid } from '@/app/utils/real-debrid';
import MovieCarousel from '@/app/components/MovieCarousel';
import StreamModal from '@/app/components/StreamModal';
import Navbar from '@/app/components/Navbar';

interface Genre {
  id: number;
  name: string;
}

export default function ShowPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [show, setShow] = useState<any>(null);
  const [streams, setStreams] = useState<any[]>([]);
  const [showStreamModal, setShowStreamModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    async function loadShow() {
      try {
        const showData = await tmdb.getShow(resolvedParams.id);
        const imdbId = await tmdb.getImdbId('show', resolvedParams.id);
        setShow({ ...showData, imdbId });
      } catch (error) {
        console.error('Failed to load show:', error);
      } finally {
        setIsInitialLoading(false);
      }
    }
    loadShow();
  }, [resolvedParams.id]);

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-nebula-600" />
      </div>
    );
  }

  if (!show) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/70">Show not found</p>
      </div>
    );
  }

  const handlePlayClick = async () => {
    try {
      setIsLoading(true);
      const rdToken = realDebrid.getToken();
      if (!rdToken) {
        alert('Please set your Real-Debrid token in settings');
        return;
      }

      if (!show.imdbId) {
        alert('IMDb ID not found for this show');
        return;
      }

      // Fetch streams from Torrentio
      const allStreams = await torrentio.getStreams('show', show.imdbId, rdToken);
      
      // Filter only cached streams
      const cachedStreams = await torrentio.filterCachedStreams(allStreams, rdToken);
      
      if (cachedStreams.length === 0) {
        alert('No cached streams found for this show');
        return;
      }

      setStreams(cachedStreams);
      setShowStreamModal(true);
    } catch (error) {
      console.error('Failed to fetch streams:', error);
      alert('Failed to fetch streams. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const trailerUrl = tmdb.getTrailer(show.videos);

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-nebula-950 to-black">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[70vh] w-full">
        <div className="absolute inset-0">
          <Image
            src={tmdb.getImageUrl(show.backdrop_path)}
            alt={show.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-full items-end pb-24">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Show Poster */}
              <div className="shrink-0 w-48 md:w-64 rounded-lg overflow-hidden">
                <Image
                  src={tmdb.getImageUrl(show.poster_path, 'w500')}
                  alt={show.name}
                  width={256}
                  height={384}
                  className="w-full"
                />
              </div>

              {/* Show Info */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-4">{show.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
                  <span className="flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    {show.vote_average.toFixed(1)}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {show.episode_run_time?.[0] || 45}m
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {tmdb.formatYear(show.first_air_date)}
                  </span>
                  <span>{show.genres?.map((g: Genre) => g.name).join(', ')}</span>
                </div>

                <p className="text-lg text-white/90 mb-8">{show.overview}</p>

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

                {/* Seasons Info */}
                <div className="mt-8">
                  <h2 className="text-lg font-semibold mb-2">
                    {show.number_of_seasons} Season{show.number_of_seasons !== 1 ? 's' : ''} ·{' '}
                    {show.number_of_episodes} Episode{show.number_of_episodes !== 1 ? 's' : ''}
                  </h2>
                  <p className="text-white/70">
                    {show.status} · {show.networks?.[0]?.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Shows */}
      {show.similar?.results?.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold mb-6">Similar Shows</h2>
            <MovieCarousel
              movies={show.similar.results.map((s: any) => ({
                id: s.id.toString(),
                title: s.name,
                posterUrl: tmdb.getImageUrl(s.poster_path, 'w500'),
                genre: getGenreName(s.genre_ids?.[0]),
              }))}
              type="show"
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
