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
      <div className="h-16" /> {/* Bottom spacer */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-t border-white/10">
        <div className="flex items-center justify-around h-16 px-4 max-w-lg mx-auto">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                pathname === href ? 'text-orange-500' : 'text-white/75 hover:text-white'
              }`}
            >
              <Icon className="h-6 w-6 mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}