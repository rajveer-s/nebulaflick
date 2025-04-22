import Image from 'next/image';
import { X } from 'lucide-react';
import SeasonSelector from './SeasonSelector';

// Define interfaces to match the ones in SeasonSelector component
interface Episode {
  id: number;
  name: string;
  episode_number: number;
  overview: string;
  still_path: string;
  air_date: string;
}

interface Season {
  id: number;
  name: string;
  season_number: number;
  episodes: Episode[];
}

interface ShowData {
  id: number;
  name: string;
  backdrop_path: string;
  overview?: string;
}

interface WatchShowModalProps {
  show: ShowData;
  seasons: Season[];
  onEpisodeSelect: (seasonNumber: number, episodeNumber: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function WatchShowModal({
  show,
  seasons,
  onEpisodeSelect,
  isOpen,
  onClose,
}: WatchShowModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/95">
      {/* Background Image */}
      <div className="fixed inset-0 opacity-20">
        <Image
          src={`https://image.tmdb.org/t/p/original${show.backdrop_path}`}
          alt={show.name}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative min-h-screen">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 z-50 p-2 text-white hover:bg-white/10 rounded-full"
        >
          <X size={24} />
        </button>

        <div className="relative z-10 container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-white mb-4">{show.name}</h1>
          <div className="grid gap-8">
            <SeasonSelector
              seasons={seasons}
              onEpisodeSelect={(season, episode) => {
                onEpisodeSelect(season, episode);
                onClose();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}