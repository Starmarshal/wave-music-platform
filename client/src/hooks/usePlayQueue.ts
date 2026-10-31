'use client';

import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {message} from 'antd';
import {
  playTrack,
  setQueue,
  setQueueShuffle,
  setRepeat,
} from '@/src/store/action-creators/player';
import usePlaybackGuard from '@/src/hooks/usePlaybackGuard';
import {shuffleArray} from '@/src/shared/shuffle';
import {RootState} from '@/src/store/reducers';
import {ITrack} from '@/src/types/track';

type PlayQueueOptions = {
  // С какого трека начать (по индексу в исходном порядке)
  startIndex?: number;
  // Например 'album:<id>' — по нему страница понимает, что играет именно она
  queueId?: string;
};

// При перемешивании выбранный трек играет первым, остальные — в случайном порядке
const orderQueue = (tracks: ITrack[], shuffle: boolean, startIndex?: number) => {
  if (!shuffle) return {order: tracks, index: startIndex ?? 0};
  if (startIndex === undefined) return {order: shuffleArray(tracks), index: 0};
  const first = tracks[startIndex];
  return {order: [first, ...shuffleArray(tracks.filter((_, i) => i !== startIndex))], index: 0};
};

// Запуск списка треков подряд (альбом, плейлист, треки артиста)
export default function usePlayQueue() {
  const dispatch = useDispatch();
  const guard = usePlaybackGuard();
  const isQueueShuffle = useSelector((state: RootState) => state.player.isQueueShuffle);

  return useCallback((tracks: ITrack[], title?: string, options: PlayQueueOptions = {}) => {
    if (!guard()) return;
    if (!tracks.length) {
      message.warning('Здесь пока нет треков');
      return;
    }
    const {order, index} = orderQueue(tracks, isQueueShuffle, options.startIndex);
    dispatch(setQueue(order, tracks, index, options.queueId ?? null));
    dispatch(playTrack());
    if (title) message.success(`Играет «${title}»`);
  }, [dispatch, guard, isQueueShuffle]);
}

// Повтор и перемешивание очереди; перемешивание можно переключать во время игры
export function useQueueControls() {
  const dispatch = useDispatch();
  const {isRepeat, isQueueShuffle, isAlbumMode, queueSource, queueId, currentTrackId} =
    useSelector((state: RootState) => state.player);

  const toggleRepeat = useCallback(() => {
    dispatch(setRepeat(!isRepeat));
  }, [dispatch, isRepeat]);

  const toggleShuffle = useCallback(() => {
    const next = !isQueueShuffle;
    dispatch(setQueueShuffle(next));

    // Текущий трек продолжает играть, меняется только порядок следующих
    const currentIndex = queueSource.findIndex((track) => track._id === currentTrackId);
    if (!isAlbumMode || currentIndex < 0) return;
    const {order, index} = next
      ? orderQueue(queueSource, true, currentIndex)
      : {order: queueSource, index: currentIndex};
    dispatch(setQueue(order, queueSource, index, queueId));
  }, [dispatch, isQueueShuffle, isAlbumMode, queueSource, queueId, currentTrackId]);

  return {isRepeat, isQueueShuffle, toggleRepeat, toggleShuffle};
}
