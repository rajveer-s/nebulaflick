'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef, useEffect, useState } from 'react'

interface Movie {
  id: string
  title: string
  posterUrl: string
  genre: string
}

interface MovieCarouselProps {
  movies: Movie[]
  type?: 'movie' | 'show'  // New prop to determine the link type
}

export default function MovieCarousel({ movies, type = 'movie' }: MovieCarouselProps) {
  const scrollContainer = useRef<HTMLDivElement>(null)
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 8 })

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'))
            setVisibleRange(prev => ({
              start: Math.max(0, index - 4),
              end: Math.min(movies.length, index + 4)
            }))
          }
        })
      },
      { threshold: 0.1, root: scrollContainer.current }
    )

    const container = scrollContainer.current
    if (container) {
      Array.from(container.children).forEach((child, index) => {
        observer.observe(child)
        child.setAttribute('data-index', index.toString())
      })
    }

    return () => observer.disconnect()
  }, [movies.length])

  return (
    <div className="relative group">
      {/* Navigation Buttons */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/75 p-2 rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/75 p-2 rounded-l-lg opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Movie Cards */}
      <div
        ref={scrollContainer}
        className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {movies.map((movie, index) => (
          <Link
            key={movie.id}
            href={`/${type}/${movie.id}`}
            className="group relative aspect-[2/3] w-[240px] flex-shrink-0 rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 snap-start"
          >
            <Image
              src={movie.posterUrl}
              alt={movie.title}
              fill
              className="object-cover"
              loading={index < 4 ? "eager" : "lazy"}
              sizes="240px"
              quality={75}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-lg font-semibold truncate">{movie.title}</h3>
                <p className="text-sm text-white/75">{movie.genre}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
