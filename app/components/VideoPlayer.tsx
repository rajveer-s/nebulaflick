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
    if (!videoRef.current) return;

    // Initialize video.js player
    const videoElement = document.createElement('video-js');
    videoElement.classList.add('vjs-theme-nebula', 'vjs-big-play-centered');
    videoRef.current.appendChild(videoElement);

    const player = playerRef.current = videojs(videoElement, {
      controls,
      autoplay,
      poster,
      sources: [{ src, type: 'video/mp4' }],
      fluid: true,
      playbackRates: [0.5, 1, 1.5, 2],
      userActions: {
        hotkeys: true
      },
      html5: {
        vhs: {
          overrideNative: true
        }
      }
    });

    // Add quality selector if multiple sources
    if (typeof player.qualityLevels === 'function') {
      player.qualityLevels();
    }

    // Picture-in-Picture support
    if (player.controlBar) {
      player.controlBar.addChild('PictureInPictureToggle');
    }

    // Callback for parent component
    if (onReady) {
      onReady(player);
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src, poster, autoplay, controls, onReady]);

  return (
    <div data-vjs-player>
      <div ref={videoRef} className={className} />
    </div>
  );
} 