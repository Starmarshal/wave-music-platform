'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/src/store/reducers';
import {
  pauseTrack,
  playNextTrack,
  playPrevTrack,
  playTrack,
  setCurrentTime,
  setCurrentTrack,
  setCurrentTrackData,
  setDuration,
  setVolume
} from '@/src/store/action-creators/player';

export default function usePlayer() {
  const dispatch = useDispatch();
  const {
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    albumTracks,
    currentAlbumIndex
  } = useSelector((state: RootState) => state.player);

  const [audioError, setAudioError] = useState<string | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const hasNextTrack = albumTracks.length > 0 && currentAlbumIndex >= 0 &&
    currentAlbumIndex < albumTracks.length - 1;
  const hasPrevTrack = albumTracks.length > 0 && currentAlbumIndex > 0;

  const formatTime = useCallback((time: number) => {
    if (isNaN(time) || !isFinite(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      dispatch(pauseTrack());
    } else {
      dispatch(playTrack());
    }
  }, [isPlaying, dispatch]);

  const handleNextTrack = useCallback(() => {
    dispatch(playNextTrack());
  }, [dispatch]);

  const handlePrevTrack = useCallback(() => {
    dispatch(playPrevTrack());
  }, [dispatch]);

  const handleTimeChange = useCallback((value: number) => {
    dispatch(setCurrentTime(value));
  }, [dispatch]);

  const handleVolumeChange = useCallback((value: number) => {
    dispatch(setVolume(value));
  }, [dispatch]);

  const handleLoadedMetadata = useCallback((duration: number) => {
    dispatch(setDuration(duration));
    setAudioError(null); // Сбрасываем ошибку при успешной загрузке
  }, [dispatch]);

  const handleAudioError = useCallback((error: Error | string) => {
    console.error('Audio error:', error);
    setAudioError(typeof error === 'string' ? error : error.message || 'Ошибка загрузки аудио');

    // Если ошибка при воспроизведении, переходим к следующему треку
    if (albumTracks.length > 0 && currentAlbumIndex >= 0) {
      const isLastTrack = currentAlbumIndex === albumTracks.length - 1;
      if (!isLastTrack) {
        setTimeout(() => {
          dispatch(playNextTrack());
        }, 1000);
      } else {
        dispatch(setCurrentTrack(null));
        dispatch(setCurrentTrackData(null));
      }
    } else {
      dispatch(setCurrentTrack(null));
      dispatch(setCurrentTrackData(null));
    }
  }, [albumTracks, currentAlbumIndex, dispatch]);

  // Автоматическое переключение на следующий трек при окончании текущего
  useEffect(() => {
    const handleTrackEnd = () => {
      if (albumTracks.length > 0 && currentAlbumIndex >= 0) {
        const isLastTrack = currentAlbumIndex === albumTracks.length - 1;
        if (!isLastTrack) {
          dispatch(playNextTrack());
        } else {
          dispatch(setCurrentTrack(null));
          dispatch(setCurrentTrackData(null));
        }
      } else {
        dispatch(setCurrentTrack(null));
        dispatch(setCurrentTrackData(null));
      }
    };

    return () => {
      setAudioError(null);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [albumTracks, currentAlbumIndex, dispatch]);

  useEffect(() => {
    let isActive = true;

    const updateTime = () => {
      if (isPlaying && currentTrack && isActive) {
        animationFrameRef.current = requestAnimationFrame(updateTime);
      }
    };

    if (isPlaying && currentTrack) {
      animationFrameRef.current = requestAnimationFrame(updateTime);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }

    return () => {
      isActive = false;
    };
  }, [isPlaying, currentTrack]);

  return {
    // State
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    albumTracks,
    currentAlbumIndex,
    hasNextTrack,
    hasPrevTrack,
    audioError,

    // Methods
    handlePlayPause,
    handleNextTrack,
    handlePrevTrack,
    handleTimeChange,
    handleVolumeChange,
    handleLoadedMetadata,
    handleAudioError,
    formatTime,

    // Dispatch
    dispatch,
  };
}