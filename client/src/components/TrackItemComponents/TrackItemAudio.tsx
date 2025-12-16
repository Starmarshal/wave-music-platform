'use client';

import React, {useEffect, useRef} from 'react';
import {staticUrl} from '@/src/shared/config';

type TrackItemAudioProps = {
  audioUrl: string;
  isCurrentTrack: boolean;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  onTimeUpdate?: (time: number) => void;
  onLoadedMetadata?: (duration: number) => void;
  onEnded?: () => void;
};

export default function TrackItemAudio({
                                         audioUrl,
                                         isCurrentTrack,
                                         isPlaying,
                                         volume,
                                         currentTime,
                                         onTimeUpdate,
                                         onLoadedMetadata,
                                         onEnded
                                       }: TrackItemAudioProps) {
  const audioRef = useRef<HTMLAudioElement>(null);


  useEffect(() => {
    if (audioRef.current && isCurrentTrack) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Ошибка воспроизведения:', error);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isCurrentTrack, isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current && isCurrentTrack && currentTime > 0) {
      const timeDiff = Math.abs(audioRef.current.currentTime - currentTime);
      if (timeDiff > 1) {
        audioRef.current.currentTime = currentTime;
      }
    }
  }, [currentTime, isCurrentTrack]);

  return (
    <audio
      ref={audioRef}
      controls
      className="!hidden"
      onTimeUpdate={(e) => {
        if (onTimeUpdate && isCurrentTrack) {
          onTimeUpdate(e.currentTarget.currentTime);
        }
      }}
      onLoadedMetadata={(e) => {
        if (onLoadedMetadata && isCurrentTrack) {
          onLoadedMetadata(e.currentTarget.duration);
        }
      }}
      onEnded={() => {
        if (onEnded && isCurrentTrack) {
          onEnded();
        }
      }}
    >
      <source src={staticUrl(audioUrl)} type="audio/mpeg" />
      Ваш браузер не поддерживает аудиоплеер.
    </audio>
  );
}