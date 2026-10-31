'use client';

import {useEffect, useRef} from 'react';
import {staticUrl} from '@/src/shared/config';
import {useSelector} from 'react-redux';
import {RootState} from '@/src/store/reducers';

type Track = {
  _id: string;
  audio: string;
};

type PlayerAudioProps = {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  onLoadedMetadata: (duration: number) => void;
  onTimeUpdate: (time: number) => void;
  onError: (error: string | Error) => void;
  onEnded?: () => void;
};

export default function PlayerAudio({
                                      currentTrack,
                                      isPlaying,
                                      currentTime,
                                      volume,
                                      onLoadedMetadata,
                                      onTimeUpdate,
                                      onError,
                                      onEnded
                                    }: PlayerAudioProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const isActiveTab = useSelector((state: RootState) => state.player.isActiveTab);
  const currentTrackIdRef = useRef<string | null>(null);
  currentTrackIdRef.current = currentTrack?._id ?? null;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume, isActiveTab]);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise && typeof playPromise.then === 'function') {
          playPromise.catch((error) => {
            console.error('Play error:', error);
            onError(error instanceof Error ? error : new Error(String(error)));
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack, onError, isActiveTab]);

  useEffect(() => {
    if (audioRef.current && currentTime > 0 && currentTrack) {
      const timeDiff = Math.abs(audioRef.current.currentTime - currentTime);
      if (timeDiff > 1) {
        audioRef.current.currentTime = currentTime;
      }
    }
  }, [currentTime, currentTrack, isActiveTab]);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement || !currentTrack) return;

    const handleError = (e: Event) => {
      const error = audioElement.error;
      let errorMessage = 'Ошибка загрузки аудио';

      if (error) {
        switch (error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMessage = 'Загрузка аудио прервана';
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            errorMessage = 'Ошибка сети при загрузке аудио';
            break;
          case MediaError.MEDIA_ERR_DECODE:
            errorMessage = 'Ошибка декодирования аудио';
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = 'Формат аудио не поддерживается';
            break;
          default:
            errorMessage = `Ошибка аудио: ${error.code}`;
        }
      }

      onError(errorMessage);
    };

    const handleLoadedMetadata = () => {
      const duration = audioElement.duration;
      if (!isNaN(duration) && isFinite(duration)) {
        onLoadedMetadata(duration);
      }
    };

    const listenerTrackId = currentTrack._id;

    const handleTimeUpdate = () => {
      if (currentTrackIdRef.current !== listenerTrackId) return;
      onTimeUpdate(audioElement.currentTime);
    };

    const handleEnded = () => {
      if (onEnded) {
        onEnded();
      }
    };

    audioElement.addEventListener('error', handleError);
    audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioElement.addEventListener('timeupdate', handleTimeUpdate);
    audioElement.addEventListener('ended', handleEnded);

    return () => {
      audioElement.removeEventListener('error', handleError);
      audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      audioElement.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack, onError, onLoadedMetadata, onTimeUpdate, onEnded, isActiveTab]);

  // В неактивной вкладке звука нет: при переходе плеер монтируется заново и продолжает с currentTime
  if (!currentTrack || !isActiveTab) return null;

  return (
    <audio
      ref={audioRef}
      src={staticUrl(currentTrack.audio)}
      preload="metadata"
      className="!hidden"
      crossOrigin="use-credentials"
    />
  );
}