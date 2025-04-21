'use client';

import React, { useEffect, useRef, useState } from 'react';
import shaka from 'shaka-player';

interface ShakaPlayerProps {
  url: string;
}

const ShakaPlayer: React.FC<ShakaPlayerProps> = ({ url }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [player, setPlayer] = useState<shaka.Player | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check browser support
    if (!shaka.Player.isBrowserSupported()) {
      setError('Your browser is not supported for video playback');
      setIsLoading(false);
      return;
    }

    const initPlayer = async () => {
      try {
        // Install polyfills if needed
        shaka.polyfill.installAll();

        // Create a new player instance
        const shakaPlayer = new shaka.Player(videoRef.current!);
        setPlayer(shakaPlayer);

        // Listen for errors
        shakaPlayer.addEventListener('error', (event: { detail: { message: any; }; }) => {
          setError(`Error: ${event.detail.message}`);
        });

        // Configure player
        shakaPlayer.configure({
          streaming: {
            bufferingGoal: 60, // Buffer up to 60 seconds
            rebufferingGoal: 2, // Start playback when we have 2 seconds buffered
          },
          abr: {
            enabled: true, // Enable adaptive bitrate streaming
          },
        });

        // Load content
        await shakaPlayer.load(url);
        setIsLoading(false);

        // Auto play (optional, you might want to use a play button instead)
        try {
          await videoRef.current?.play();
        } catch (e) {
          console.log('Auto-play was prevented. User interaction is required to play the video.');
        }
      } catch (error) {
        console.error('Error initializing player:', error);
        setError('Failed to initialize video player');
        setIsLoading(false);
      }
    };

    initPlayer();

    // Cleanup function
    return () => {
      if (player) {
        player.destroy();
        setPlayer(null);
      }
    };
  }, [url]);

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white">Loading video...</div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white bg-red-900/70 p-4 rounded max-w-md">
            {error}
          </div>
        </div>
      )}
      
      <video 
        ref={videoRef}
        className="w-full h-full"
        controls
        controlsList="nodownload"
        playsInline
      />
    </div>
  );
};

export default ShakaPlayer;