import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

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
}

export default function SeasonSelector({ seasons, onEpisodeSelect }: SeasonSelectorProps) {
  const [selectedSeason, setSelectedSeason] = useState<number>(1);

  const currentSeason = seasons.find(s => s.season_number === selectedSeason);

  return (
    <div className="flex gap-8">
      {/* Season selector on the left */}
      <div className="w-48">
        <select
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(Number(e.target.value))}
          className="w-full px-4 py-2 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-nebula-600"
        >
          {seasons.map((season) => (
            <option key={season.id} value={season.season_number}>
              Season {season.season_number}
            </option>
          ))}
        </select>
      </div>

      {/* Episodes list on the right */}
      <div className="flex-1 max-h-[60vh] overflow-y-auto pr-4 space-y-2">
        {currentSeason?.episodes.map((episode) => (
          <button
            key={episode.id}
            onClick={() => onEpisodeSelect(selectedSeason, episode.episode_number)}
            className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-lg transition text-left group flex items-start justify-between"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <p className="font-medium">Episode {episode.episode_number}</p>
                <p className="text-sm text-white/70 truncate flex-1">{episode.name}</p>
              </div>
              <p className="text-xs text-white/50 line-clamp-2">{episode.overview}</p>
            </div>
            <ChevronDown className="w-5 h-5 shrink-0 opacity-0 group-hover:opacity-100 transition ml-4" />
          </button>
        ))}
      </div>
    </div>
  );
}