import Image from 'next/image'
import Link from 'next/link'
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
  type?: 'movie' | 'show'
}

export default function FeaturedBanner({ movie, type = 'movie' }: FeaturedBannerProps) {
  return (
    <div className="relative h-[100vh] w-full">
      {/* Backdrop Image */}
      <div className="absolute inset-0">
        <Image
          src={movie.backdropUrl}
          alt={movie.title}
          fill
          className="object-cover"
          priority
          loading="eager"
          sizes="100vw"
          quality={75}
        />
        {/* Gradient Overlays for cinematic effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-full items-center">
          <div className="max-w-2xl">
            <div className="mb-4">
              <span className="text-sm font-medium px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full">
                New {type === 'show' ? 'Show' : 'Movie'}
              </span>
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold mb-6 leading-tight">{movie.title}</h1>
            <div className="flex items-center gap-4 text-sm mb-6">
              <span className="text-white/90">{movie.year}</span>
              <span className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded-lg text-white/90">
                {movie.rating}
              </span>
              <span className="text-white/90">{movie.duration}</span>
            </div>
            <p className="text-lg text-white/80 mb-8 line-clamp-3 leading-relaxed">{movie.description}</p>
            <div className="flex gap-4">
              <Link 
                href={`/${type}/${movie.id}`}
                className="flex items-center gap-2 px-8 py-3 bg-white/10 backdrop-blur-sm rounded-lg font-semibold transition hover:bg-white/20"
              >
                <Info className="h-5 w-5" />
                More Info
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
