'use client';

import {useState, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/src/store/reducers';
import {api} from '@/src/shared/api';
import {
  pauseTrack,
  playTrack,
  setCurrentTime,
  setCurrentTrack,
  setCurrentTrackData,
  setDuration,
  setVolume,
  setAlbumMode,
  setAlbumTracks,
  playNextTrack
} from '@/src/store/action-creators/player';

export default function useTrackItem(track: any) {
  const dispatch = useDispatch();
  const {
    currentTrackId,
    isPlaying: globalIsPlaying,
    volume: globalVolume,
    currentTime,
    duration,
    albumTracks,
    currentAlbumIndex,
    isAlbumMode
  } = useSelector((state: RootState) => state.player);

  const [hasBeenPlayed, setHasBeenPlayed] = useState(false);

  const isCurrentTrack = currentTrackId === track._id;
  const isPlaying = isCurrentTrack && globalIsPlaying;

  const handleDelete = useCallback(async () => {
    await api.delete(`/tracks/${track._id}`);
  }, [track._id]);

  const handlePlayPause = useCallback(() => {
    if (isCurrentTrack) {
      if (globalIsPlaying) {
        dispatch(pauseTrack());
      } else {
        dispatch(playTrack());
      }
    } else {
      // Если кликаем на трек, сбрасываем режим альбома если он был включен
      if (isAlbumMode) {
        dispatch(setAlbumMode(false));
        dispatch(setAlbumTracks([]));
      }

      dispatch(setCurrentTrack(track._id));
      dispatch(setCurrentTrackData(track));
      dispatch(playTrack());
    }

    // Увеличиваем счетчик прослушиваний только при первом запуске трека
    if (!hasBeenPlayed && !isCurrentTrack) {
      setHasBeenPlayed(true);
    }
  }, [isCurrentTrack, globalIsPlaying, track, dispatch, hasBeenPlayed, isAlbumMode]);

  // Функция для увеличения счетчика прослушиваний
  const incrementListenCount = useCallback(async () => {
    try {
      await api.post(`/tracks/listen/${track._id}`);
      console.log('Счетчик прослушиваний увеличен для трека:', track._id);
    } catch (error) {
      console.error('Ошибка при увеличении количества прослушиваний:', error);
    }
  }, [track._id]);

  const handleTimeChange = useCallback((value: number) => {
    if (isCurrentTrack) {
      dispatch(setCurrentTime(value));
    }
  }, [isCurrentTrack, dispatch]);

  const handleVolumeChange = useCallback((value: number) => {
    dispatch(setVolume(value));
  }, [dispatch]);

  const handleAudioLoadedMetadata = useCallback((duration: number) => {
    if (isCurrentTrack) {
      dispatch(setDuration(duration));
    }
  }, [isCurrentTrack, dispatch]);

  const handleAudioEnded = useCallback(async () => {
    if (isCurrentTrack) {
      // ВСЕГДА увеличиваем счетчик прослушиваний при полном прослушивании трека
      await incrementListenCount();

      // Если в режиме альбома, переключаем на следующий трек
      if (isAlbumMode && albumTracks.length > 0 && currentAlbumIndex >= 0) {
        const isLastTrack = currentAlbumIndex === albumTracks.length - 1;

        if (!isLastTrack) {
          // Автоматически переходим к следующему треку
          dispatch(playNextTrack());
        } else {
          // Если это последний трек в альбоме
          dispatch(pauseTrack());
          dispatch(setCurrentTime(0));
          // Можно добавить уведомление о завершении альбома
        }
      } else {
        // В обычном режиме просто останавливаем воспроизведение
        dispatch(pauseTrack());
        dispatch(setCurrentTime(0));
        dispatch(setCurrentTrack(null));
        dispatch(setCurrentTrackData(null));
      }
    }
  }, [isCurrentTrack, isAlbumMode, albumTracks, currentAlbumIndex, incrementListenCount, dispatch]);

  return {
    // State
    isCurrentTrack,
    isPlaying,
    globalVolume,
    currentTime,
    duration,
    hasBeenPlayed,
    isAlbumMode, // Возвращаем флаг режима альбома

    // Handlers
    handleDelete,
    handlePlayPause,
    handleTimeChange,
    handleVolumeChange,
    handleAudioLoadedMetadata,
    handleAudioEnded,
    incrementListenCount, // Экспортируем функцию для использования в других местах

    // Format function
    formatTime: (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  };
}