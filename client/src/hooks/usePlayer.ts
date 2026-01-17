'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/src/store/reducers';
import {
  pauseTrack,
  playNextTrack,
  playPrevTrack,
  playTrack,
  setAlbumMode,
  setCurrentTime,
  setCurrentTrack,
  setCurrentTrackData,
  setDuration,
  setVolume
} from '@/src/store/action-creators/player';
import {trackService} from '@/src/shared/api/trackService'; // Используем trackService
import {message} from 'antd';

export default function usePlayer() {
  const dispatch = useDispatch();
  const {
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    albumTracks,
    currentAlbumIndex,
    isAlbumMode,
    isShuffleMode
  } = useSelector((state: RootState) => state.player);

  const [audioError, setAudioError] = useState<string | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const hasNextTrack = (isAlbumMode || isShuffleMode) && albumTracks.length > 0 && currentAlbumIndex >= 0 &&
    currentAlbumIndex < albumTracks.length - 1;
  const hasPrevTrack = (isAlbumMode || isShuffleMode) && albumTracks.length > 0 && currentAlbumIndex > 0;

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
    if (isAlbumMode || isShuffleMode) {
      dispatch(playNextTrack());
    }
  }, [isAlbumMode, isShuffleMode, dispatch]);

  const handlePrevTrack = useCallback(() => {
    if (isAlbumMode || isShuffleMode) {
      dispatch(playPrevTrack());
    }
  }, [isAlbumMode, isShuffleMode, dispatch]);

  const handleTimeChange = useCallback((value: number) => {
    dispatch(setCurrentTime(value));
  }, [dispatch]);

  const handleVolumeChange = useCallback((value: number) => {
    dispatch(setVolume(value));
  }, [dispatch]);

  const handleLoadedMetadata = useCallback((duration: number) => {
    dispatch(setDuration(duration));
    setAudioError(null);
  }, [dispatch]);

  // Функция для увеличения счетчика прослушиваний
  const incrementListenCount = useCallback(async (trackId: string) => {
    try {
      await trackService.incrementListenCount(trackId);
      console.log(`Счетчик прослушиваний увеличен для трека ${trackId}`);
    } catch (error) {
      console.error('Ошибка при увеличении счетчика прослушиваний:', error);
      // Можно показать уведомление, но не критично
      message.error('Не удалось обновить счетчик прослушиваний');
    }
  }, []);

  // Обработчик окончания аудио
  const handleAudioEnded = useCallback(async () => {
    if (!currentTrack) return;

    // Всегда увеличиваем счетчик прослушиваний
    try {
      await incrementListenCount(currentTrack._id);
    } catch (error) {
      // Продолжаем работу даже если не удалось обновить счетчик
      console.error('Не удалось обновить счетчик прослушиваний:', error);
    }

    // Переключаем на следующий трек только в режиме альбома или случайного воспроизведения
    if ((isAlbumMode || isShuffleMode) && albumTracks.length > 0 && currentAlbumIndex >= 0) {
      const isLastTrack = currentAlbumIndex === albumTracks.length - 1;

      if (!isLastTrack) {
        // Автоматически переходим к следующему треку
        setTimeout(() => {
          dispatch(playNextTrack());
        }, 500); // Небольшая задержка для плавного перехода
      } else {
        // Если это последний трек, останавливаем воспроизведение
        dispatch(pauseTrack());
        dispatch(setCurrentTime(0));
        if (!isShuffleMode) {
          message.info('Альбом завершен');
        } else {
          message.info('Все треки проиграны');
        }
      }
    } else {
      // В обычном режиме просто останавливаем воспроизведение
      dispatch(pauseTrack());
      dispatch(setCurrentTime(0));
    }
  }, [currentTrack, isAlbumMode, isShuffleMode, albumTracks, currentAlbumIndex, incrementListenCount, dispatch]);

  const handleAudioError = useCallback((error: Error | string) => {
    console.error('Audio error:', error);
    setAudioError(typeof error === 'string' ? error : error.message || 'Ошибка загрузки аудио');

    // Если ошибка в режиме альбома или случайного воспроизведения, пытаемся перейти к следующему треку
    if ((isAlbumMode || isShuffleMode) && albumTracks.length > 0 && currentAlbumIndex >= 0) {
      const isLastTrack = currentAlbumIndex === albumTracks.length - 1;
      if (!isLastTrack) {
        setTimeout(() => {
          dispatch(playNextTrack());
        }, 1000);
      } else {
        dispatch(setAlbumMode(false));
        dispatch(setCurrentTrack(null));
        dispatch(setCurrentTrackData(null));
      }
    } else {
      dispatch(setCurrentTrack(null));
      dispatch(setCurrentTrackData(null));
    }
  }, [albumTracks, currentAlbumIndex, isAlbumMode, dispatch]);

  // Сброс режима альбома при размонтировании
  useEffect(() => {
    return () => {
      // Можно сбросить режим альбома если нужно
      // dispatch(setAlbumMode(false));
    };
  }, [dispatch]);

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
    isAlbumMode,
    isShuffleMode,
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
    handleAudioEnded,
    formatTime,

    // Dispatch
    dispatch,
  };
}