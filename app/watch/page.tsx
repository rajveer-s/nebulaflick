'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';

export default function WatchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const videoUrl = searchParams.get('url');

  const handleBackClick = () => {
    router.back();
  };

  if (!videoUrl) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <p className="text-white/70">No video URL provided</p>
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
      
      <VideoPlayer
        src={videoUrl}
        autoplay={true}
        controls={true}
        className="fixed inset-0 w-full h-full"
      />
    </div>
  );
}