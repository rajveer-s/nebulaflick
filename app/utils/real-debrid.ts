const RD_API_BASE = 'https://api.real-debrid.com/rest/1.0';

interface RDCachedTorrent {
  filename: string;
  filesize: number;
  id: string;
  hash: string;
  quality?: string;
}

export const realDebrid = {
  getToken: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('rd_token') || process.env.NEXT_PUBLIC_RD_TOKEN || null;
  },

  setToken: (token: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('rd_token', token);
  },

  checkInstantAvailability: async (hashes: string[]) => {
    const token = realDebrid.getToken();
    if (!token) throw new Error('No Real-Debrid token found');

    const params = new URLSearchParams();
    hashes.forEach(hash => params.append('magnets[]', hash));

    const response = await fetch(`${RD_API_BASE}/torrents/instantAvailability?${params}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Failed to check Real-Debrid availability');
    return response.json();
  },

  unrestrict: async (link: string) => {
    const token = realDebrid.getToken();
    if (!token) throw new Error('No Real-Debrid token found');

    const response = await fetch(`${RD_API_BASE}/unrestrict/link`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `link=${encodeURIComponent(link)}`,
    });

    if (!response.ok) throw new Error('Failed to unrestrict link');
    return response.json();
  },

  extractStreamInfo: (filename: string) => {
    const quality = filename.match(/\b(2160p|1080p|720p|480p)\b/i)?.[0] || 'Unknown';
    const size = filename.match(/\b\d+(\.\d+)?\s*(GB|MB)\b/i)?.[0] || '';
    const source = filename.match(/\b(BluRay|WEB-DL|WEBRip|HDRip|DVDRip)\b/i)?.[0] || '';
    
    return {
      quality,
      size,
      source,
      filename
    };
  }
};