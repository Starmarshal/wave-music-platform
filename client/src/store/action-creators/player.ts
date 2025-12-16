import {PlayerActionType} from '../reducers/playerReducer';
import {ITrack} from '@/src/types/track';

export const setCurrentTrack = (trackId: string | null) => ({
  type: PlayerActionType.SET_CURRENT_TRACK as const,
  payload: trackId,
});

export const setCurrentTrackData = (track: ITrack | null) => ({
  type: PlayerActionType.SET_CURRENT_TRACK_DATA as const,
  payload: track,
});

export const playTrack = () => ({
  type: PlayerActionType.PLAY as const,
});

export const pauseTrack = () => ({
  type: PlayerActionType.PAUSE as const,
});

export const setVolume = (volume: number) => ({
  type: PlayerActionType.SET_VOLUME as const,
  payload: volume,
});

export const setCurrentTime = (time: number) => ({
  type: PlayerActionType.SET_CURRENT_TIME as const,
  payload: time,
});

export const setDuration = (duration: number) => ({
  type: PlayerActionType.SET_DURATION as const,
  payload: duration,
});

export const stopTrack = () => ({
  type: PlayerActionType.STOP as const,
});

export const setAlbumTracks = (tracks: ITrack[]) => ({
  type: 'SET_ALBUM_TRACKS' as const,
  payload: tracks,
});

export const playNextTrack = () => ({
  type: 'PLAY_NEXT_TRACK' as const,
});

export const playPrevTrack = () => ({
  type: 'PLAY_PREV_TRACK' as const,
});

export const setCurrentAlbumIndex = (index: number) => ({
  type: 'SET_CURRENT_ALBUM_INDEX' as const,
  payload: index,
});

export const setAlbumMode = (isAlbumMode: boolean) => ({
  type: 'SET_ALBUM_MODE' as const,
  payload: isAlbumMode,
});