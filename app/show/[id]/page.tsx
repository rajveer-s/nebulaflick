'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Image from 'next/image';
import { Play, Star, Clock, Calendar, Loader2 } from 'lucide-react';
import { tmdb } from '@/app/utils/tmdb';
import { getGenreName } from '@/app/utils/genres';
import { torrentio } from '@/app/utils/torrentio';
import MovieCarousel from '@/app/components/MovieCarousel';
import StreamModal from '@/app/components/StreamModal';
import SeasonSelector from '@/app/components/SeasonSelector';

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
  const [seasons, setSeasons] = useState<any[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);

  useEffect(() => {
    async function loadShow() {
      try {
        const showData = await tmdb.getShow(resolvedParams.id);
        const imdbId = await tmdb.getImdbId('show', resolvedParams.id);
        setShow({ ...showData, imdbId });

        // Load season details
        const seasonPromises = showData.seasons.map((season: any) =>
          tmdb.getSeasonDetails(resolvedParams.id, season.season_number)
        );
        const seasonDetails = await Promise.all(seasonPromises);
        setSeasons(seasonDetails);
      } catch (error) {
        console.error('Failed to load show:', error);
      } finally {
        setIsInitialLoading(false);
      }
    }
    loadShow();
  }, [resolvedParams.id]);

  const handleEpisodeSelect = async (seasonNumber: number, episodeNumber: number) => {
    try {
      setSelectedSeason(seasonNumber);
      setSelectedEpisode(episodeNumber);
      setIsLoading(true);
      
      if (!show.imdbId) {
        alert('IMDb ID not found for this show');
        return;
      }

      // Fetch streams for specific episode
      const streams = await torrentio.getStreams('show', show.imdbId, {
        season: seasonNumber,
        episode: episodeNumber
      });
      
      if (streams.length === 0) {
        alert('No streams found for this episode');
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

  const trailerUrl = tmdb.getTrailer(show.videos);

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-nebula-950 to-black">
      {/* Hero Section */}
      <div className="relative min-h-screen pb-16 md:pb-24">
        <div className="absolute inset-0">
          <Image
            src={tmdb.getImageUrl(show.backdrop_path)}
            alt={show.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/20 to-transparent" />
        </div>

        <div className="relative min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-screen items-center">
            <div className="flex flex-col md:flex-row gap-8 items-start py-24">
              {/* Show Poster */}
              <div className="shrink-0 w-48 md:w-64 rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={tmdb.getImageUrl(show.poster_path, 'w500')}
                  alt={show.name}
                  width={256}
                  height={384}
                  className="w-full rounded-lg"
                />
              </div>

              {/* Show Info */}
              <div className="flex-1 space-y-6">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">{show.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-white/90">
                  <span className="flex items-center bg-white/10 rounded-full px-3 py-1">
                    <Star className="w-4 h-4 mr-1" />
                    {show.vote_average.toFixed(1)}
                  </span>
                  <span className="flex items-center bg-white/10 rounded-full px-3 py-1">
                    <Clock className="w-4 h-4 mr-1" />
                    {show.episode_run_time?.[0] || 45}m
                  </span>
                  <span className="flex items-center bg-white/10 rounded-full px-3 py-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    {tmdb.formatYear(show.first_air_date)}
                  </span>
                  <span className="bg-white/10 rounded-full px-3 py-1">{show.genres?.map((g: Genre) => g.name).join(', ')}</span>
                </div>

                <p className="text-base md:text-lg text-white/90 max-w-3xl">{show.overview}</p>

                {trailerUrl && (
                  <button
                    onClick={() => window.open(trailerUrl, '_blank')}
                    className="flex items-center gap-2 px-6 py-3 bg-nebula-600 hover:bg-nebula-700 rounded-lg font-semibold transition-colors duration-200"
                  >
                    <Play className="w-5 h-5" />
                    Watch Trailer
                  </button>
                )}

                <div className="pt-6 border-t border-white/10">
                  <h2 className="text-lg font-semibold mb-2">
                    {show.number_of_seasons} Season{show.number_of_seasons !== 1 ? 's' : ''} ·{' '}
                    {show.number_of_episodes} Episode{show.number_of_episodes !== 1 ? 's' : ''}
                  </h2>
                  <p className="text-white/70 mb-4">
                    {show.status} · {show.networks?.[0]?.name}
                  </p>

                  {/* Season and Episode Selector */}
                  {seasons.length > 0 && (
                    <div className="mt-6">
                      <SeasonSelector
                        seasons={seasons}
                        onEpisodeSelect={handleEpisodeSelect}
                      />
                    </div>
                  )}
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
          movieTitle={`${show.name} - S${selectedSeason}E${selectedEpisode}`}
        />
      )}
    </main>
  );
}
