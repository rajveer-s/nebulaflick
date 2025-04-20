'use client';

import { useSearchParams } from 'next/navigation';
import VideoPlayer from '../components/VideoPlayer';

export default function WatchPage() {
  const searchParams = useSearchParams();
  const videoUrl = searchParams.get('url');

  if (!videoUrl) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/70">No video URL provided</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-screen-2xl mx-auto aspect-video">
        <VideoPlayer
          src={videoUrl}
          autoplay={true}
          controls={true}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}