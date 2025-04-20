'use client';

import { useState } from 'react';
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation';
import { Search, User } from 'lucide-react'

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const query = new FormData(form).get('query')?.toString();
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
      <div className="mx-auto flex h-20 max-w items-center justify-between px-7 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-6">
            <Link 
              href="/movies" 
              className={`text-sm font-medium transition-colors ${
                pathname === '/movies' ? 'text-orange-500' : 'text-white/75 hover:text-white'
              }`}
            >
              Movies
            </Link>
            <Link 
              href="/shows" 
              className={`text-sm font-medium transition-colors ${
                pathname === '/shows' ? 'text-orange-500' : 'text-white/75 hover:text-white'
              }`}
            >
              TV Shows
            </Link>
            <Link 
              href="/my-list" 
              className={`text-sm font-medium transition-colors ${
                pathname === '/my-list' ? 'text-orange-500' : 'text-white/75 hover:text-white'
              }`}
            >
              My List
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isSearchOpen ? (
            <form onSubmit={handleSearch} className="relative">
              <input
                type="search"
                name="query"
                placeholder="Search movies..."
                className="w-64 px-4 py-2 bg-white/10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-nebula-500"
                autoFocus
                onBlur={() => setIsSearchOpen(false)}
              />
            </form>
          ) : (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:bg-white/10 rounded-full"
            >
              <Search className="h-5 w-5" />
            </button>
          )}
          <button className="p-2 hover:bg-white/10 rounded-full">
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  )
} 