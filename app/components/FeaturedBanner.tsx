// app/components/FeaturedBanner.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Info } from 'lucide-react'

interface Movie {
  id: string
  title: string
  description: string
  backdropUrl: string
  year: number
  rating: string
  duration: string
}

interface FeaturedBannerProps {
  movie: Movie
  type?: 'movie' | 'show'
}

export default function FeaturedBanner({
  movie,
  type = 'movie',
}: FeaturedBannerProps) {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Backdrop */}
      <Image
        src={movie.backdropUrl}
        alt={movie.title}
        fill
        className="object-cover"
        priority
      />

      {/* Cinematic Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"/>
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"/>

      {/* Content at bottom‐left */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-24">
        <div className="max-w-xl">
          <span className="inline-block mb-4 px-3 py-1 text-sm font-medium bg-white/10 rounded-full text-white">
            New {type === 'show' ? 'Show' : 'Movie'}
          </span>

          <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6 leading-tight">
            {movie.title}
          </h1>

          <p className="text-lg text-white/80 mb-8 line-clamp-3">
            {movie.description}
          </p>

          <Link
            href={`/${type}/${movie.id}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-md hover:bg-gray-100 transition"
          >
            <Info className="w-5 h-5" />
            More Info
          </Link>
        </div>
      </div>
    </div>
  )
}
