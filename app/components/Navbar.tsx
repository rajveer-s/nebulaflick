// app/search/page.tsx  (or wherever your SearchPage lives)

import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { tmdb } from '@/app/utils/tmdb'
import { getPrimaryGenre } from '@/app/utils/genres'
import LoadingSpinner from '@/app/components/LoadingSpinner'

async function searchMovies(query: string) {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=59e5d9cd55843accffd306e516fb393f&query=${encodeURIComponent(
      query
    )}&language=en-US`
  )
  const data = await response.json()
  return data.results
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const query = searchParams.q ?? ''
  const movies = query ? await searchMovies(query) : []

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-nebula-950 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ─── Search Bar ─────────────────────────────── */}
        <form
          action="/search"
          method="GET"
          className="mb-6 bg-white/5 rounded-full p-2 flex items-center"
        >
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search for movies..."
            className="w-full sm:w-1/2 px-4 py-3 rounded-full bg-neutral-800 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          />
        </form>

        {/* ─── Page Title ─────────────────────────────── */}
        <h1 className="text-3xl font-bold mb-8">
          {query
            ? `Search results for "${query}"`
            : 'Search Movies'}
        </h1>

        <Suspense fallback={<LoadingSpinner />}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((movie: any) => (
              <Link
                key={movie.id}
                href={`/movie/${movie.id}`}
                className="group"
              >
                <div className="aspect-[2/3] relative rounded-lg overflow-hidden mb-4">
                  <Image
                    src={tmdb.getImageUrl(movie.poster_path, 'w500')}
                    alt={movie.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm">
                          {tmdb.formatRating(movie.vote_average)}
                        </span>
                      </div>
                      <p className="text-sm text-white/70">
                        {getPrimaryGenre(movie.genre_ids)}
                      </p>
                    </div>
                  </div>
                </div>
                <h2 className="font-semibold truncate">{movie.title}</h2>
                <p className="text-sm text-white/70">
                  {tmdb.formatYear(movie.release_date)}
                </p>
              </Link>
            ))}
          </div>

          {query && movies.length === 0 && (
            <p className="text-center text-white/70 mt-12">
              No movies found for "{query}"
            </p>
          )}
        </Suspense>
      </div>
    </main>
  )
}
