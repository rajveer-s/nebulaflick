'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Film, Tv, Search, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/movies', label: 'Movies', icon: Film },
    { href: '/shows', label: 'TV Shows', icon: Tv },
    { href: '/search', label: 'Search', icon: Search },
    { href: '/settings', label: 'Profile', icon: User },
  ];

  return (
    <>   
      <div className="h-20" /> {/* Bottom spacer */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[80%] sm:w-[60%] bg-neutral-900/90 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname.startsWith(href); // covers subpages
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center justify-center transition-colors py-2 px-2 rounded-lg ${
                  isActive ? 'bg-orange-500 text-white' : 'text-white/50 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className={`text-[clamp(0.65rem,1vw,0.75rem)] font-medium text-center leading-tight ${
                  isActive ? '' : 'opacity-80'
                }`}>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}