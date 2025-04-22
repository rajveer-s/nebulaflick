// app/components/FeaturedBanner.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Info } from 'lucide-react'
import { useEffect, useState } from 'react'

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
  movies: Movie[]
  type?: 'movie' | 'show'
}

export default function FeaturedBanner({
  movies,
  type = 'movie',
}: FeaturedBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Change slide every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % movies.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [movies.length])

  if (!movies.length) return null
  
  const movie = movies[currentSlide]

  return (
    <div className="relative w-full overflow-hidden h-[50vh] sm:h-[55vh] md:h-[65vh] lg:h-[85vh]">
      {/* Backdrop with smooth transition */}
      {movies.map((m, index) => (
        <div
          key={m.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={m.backdropUrl}
            alt={m.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
        </div>
      ))}

      {/* Cinematic Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"/>
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"/>

      {/* Content - centered on small screens, bottom-left on larger screens */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center sm:items-center md:items-end justify-center sm:justify-center md:justify-start pb-6 md:pb-16 lg:pb-24">
        <div className="max-w-xl text-center md:text-left">
          <span className="inline-block mb-2 sm:mb-4 px-3 py-1 text-sm font-medium bg-white/10 rounded-full text-white">
            New {type === 'show' ? 'Show' : 'Movie'}
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-3 sm:mb-6 leading-tight">
            {movie.title}
          </h1>

          <p className="text-base sm:text-lg text-white/80 mb-4 sm:mb-8">
            {movie.description}
          </p>

          <Link
            href={`/${type}/${movie.id}`}
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white text-black font-semibold rounded-md hover:bg-gray-100 transition"
          >
            <Info className="w-4 h-4 sm:w-5 sm:h-5" />
            More Info
          </Link>
        </div>
      </div>
    </div>
  )
}
