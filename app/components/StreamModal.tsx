'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Play, X, Loader2 } from 'lucide-react';
import type { TorrentioStream } from '../utils/torrentio';
import { torrentio } from '../utils/torrentio';

interface StreamModalProps {
  streams: TorrentioStream[];
  onClose: () => void;
  movieTitle?: string;
}

// Helper function to get the quality priority for sorting
const getQualityPriority = (quality: string): number => {
  if (quality.includes('4k') || quality.includes('2160') || quality.includes('uhd')) return 1;
  if (quality.includes('1080')) return 2;
  if (quality.includes('720')) return 3;
  if (quality.includes('480')) return 4;
  if (quality.includes('360')) return 5;
  return 6; // Other or unknown quality
};

export default function StreamModal({ streams, onClose, movieTitle = 'Movie' }: StreamModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  // Sort streams by quality
  const sortedStreams = [...streams].sort((a, b) => {
    const infoA = torrentio.extractStreamInfo(a.name);
    const infoB = torrentio.extractStreamInfo(b.name);
    return getQualityPriority(infoA.quality.toLowerCase()) - getQualityPriority(infoB.quality.toLowerCase());
  });

  const handleStreamSelect = async (stream: TorrentioStream) => {
    try {
      setIsLoading(stream.url);
      router.push(`/watch?url=${encodeURIComponent(stream.url)}`);
    } catch (error) {
      console.error('Failed to start stream:', error);
      alert('Failed to start stream. Please try another source.');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-nebula-900/95 rounded-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-white/10 flex flex-col">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Available Streams</h2>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-4 overflow-y-auto flex-1">
          <div className="space-y-3">
            {sortedStreams.map((stream) => {
              const info = torrentio.extractStreamInfo(stream.name);
              return (
                <div
                  key={stream.url}
                  className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-nebula-700 rounded text-sm font-medium">
                        {movieTitle} - {info.quality}
                      </span>
                      {info.source && (
                        <span className="px-2 py-0.5 bg-nebula-800 rounded text-sm">
                          {info.source}
                        </span>
                      )}
                      {info.size && (
                        <span className="text-sm text-white/70">
                          {info.size}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white/60 truncate">{info.filename}</p>
                  </div>
                  <button
                    onClick={() => handleStreamSelect(stream)}
                    disabled={!!isLoading}
                    className="ml-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition flex items-center gap-2 disabled:opacity-50"
                  >
                    {isLoading === stream.url ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}