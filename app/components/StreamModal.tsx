'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Play, X, Loader2 } from 'lucide-react';
import type { TorrentioStream } from '../utils/torrentio';
import { realDebrid } from '../utils/real-debrid';

interface StreamModalProps {
  streams: TorrentioStream[];
  onClose: () => void;
}

export default function StreamModal({ streams, onClose }: StreamModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleStreamSelect = async (stream: TorrentioStream) => {
    try {
      setIsLoading(stream.url);
      const { download_link } = await realDebrid.unrestrict(stream.url);
      router.push(`/watch?url=${encodeURIComponent(download_link)}`);
    } catch (error) {
      console.error('Failed to unrestrict stream:', error);
      alert('Failed to start stream. Please try another source.');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-nebula-900/95 rounded-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Available Streams</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto flex-1">
          <div className="space-y-3">
            {streams.map((stream) => {
              const info = realDebrid.extractStreamInfo(stream.name);
              return (
                <div
                  key={stream.url}
                  className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-nebula-700 rounded text-sm font-medium">
                        {info.quality}
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