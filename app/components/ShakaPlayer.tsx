'use client';

import React, { useEffect, useRef, useState } from 'react';
import shaka from 'shaka-player';

interface ShakaPlayerProps {
  url: string;
}

// Define type for shaka error event
interface ShakaErrorEvent {
  detail: {
    message: string;
    code?: number;
  };
}

const ShakaPlayer: React.FC<ShakaPlayerProps> = ({ url }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<shaka.Player | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [useNativePlayer, setUseNativePlayer] = useState(false);

  // Use a different approach for initial navigation vs. refresh
  useEffect(() => {
    let mounted = true;
    
    // Always try native player first for better initial load
    if (videoRef.current && mounted) {
      try {
        videoRef.current.src = url;
        videoRef.current.load();
        videoRef.current.play()
          .then(() => {
            if (mounted) {
              setIsLoading(false);
              setUseNativePlayer(true);
            }
          })
          .catch((e) => {
            console.log('Native player failed, falling back to Shaka:', e);
            // If native player fails, try Shaka
            if (mounted && !useNativePlayer) {
              initShakaPlayer();
            }
          });
      } catch (e) {
        console.log('Error using native player, falling back to Shaka:', e);
        if (mounted && !useNativePlayer) {
          initShakaPlayer();
        }
      }
    } else {
      // If video element isn't ready, wait a bit and retry
      const timer = setTimeout(() => {
        if (mounted && !useNativePlayer) {
          initShakaPlayer();
        }
      }, 100);
      return () => clearTimeout(timer);
    }

    function initShakaPlayer() {
      // Clear any src attribute set by the native player attempt
      if (videoRef.current) {
        videoRef.current.removeAttribute('src');
        videoRef.current.load();
      }

      // Check browser support
      if (!shaka.Player.isBrowserSupported()) {
        setError('Your browser is not supported for video playback');
        setIsLoading(false);
        return;
      }

      const initPlayer = async (retryCount = 0) => {
        try {
          // If there's an existing player, destroy it first
          if (playerRef.current) {
            playerRef.current.destroy();
            playerRef.current = null;
          }

          if (!videoRef.current) {
            console.log('Video element not available yet, will retry');
            if (retryCount < 3 && mounted) {
              // Wait a bit and retry
              setTimeout(() => initPlayer(retryCount + 1), 500);
            }
            return;
          }

          // Install polyfills if needed
          shaka.polyfill.installAll();

          // Create a new player instance
          const shakaPlayer = new shaka.Player(videoRef.current);
          playerRef.current = shakaPlayer;

          // Listen for errors
          shakaPlayer.addEventListener('error', (event: ShakaErrorEvent) => {
            // Only set UI error for actual playback errors, not initialization warnings
            if (event.detail.message && event.detail.message !== '{}' && mounted) {
              setError(`Error: ${event.detail.message}`);
            }
          });

          // Configure player
          shakaPlayer.configure({
            streaming: {
              bufferingGoal: 60, // Buffer up to 60 seconds
              rebufferingGoal: 2, // Start playback when we have 2 seconds buffered
              retryParameters: {
                maxAttempts: 5, // Increase retry attempts
                baseDelay: 1000, // Start with 1s delay between retries
                backoffFactor: 2, // Double the delay with each retry
              }
            },
            abr: {
              enabled: true, // Enable adaptive bitrate streaming
            },
          });

          // Load content
          await shakaPlayer.load(url);
          if (mounted) {
            setIsLoading(false);
          }

          // Auto play
          if (videoRef.current && mounted) {
            try {
              await videoRef.current.play();
            } catch (playError) {
              console.log('Auto-play was prevented. User interaction is required to play the video.');
            }
          }
        } catch (error) {
          const errorString = JSON.stringify(error);
          
          // Check if the error is an empty object (which seems to be non-fatal)
          const isEmptyError = errorString === '{}' || Object.keys(error as object).length === 0;
          
          if (isEmptyError) {
            console.log('Non-fatal initialization warning occurred, falling back to native player');
            if (mounted) {
              setUseNativePlayer(true);
              setIsLoading(false);
              
              // Try to play using native player as fallback
              if (videoRef.current) {
                videoRef.current.src = url;
                videoRef.current.load();
                videoRef.current.play().catch(e => {
                  console.log('Manual play attempt after empty error:', e);
                });
              }
            }
          } else if (retryCount < 2 && mounted) {
            // For other errors, retry a couple of times before giving up
            console.log(`Retrying player initialization (attempt ${retryCount + 1})...`);
            setTimeout(() => initPlayer(retryCount + 1), 1000);
          } else if (mounted) {
            console.error('Error initializing player after multiple attempts:', error);
            // Last resort: try native player
            setUseNativePlayer(true);
            if (videoRef.current) {
              videoRef.current.src = url;
              videoRef.current.load();
              videoRef.current.play().catch(() => {
                setError('Failed to initialize video player');
              });
            } else {
              setError('Failed to initialize video player');
            }
            setIsLoading(false);
          }
        }
      };

      // Start initialization
      initPlayer(0);
    }

    return () => {
      mounted = false;
      // Cleanup function
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [url, useNativePlayer]);

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
            <div className="mt-4 text-center">
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded"
              >
                Refresh Page
              </button>
            </div>
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