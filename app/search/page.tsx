'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'
import LoadingSpinner from '@/app/components/LoadingSpinner'
import { tmdb } from '@/app/utils/tmdb'
import { getPrimaryGenre } from '@/app/utils/genres'

export default function SearchPage() {
  const router = useRouter()
  const params = useSearchParams()

  // read initial q from URL
  const initialQ = params.get('q') ?? ''
  // read initial type flags from URL (we’ll encode type as "movies", "shows", or "both")
  const initialType = params.get('type') ?? 'both'

  // local state
  const [q, setQ] = useState(initialQ)
  const [selMovies, setSelMovies] = useState(
    initialType == 'shows'  // true if "movies" or "both"
  )
  const [selShows,  setSelShows]  = useState(
    initialType == 'movies'  // true if "shows" or "both"
  )
  const [movies,  setMovies]  = useState<any[]>([])
  const [shows,   setShows]   = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // derive typeParam for URL and fetch logic
  const typeParam =
    selMovies && !selShows ? 'movies'
    : selShows  && !selMovies ? 'shows'
    : 'both'   // covers both or none

  // fetch once at mount & whenever q or your toggles change
  useEffect(() => {
    if (!q.trim()) {
      setMovies([])
      setShows([])
      return
    }
    setLoading(true)

    // movie search when selMovies or both
    if (selMovies || (!selMovies && !selShows)) {
      fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=59e5d9cd55843accffd306e516fb393f&query=${encodeURIComponent(
          q
        )}&language=en-US`
      )
        .then(r => r.json())
        .then(d => setMovies(d.results || []))
    } else {
      setMovies([])
    }

    // tv search when selShows or both
    if (selShows || (!selMovies && !selShows)) {
      fetch(
        `https://api.themoviedb.org/3/search/tv?api_key=59e5d9cd55843accffd306e516fb393f&query=${encodeURIComponent(
          q
        )}&language=en-US`
      )
        .then(r => r.json())
        .then(d => setShows(d.results || []))
    } else {
      setShows([])
    }

    setLoading(false)
  }, [q, selMovies, selShows])

  // handle form submit by updating URL (back/forward friendly)
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const base = `/search?q=${encodeURIComponent(q)}`
    router.push(`${base}&type=${typeParam}`)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-nebula-950 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Heading */}
        <h1 className="text-3xl font-bold mb-4 text-white">
          {q ? `Search results for "${q}"` : 'Search Movies & TV Shows'}
        </h1>

        {/* ── Search Bar with Filter Tags ────────────────────────────── */}
        <form onSubmit={onSubmit} className="mb-3">
          <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full overflow-hidden">
            {/* tag for Movies */}
            {selMovies && (
              <span className="flex items-center bg-white text-black rounded-full px-3 py-1 text-sm mr-2">
                Movies
                <button
                  type="button"
                  onClick={() => setSelMovies(false)}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </span>
            )}
            {/* tag for TV Shows */}
            {selShows && (
              <span className="flex items-center bg-white text-black rounded-full px-3 py-1 text-sm mr-2">
                TV Shows
                <button
                  type="button"
                  onClick={() => setSelShows(false)}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </span>
            )}
            <input
              type="text"
              name="q"
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search Movies & TV Shows"
              className="flex-1 px-6 py-3 bg-transparent text-black placeholder-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-black font-medium hover:bg-gray-100 transition"
            >
              Search Now
            </button>
          </div>
        </form>

        {/* ── Filter Toggle Buttons ──────────────────────────────────── */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setSelMovies(sm => !sm)}
            className={`px-4 py-1 rounded-full text-sm transition
              ${selMovies
                ? 'bg-white text-black'
                : 'bg-white/20 text-white hover:bg-white/30'}`}
          >
            Movies
          </button>
          <button
            onClick={() => setSelShows(ss => !ss)}
            className={`px-4 py-1 rounded-full text-sm transition
              ${selShows
                ? 'bg-white text-black'
                : 'bg-white/20 text-white hover:bg-white/30'}`}
          >
            TV Shows
          </button>
        </div>

        {/* ── Loading Spinner or Results ─────────────────────────────── */}
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {/* Movies Grid */}
            {(selMovies || (!selMovies && !selShows)) && (
              <section className="mb-12">
                {(!selShows && selMovies) && (
                  <h2 className="text-2xl font-semibold text-white mb-4">
                    Movies
                  </h2>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {movies.map(m => (
                    <Link key={m.id} href={`/movie/${m.id}`} className="group">
                      <div className="aspect-[2/3] relative rounded-lg overflow-hidden mb-4">
                        <Image
                          src={tmdb.getImageUrl(m.poster_path, 'w500')}
                          alt={m.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Star className="h-4 w-4 text-yellow-400" />
                              <span className="text-sm">
                                {tmdb.formatRating(m.vote_average)}
                              </span>
                            </div>
                            <p className="text-sm text-white/70">
                              {getPrimaryGenre(m.genre_ids)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <h3 className="font-semibold text-white truncate">
                        {m.title}
                      </h3>
                      <p className="text-sm text-white/70">
                        {m.release_date
                          ? tmdb.formatYear(m.release_date)
                          : '—'}
                      </p>
                    </Link>
                  ))}
                  {q && movies.length === 0 && (
                    <p className="text-center text-white/70 col-span-full">
                      No movies found for "{q}"
                    </p>
                  )}
                </div>
              </section>
            )}

            {/* TV Shows Grid */}
            {(selShows || (!selMovies && !selShows)) && (
              <section>
                {(selMovies && !selShows) && (
                  <h2 className="text-2xl font-semibold text-white mb-4">
                    TV Shows
                  </h2>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {shows.map(s => (
                    <Link key={s.id} href={`/show/${s.id}`} className="group">
                      <div className="aspect-[2/3] relative rounded-lg overflow-hidden mb-4">
                        <Image
                          src={tmdb.getImageUrl(s.poster_path, 'w500')}
                          alt={s.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Star className="h-4 w-4 text-yellow-400" />
                              <span className="text-sm">
                                {tmdb.formatRating(s.vote_average)}
                              </span>
                            </div>
                            <p className="text-sm text-white/70">
                              {getPrimaryGenre(s.genre_ids)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <h3 className="font-semibold text-white truncate">
                        {s.name}
                      </h3>
                      <p className="text-sm text-white/70">
                        {s.first_air_date
                          ? tmdb.formatYear(s.first_air_date)
                          : '—'}
                      </p>
                    </Link>
                  ))}
                  {q && shows.length === 0 && (
                    <p className="text-center text-white/70 col-span-full">
                      No TV shows found for "{q}"
                    </p>
                  )}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  )
}
