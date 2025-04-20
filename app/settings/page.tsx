'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, AlertCircle } from 'lucide-react';
import { realDebrid } from '../utils/real-debrid';
import Navbar from '../components/Navbar';

export default function SettingsPage() {
  const [rdToken, setRdToken] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const token = realDebrid.getToken();
    if (token) setRdToken(token);
  }, []);

  const handleSave = () => {
    if (rdToken.trim()) {
      realDebrid.setToken(rdToken.trim());
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-nebula-950 to-black">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Settings className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        <div className="bg-white/5 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6">Real-Debrid Integration</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="rd-token" className="block text-sm font-medium text-white/70 mb-2">
                Real-Debrid API Token
              </label>
              <input
                id="rd-token"
                type="password"
                value={rdToken}
                onChange={(e) => setRdToken(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-nebula-600 focus:border-transparent"
                placeholder="Enter your Real-Debrid API token"
              />
              <p className="mt-2 text-sm text-white/50">
                Get your token from{' '}
                <a 
                  href="https://real-debrid.com/apitoken"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-nebula-400 hover:text-nebula-300"
                >
                  real-debrid.com/apitoken
                </a>
              </p>
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
      </div>
    </main>
  );
}