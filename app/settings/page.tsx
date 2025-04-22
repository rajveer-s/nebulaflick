'use client';

import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, AlertCircle, ExternalLink, Settings2 } from 'lucide-react';
import { torrentio } from '../utils/torrentio';

export default function SettingsPage() {
  const [torrentioUrl, setTorrentioUrl] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const url = torrentio.getConfiguredUrl();
    if (url) setTorrentioUrl(url);
  }, []);

  const handleSave = async () => {
    try {
      setError('');
      if (!torrentioUrl.trim()) {
        setError('Please enter your configured Torrentio URL');
        return;
      }

      // Simple URL validation
      try {
        new URL(torrentioUrl);
      } catch {
        setError('Please enter a valid URL');
        return;
      }

      torrentio.setConfiguredUrl(torrentioUrl.trim());
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError('Failed to save settings');
      console.error('Error saving settings:', err);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-nebula-950 to-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-8">
          <SettingsIcon className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        <div className="bg-white/5 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6">Torrentio Configuration</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="torrentio-url" className="block text-sm font-medium text-white/70 mb-2">
                Configured Torrentio URL
              </label>
              <input
                id="torrentio-url"
                type="text"
                value={torrentioUrl}
                onChange={(e) => setTorrentioUrl(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-nebula-600 focus:border-transparent"
                placeholder="Enter your configured Torrentio URL"
              />
              <div className="mt-2 flex items-center justify-between">
                <p className="text-sm text-white/50">
                  Configure your URL at{' '}
                  <a 
                    href="https://torrentio.strem.fun/configure"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-nebula-400 hover:text-nebula-300 inline-flex items-center gap-1"
                  >
                    torrentio.strem.fun/configure
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
                {error && (
                  <p className="text-red-400 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-4">
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-sm font-medium text-white/90 flex items-center gap-2 mb-3">
                  <Settings2 className="w-4 h-4" />
                  Configuration Steps
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-white/70">
                  <li>Visit the Torrentio configuration page</li>
                  <li>Select your preferred providers and settings</li>
                  <li>Click &quot;Install&quot; and copy the generated URL</li>
                  <li>Paste the URL here and save</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center gap-4">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-nebula-600 hover:bg-nebula-700 rounded-lg transition"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>

            {saved && (
              <span className="text-green-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Settings saved successfully
              </span>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}