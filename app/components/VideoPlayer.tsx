'use client';

import { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import type Player from 'video.js/dist/types/player';
import '@videojs/http-streaming';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoplay?: boolean;
  controls?: boolean;
  className?: string;
  onReady?: (player: Player) => void;
}

export default function VideoPlayer({
  src,
  poster,
  autoplay = false,
  controls = true,
  className = '',
  onReady
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    // Clean up previous player instance
    if (playerRef.current) {
      playerRef.current.dispose();
      playerRef.current = null;
    }

    if (!videoRef.current) return;

    // Clear any existing content
    videoRef.current.innerHTML = '';

    // Create a basic video element first
    const videoElement = document.createElement('video');
    videoElement.className = 'video-js vjs-theme-nebula vjs-big-play-centered vjs-fill';
    videoElement.controls = controls;
    videoElement.preload = 'auto';
    videoRef.current.appendChild(videoElement);

    // Determine video type based on file extension or URL patterns
    let sourceType = 'video/mp4';
    if (src.includes('.m3u8') || src.includes('playlist.m3u8')) {
      sourceType = 'application/x-mpegURL';
    } else if (src.includes('.webm')) {
      sourceType = 'video/webm';
    } else if (src.includes('.ogg') || src.includes('.ogv')) {
      sourceType = 'video/ogg';
    } else if (src.includes('blob:') || src.includes('data:')) {
      // For blob URLs, the safest approach is to use an auto-detecting type
      sourceType = 'video/mp4';
    }

    // Basic videojs options
    const videoJsOptions = {
      controls,
      autoplay,
      preload: 'auto',
      fluid: false, // We'll handle sizing manually
      fill: true,
      poster,
      sources: [{ 
        src, 
        type: sourceType 
      }],
      html5: {
        vhs: {
          overrideNative: true,
          useDevicePixelRatio: true,
          limitRenditionByPlayerDimensions: false
        },
        nativeAudioTracks: false,
        nativeVideoTracks: false
      },
      playbackRates: [0.5, 1, 1.5, 2],
      inactivityTimeout: 3000, // Hide controls after 3 seconds of inactivity
      liveui: true,  // Better UI for live streams
      responsive: false // We'll manage this manually
    };

    // Initialize the player
    try {
      const player = videojs(videoElement, videoJsOptions);
      playerRef.current = player;
      
      player.on('ready', () => {
        console.log('Player is ready');
        
        // Ensure player fills the container properly
        player.addClass('vjs-fill');
        
        // Make sure control bar is always visible initially
        const controlBar = player.getChild('ControlBar');
        if (controlBar) {
          controlBar.addClass('vjs-control-bar-fixed');
        }
        
        // Callback for parent component
        if (onReady) {
          onReady(player);
        }
      });

      // Handle player errors
      player.on('error', function() {
        const error = player.error();
        console.error('VideoJS Error:', error?.code, error?.message);
        
        // If source not supported (code 4), try alternate format
        if (error?.code === 4) {
          console.log('Media format not supported, trying alternate format...');
          
          // If we initially tried HLS, try MP4
          if (sourceType === 'application/x-mpegURL') {
            console.log('Switching from HLS to MP4');
            player.src({ src, type: 'video/mp4' });
            player.load();
          } 
          // If we tried MP4, try webm
          else if (sourceType === 'video/mp4') {
            console.log('Switching from MP4 to webm');
            player.src({ src, type: 'video/webm' });
            player.load();
          }
        }
      });

      // Prevent memory leaks by removing all event listeners when component unmounts
      return () => {
        if (playerRef.current) {
          playerRef.current.dispose();
          playerRef.current = null;
        }
      };
    } catch (error) {
      console.error('Error initializing video player:', error);
      return () => {
        // Still clean up even if initialization failed
        if (playerRef.current) {
          playerRef.current.dispose();
          playerRef.current = null;
        }
      };
    }
  }, [src, poster, autoplay, controls, onReady]);

  return (
    <div data-vjs-player className={className}>
      <div ref={videoRef} className="w-full h-full" />
    </div>
  );
}