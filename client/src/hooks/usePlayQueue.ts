'use client';

import {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {message} from 'antd';
import {
  playTrack,
  setAlbumMode,
  setAlbumTracks,
  setCurrentTrack,
  setCurrentTrackData,
  setShuffleMode,
} from '@/src/store/action-creators/player';
import usePlaybackGuard from '@/src/hooks/usePlaybackGuard';
import {ITrack} from '@/src/types/track';

// Запуск списка треков подряд (альбом, плейлист, треки артиста)
export default function usePlayQueue() {
  const dispatch = useDispatch();
  const guard = usePlaybackGuard();

  return useCallback((tracks: ITrack[], title?: string) => {
    if (!guard()) return;
    if (!tracks.length) {
      message.warning('Здесь пока нет треков');
      return;
    }
    dispatch(setShuffleMode(false));
    dispatch(setAlbumTracks(tracks));
    dispatch(setAlbumMode(true));
    dispatch(setCurrentTrack(tracks[0]._id));
    dispatch(setCurrentTrackData(tracks[0]));
    dispatch(playTrack());
    if (title) message.success(`Играет «${title}»`);
  }, [dispatch, guard]);
}
