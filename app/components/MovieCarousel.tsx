'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Movie {
  id: string
  title: string
  posterUrl: string
  genre: string
}

interface MovieCarouselProps {
  movies: Movie[]
  type?: 'movie' | 'show'
}

export default function MovieCarousel({ movies, type = 'movie' }: MovieCarouselProps) {
  const scrollContainer = useRef<HTMLDivElement>(null)
  const [showLeftButton, setShowLeftButton] = useState(false)
  const [showRightButton, setShowRightButton] = useState(true)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainer.current) {
      const { scrollLeft, clientWidth } = scrollContainer.current
      const scrollTo = direction === 'left'
        ? scrollLeft - clientWidth
        : scrollLeft + clientWidth

      scrollContainer.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      })
    }
  }

  const checkScroll = () => {
    if (scrollContainer.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.current
      setShowLeftButton(scrollLeft > 0)
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    const container = scrollContainer.current
    if (container) {
      container.addEventListener('scroll', checkScroll)
      checkScroll()
    }
    return () => container?.removeEventListener('scroll', checkScroll)
  }, [])

  return (
    <div className="relative group">
      {/* Navigation Buttons */}
      {showLeftButton && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/75 p-2 rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
      )}

      {showRightButton && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/75 p-2 rounded-l-lg opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Movie Cards */}
      <div
        ref={scrollContainer}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onScroll={checkScroll}
      >
        {movies.map((movie, index) => (
          <Link
            key={movie.id}
            href={`/${type}/${movie.id}`}
            className="group/card relative aspect-[2/3] w-[200px] flex-shrink-0 rounded-xl overflow-hidden transition-transform duration-300 hover:scale-105 snap-start"
          >
            <Image
              src={movie.posterUrl}
              alt={movie.title}
              fill
              className="object-cover"
              loading={index < 4 ? "eager" : "lazy"}
              sizes="200px"
              quality={75}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-sm text-white/75 mb-1">{movie.genre}</p>
                <h3 className="text-base font-medium truncate">{movie.title}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
