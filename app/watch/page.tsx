'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Suspense, useEffect, useState } from 'react';
import ShakaPlayer from '../components/ShakaPlayer';
import LoadingSpinner from '../components/LoadingSpinner';

function WatchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  // Use useEffect to handle URL extraction to ensure it's available after navigation
  useEffect(() => {
    // Get the URL from search params and decode it if needed
    const urlParam = searchParams.get('url');
    if (urlParam) {
      try {
        // Some URLs might be double-encoded, so we'll try to decode
        const decodedUrl = decodeURIComponent(urlParam);
        setVideoUrl(decodedUrl);
      } catch (e) {
        // If decoding fails, use the URL as-is
        setVideoUrl(urlParam);
      }
    }
  }, [searchParams]);

  const handleBackClick = () => {
    router.back();
  };

  if (!videoUrl) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <p className="text-white/70">Loading video URL...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Back button */}
      <div className="absolute top-4 left-4 z-50">
        <button 
          onClick={handleBackClick}
          className="p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
      </div>
      
      <div className="fixed inset-0 w-full h-full">
        <ShakaPlayer url={videoUrl} />
      </div>
    </div>
  );
}

export default function WatchPage() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <LoadingSpinner />
      </div>
    }>
      <WatchContent />
    </Suspense>
  );
}


// add stuff
