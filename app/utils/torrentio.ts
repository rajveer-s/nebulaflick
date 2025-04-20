export interface TorrentioStream {
  name: string;
  title: string;
  url: string;
}

interface TorrentioResponse {
  streams: TorrentioStream[];
}

interface TorrentioOptions {
  season?: number;
  episode?: number;
}

// The base URL will be configurable through settings
const TORRENTIO_DEFAULT = 'https://torrentio.strem.fun';

export const torrentio = {
  getConfiguredUrl: () => {
    if (typeof window === 'undefined') return TORRENTIO_DEFAULT;
    const url = localStorage.getItem('torrentio_url') || TORRENTIO_DEFAULT;
    // Convert stremio:// to https:// and remove /manifest.json if present
    return url.replace('stremio://', 'https://').replace('/manifest.json', '');
  },

  setConfiguredUrl: (url: string) => {
    if (typeof window === 'undefined') return;
    // Store the URL as-is, we'll clean it when retrieving
    localStorage.setItem('torrentio_url', url);
  },

  getStreams: async (type: 'movie' | 'show', imdbId: string, options?: TorrentioOptions): Promise<TorrentioStream[]> => {
    try {
      if (!imdbId) {
        throw new Error('No IMDb ID provided');
      }

      // For TV shows, append season and episode to the IMDb ID
      let id = imdbId;
      if (type === 'show' && options?.season && options?.episode) {
        id = `${imdbId}:${options.season}:${options.episode}`;
      }

      // Get the configured URL and ensure it's properly formatted
      const baseUrl = torrentio.getConfiguredUrl();
      const url = `${baseUrl}/stream/${type}/${id}.json`;
      
      console.log('Fetching Torrentio streams from:', url);
      
      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Torrentio API error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Failed to fetch Torrentio streams: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as TorrentioResponse;
      console.log(`Found ${data.streams?.length || 0} streams from Torrentio`);

      // Sort streams by quality (assuming quality is in the name)
      const sortedStreams = (data.streams || []).sort((a, b) => {
        const getQualityScore = (name: string) => {
          if (name.includes('2160p')) return 4;
          if (name.includes('1080p')) return 3;
          if (name.includes('720p')) return 2;
          if (name.includes('480p')) return 1;
          return 0;
        };
        return getQualityScore(b.name) - getQualityScore(a.name);
      });

      // Log sample stream for debugging
      if (sortedStreams[0]) {
        console.log('Sample stream:', {
          name: sortedStreams[0].name,
          url: sortedStreams[0].url
        });
      }

      return sortedStreams;
    } catch (error) {
      console.error('Error in getStreams:', error);
      throw error;
    }
  },

  extractStreamInfo: (name: string) => {
    try {
      if (!name) return { quality: 'Unknown', size: '', source: '', filename: '' };
      
      const qualityMatch = name.match(/\b(4K|2160p|1080p|720p|480p)\b/i);
      const sizeMatch = name.match(/\b\d+(\.\d+)?\s*(GB|MB)\b/i);
      const sourceMatch = name.match(/\b(WEB-DL|BluRay|HDRip|BRRip|DVDRip)\b/i);
      
      return {
        quality: qualityMatch ? qualityMatch[0] : '720p',
        size: sizeMatch ? sizeMatch[0] : null,
        source: sourceMatch ? sourceMatch[0] : null,
        filename: name
      };
    } catch (error) {
      console.error('Error extracting stream info:', error);
      return { quality: 'Unknown', size: '', source: '', filename: name };
    }
  }
};