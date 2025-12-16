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
  setVolume
} from '@/src/store/action-creators/player';

export default function useTrackItem(track: any) {
  const dispatch = useDispatch();
  const {
    currentTrackId,
    isPlaying: globalIsPlaying,
    volume: globalVolume,
    currentTime,
    duration
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
      dispatch(setCurrentTrack(track._id));
      dispatch(setCurrentTrackData(track));
      dispatch(playTrack());
    }

    if (!hasBeenPlayed && !isCurrentTrack) {
      setHasBeenPlayed(true);
      api.post(`/tracks/listen/${track._id}`)
        .then(() => {
          console.log('Количество прослушиваний увеличено');
        })
        .catch((error) => {
          console.error('Ошибка при увеличении количества прослушиваний:', error);
        });
    }
  }, [isCurrentTrack, globalIsPlaying, track, dispatch, hasBeenPlayed]);

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

  const handleAudioEnded = useCallback(() => {
    if (isCurrentTrack) {
      dispatch(setCurrentTrack(null));
      dispatch(setCurrentTrackData(null));
      dispatch(setCurrentTime(0));
    }
  }, [isCurrentTrack, dispatch]);

  return {
    // State
    isCurrentTrack,
    isPlaying,
    globalVolume,
    currentTime,
    duration,
    hasBeenPlayed,

    // Handlers
    handleDelete,
    handlePlayPause,
    handleTimeChange,
    handleVolumeChange,
    handleAudioLoadedMetadata,
    handleAudioEnded,

    // Format function
    formatTime: (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  };
}