'use client';

import Link from 'next/link';
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
    <div className="flex items-center justify-around h-16 px-4">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname.startsWith(href); // covers subpages
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center justify-center transition-colors h-10 px-4 rounded-full ${
              isActive ? 'bg-orange-500 text-white' : 'text-white/50 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Icon className="h-5 w-5" />
              {isActive && <span className="text-sm font-medium">{label}</span>}
            </div>
          </Link>
        );
      })}
    </div>
  </nav>
</>

  
  );
}