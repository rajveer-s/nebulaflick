import { Suspense } from 'react';
import Image from 'next/image';
import { Play, Star, Clock, Calendar } from 'lucide-react';
import { tmdb } from '@/app/utils/tmdb';
import { getGenreName, getPrimaryGenre } from '@/app/utils/genres';
import VideoPlayer from '@/app/components/VideoPlayer';
import MovieCarousel from '@/app/components/MovieCarousel';
import Navbar from '@/app/components/Navbar';

async function getShowDetails(id: string) {
  const show = await tmdb.getShow(id);
  return show;
}

export default async function ShowPage({ params }: { params: { id: string } }) {
  const show = await getShowDetails(params.id);
  const trailerUrl = tmdb.getTrailer(show.videos);

  // Transform show for similar shows carousel
  const transformShow = (s: typeof show) => ({
    id: s.id.toString(),
    title: s.name,
    posterUrl: tmdb.getImageUrl(s.poster_path, 'w500'),
    genre: s.genres?.[0]?.name || getPrimaryGenre(s.genre_ids || []),
  });

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
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <div className="flex h-full items-center">
            <div className="flex gap-8">
              {/* Poster */}
              <div className="hidden md:block w-[300px] h-[450px] relative rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={tmdb.getImageUrl(show.poster_path, 'w500')}
                  alt={show.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <div className="max-w-2xl">
                <h1 className="text-4xl sm:text-6xl font-bold mb-4">{show.name}</h1>
                {show.tagline && (
                  <p className="text-xl text-nebula-400 mb-4 italic">"{show.tagline}"</p>
                )}
                <div className="flex items-center gap-6 text-sm mb-6">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span>{tmdb.formatRating(show.vote_average)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{show.episode_run_time?.[0] ? `${show.episode_run_time[0]}m` : 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{tmdb.formatYear(show.first_air_date)}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {show.genres?.map((genre: { id: number; name: string }) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-white/10 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
                <p className="text-lg text-white/90 mb-8">{show.overview}</p>
                {trailerUrl && (
                  <button className="flex items-center gap-2 px-8 py-3 bg-nebula-600 hover:bg-nebula-700 rounded-lg font-semibold transition">
                    <Play className="h-5 w-5" />
                    Watch Trailer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Trailer Section */}
        {trailerUrl && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Trailer</h2>
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <Suspense fallback={<div>Loading trailer...</div>}>
                <iframe
                  src={trailerUrl}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full"
                />
              </Suspense>
            </div>
          </section>
        )}

        {/* Cast Section */}
        {show.credits?.cast?.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {show.credits.cast.slice(0, 6).map((person) => (
                <div key={person.id} className="text-center">
                  <div className="aspect-[2/3] relative rounded-lg overflow-hidden mb-2">
                    <Image
                      src={tmdb.getImageUrl(person.profile_path, 'w500')}
                      alt={person.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-medium">{person.name}</h3>
                  <p className="text-sm text-white/70">{person.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Similar Shows */}
        {show.similar?.results?.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-6">More Like This</h2>
            <MovieCarousel movies={show.similar.results.map(transformShow)} />
          </section>
        )}
      </div>
    </main>
  );
}
