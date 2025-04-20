export interface TorrentioStream {
  name: string;
  type: string;
  title: string;
  url: string;
  behaviorHints: {
    bingeGroup: string;
  };
}

interface TorrentioResponse {
  streams: TorrentioStream[];
}

const TORRENTIO_BASE = 'https://torrentio.strem.fun';

export const torrentio = {
  getStreams: async (type: 'movie' | 'show', imdbId: string, rdToken?: string) => {
    const url = `${TORRENTIO_BASE}/stream/${type}/${imdbId}.json${rdToken ? `?rd=${rdToken}` : ''}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch Torrentio streams');
    const data = await response.json() as TorrentioResponse;
    return data.streams;
  },

  extractMagnetHash: (url: string) => {
    // Extract hash from magnet link or direct hash
    const magnetMatch = url.match(/(?:magnet:\?xt=urn:btih:|^)([a-zA-Z0-9]{32,40})/i);
    return magnetMatch?.[1]?.toLowerCase() || null;
  },

  filterCachedStreams: async (streams: TorrentioStream[], rdToken: string) => {
    // Extract all unique hashes from the streams
    const hashes = streams
      .map(stream => torrentio.extractMagnetHash(stream.url))
      .filter((hash): hash is string => !!hash);

    // Check which ones are cached on RD
    const { realDebrid } = await import('./real-debrid');
    const availability = await realDebrid.checkInstantAvailability(hashes);

    // Filter streams that are cached
    return streams.filter(stream => {
      const hash = torrentio.extractMagnetHash(stream.url);
      return hash && availability[hash] && Object.keys(availability[hash]).length > 0;
    });
  }
};