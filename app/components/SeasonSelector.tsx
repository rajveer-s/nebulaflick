import { useState } from 'react';
import { ChevronDown, Calendar } from 'lucide-react';

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

interface SeasonSelectorProps {
  seasons: Season[];
  onEpisodeSelect: (seasonNumber: number, episodeNumber: number) => void;
  onSeasonChange?: (seasonNumber: number) => void;
}

export default function SeasonSelector({ seasons, onEpisodeSelect, onSeasonChange }: SeasonSelectorProps) {
  const [selectedSeason, setSelectedSeason] = useState<number>(1);

  const currentSeason = seasons.find(s => s.season_number === selectedSeason);

  // Function to format date in a nice readable format
  const formatDate = (dateString: string) => {
    if (!dateString) return 'No air date';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSeasonChange = (seasonNumber: number) => {
    setSelectedSeason(seasonNumber);
    if (onSeasonChange) {
      onSeasonChange(seasonNumber);
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:gap-8">
      {/* Season selector - full width on mobile, fixed width on larger screens */}
      <div className="w-full md:w-48 mb-4 md:mb-0">
        <select
          value={selectedSeason}
          onChange={(e) => handleSeasonChange(Number(e.target.value))}
          className="w-full px-4 py-2 bg-black/40 text-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-nebula-600"
        >
          {seasons.map((season) => (
            <option key={season.id} value={season.season_number}>
              Season {season.season_number}
            </option>
          ))}
        </select>
      </div>

      {/* Episodes list - below on mobile, to the right on larger screens */}
      <div className="flex-1 max-h-[60vh] overflow-y-auto pr-0 md:pr-4 space-y-2">
        {currentSeason?.episodes.map((episode) => (
          <button
            key={episode.id}
            onClick={() => onEpisodeSelect(selectedSeason, episode.episode_number)}
            className="w-full p-4 bg-black/40 hover:bg-black/60 rounded-lg transition text-left group flex items-start justify-between"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <p className="font-medium text-lg">Episode {episode.episode_number}</p>
                <p className="text-base text-white/70 truncate flex-1">{episode.name}</p>
              </div>
              <div className="flex items-center gap-1 mb-1 text-white/60 text-sm">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(episode.air_date)}</span>
              </div>
              <p className="text-sm text-white/50 line-clamp-2">{episode.overview}</p>
            </div>
            <ChevronDown className="w-5 h-5 shrink-0 opacity-0 group-hover:opacity-100 transition ml-4" />
          </button>
        ))}
      </div>
    </div>
  );
}