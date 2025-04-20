import Image from 'next/image'
import { Play, Info } from 'lucide-react'

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
}

export default function FeaturedBanner({ movie }: FeaturedBannerProps) {
  return (
    <div className="relative h-[85vh] w-full">
      {/* Backdrop Image */}
      <div className="absolute inset-0">
        <Image
          src={movie.backdropUrl}
          alt={movie.title}
          fill
          className="object-cover"
          priority
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-full items-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-6xl font-bold mb-4">{movie.title}</h1>
            <div className="flex items-center gap-4 text-sm mb-4">
              <span>{movie.year}</span>
              <span className="px-2 py-1 border border-white/20 rounded">
                {movie.rating}
              </span>
              <span>{movie.duration}</span>
            </div>
            <p className="text-lg text-white/90 mb-8">{movie.description}</p>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-8 py-3 bg-nebula-600 hover:bg-nebula-700 rounded-lg font-semibold transition">
                <Play className="h-5 w-5" />
                Play
              </button>
              <button className="flex items-center gap-2 px-8 py-3 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition">
                <Info className="h-5 w-5" />
                More Info
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 