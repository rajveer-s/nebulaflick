'use client';

import { usePathname } from 'next/navigation';
import BottomNav from './BottomNav';

export default function BottomNavWrapper() {
  const pathname = usePathname();
  
  // Hide the bottom nav on the watch page
  if (pathname === '/watch' || pathname.startsWith('/watch?')) {
    return null;
  }
  
  return <BottomNav />;
}