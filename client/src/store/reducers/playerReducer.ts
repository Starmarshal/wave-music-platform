import {ITrack} from '@/src/types/track';

export interface PlayerState {
  currentTrackId: string | null;
  currentTrack: ITrack | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  albumTracks: ITrack[];
  currentAlbumIndex: number;
  isAlbumMode: boolean;
}

export enum PlayerActionType {
  SET_CURRENT_TRACK = 'SET_CURRENT_TRACK',
  SET_CURRENT_TRACK_DATA = 'SET_CURRENT_TRACK_DATA',
  PLAY = 'PLAY',
  PAUSE = 'PAUSE',
  SET_VOLUME = 'SET_VOLUME',
  SET_CURRENT_TIME = 'SET_CURRENT_TIME',
  SET_DURATION = 'SET_DURATION',
  STOP = 'STOP',
  SET_ALBUM_TRACKS = 'SET_ALBUM_TRACKS',
  PLAY_NEXT_TRACK = 'PLAY_NEXT_TRACK',
  PLAY_PREV_TRACK = 'PLAY_PREV_TRACK',
  SET_CURRENT_ALBUM_INDEX = 'SET_CURRENT_ALBUM_INDEX',
  SET_ALBUM_MODE = 'SET_ALBUM_MODE',
}

interface SetCurrentTrackAction {
  type: PlayerActionType.SET_CURRENT_TRACK;
  payload: string | null;

  [key: string]: any;
}

interface SetCurrentTrackDataAction {
  type: PlayerActionType.SET_CURRENT_TRACK_DATA;
  payload: ITrack | null;

  [key: string]: any;
}

interface PlayAction {
  type: PlayerActionType.PLAY;

  [key: string]: any;
}

interface PauseAction {
  type: PlayerActionType.PAUSE;

  [key: string]: any;
}

interface SetVolumeAction {
  type: PlayerActionType.SET_VOLUME;
  payload: number;

  [key: string]: any;
}

interface SetCurrentTimeAction {
  type: PlayerActionType.SET_CURRENT_TIME;
  payload: number;

  [key: string]: any;
}

interface SetDurationAction {
  type: PlayerActionType.SET_DURATION;
  payload: number;

  [key: string]: any;
}

interface StopAction {
  type: PlayerActionType.STOP;

  [key: string]: any;
}

interface SetAlbumTracksAction {
  type: PlayerActionType.SET_ALBUM_TRACKS;
  payload: ITrack[];

  [key: string]: any;
}

interface PlayNextTrackAction {
  type: PlayerActionType.PLAY_NEXT_TRACK;

  [key: string]: any;
}

interface PlayPrevTrackAction {
  type: PlayerActionType.PLAY_PREV_TRACK;

  [key: string]: any;
}

interface SetCurrentAlbumIndexAction {
  type: PlayerActionType.SET_CURRENT_ALBUM_INDEX;
  payload: number;

  [key: string]: any;
}

interface SetAlbumModeAction {
  type: PlayerActionType.SET_ALBUM_MODE;
  payload: boolean;

  [key: string]: any;
}

export type PlayerAction =
  | SetCurrentTrackAction
  | SetCurrentTrackDataAction
  | PlayAction
  | PauseAction
  | SetVolumeAction
  | SetCurrentTimeAction
  | SetDurationAction
  | StopAction
  | SetAlbumTracksAction
  | PlayNextTrackAction
  | PlayPrevTrackAction
  | SetCurrentAlbumIndexAction
  | SetAlbumModeAction;

const initialState: PlayerState = {
  currentTrackId: null,
  currentTrack: null,
  isPlaying: false,
  volume: 0.5,
  currentTime: 0,
  duration: 0,
  albumTracks: [],
  currentAlbumIndex: -1,
  isAlbumMode: false,
};

export const playerReducer = (state = initialState, action: PlayerAction): PlayerState => {
  switch (action.type) {
    case 'SET_ALBUM_MODE': // Добавляем обработчик для SET_ALBUM_MODE
      return {
        ...state,
        isAlbumMode: action.payload,
      };

    case PlayerActionType.SET_CURRENT_TRACK:
      if (action.payload && state.albumTracks.length === 0) {
        return {
          ...state,
          currentTrackId: action.payload,
          isAlbumMode: false,
          isPlaying: action.payload !== null,
          currentTime: 0,
        };
      }
      if (action.payload && state.albumTracks.length > 0) {
        const trackIndex = state.albumTracks.findIndex(track => track._id === action.payload);
        return {
          ...state,
          currentTrackId: action.payload,
          currentAlbumIndex: trackIndex,
          isPlaying: action.payload !== null,
          currentTime: 0,
        };
      }
      return {
        ...state,
        currentTrackId: action.payload,
        isPlaying: action.payload !== null,
        currentTime: 0,
      };

    case PlayerActionType.SET_CURRENT_TRACK_DATA:
      return {
        ...state,
        currentTrack: action.payload,
      };

    case PlayerActionType.SET_CURRENT_TIME:
      return {
        ...state,
        currentTime: action.payload,
      };

    case PlayerActionType.SET_DURATION:
      return {
        ...state,
        duration: action.payload,
      };

    case PlayerActionType.PLAY:
      return {
        ...state,
        isPlaying: true,
      };

    case PlayerActionType.PAUSE:
      return {
        ...state,
        isPlaying: false,
      };

    case PlayerActionType.SET_VOLUME:
      return {
        ...state,
        volume: Math.max(0, Math.min(1, action.payload)),
      };

    case PlayerActionType.STOP:
      return {
        ...state,
        currentTrackId: null,
        currentTrack: null,
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        albumTracks: [],
        currentAlbumIndex: -1,
      };

    case 'SET_ALBUM_TRACKS':
      return {
        ...state,
        albumTracks: action.payload,
        currentAlbumIndex: action.payload.length > 0 ? 0 : -1,
        isAlbumMode: action.payload.length > 0, // Автоматически включаем режим альбома при установке треков
      };

    case PlayerActionType.PLAY_NEXT_TRACK:
      if (state.albumTracks.length > 0 && state.currentAlbumIndex >= 0) {
        const nextIndex = (state.currentAlbumIndex + 1) % state.albumTracks.length;
        const nextTrack = state.albumTracks[nextIndex];

        return {
          ...state,
          currentTrackId: nextTrack._id,
          currentTrack: nextTrack,
          currentAlbumIndex: nextIndex,
          currentTime: 0,
          isPlaying: true,
        };
      }
      return state;

    case PlayerActionType.PLAY_PREV_TRACK:
      if (state.albumTracks.length > 0 && state.currentAlbumIndex >= 0) {
        const prevIndex = state.currentAlbumIndex - 1 >= 0
          ? state.currentAlbumIndex - 1
          : state.albumTracks.length - 1;
        const prevTrack = state.albumTracks[prevIndex];

        return {
          ...state,
          currentTrackId: prevTrack._id,
          currentTrack: prevTrack,
          currentAlbumIndex: prevIndex,
          currentTime: 0,
          isPlaying: true,
        };
      }
      return state;

    case PlayerActionType.SET_CURRENT_ALBUM_INDEX:
      if (state.albumTracks.length > 0 && action.payload >= 0 && action.payload < state.albumTracks.length) {
        const track = state.albumTracks[action.payload];
        return {
          ...state,
          currentTrackId: track._id,
          currentTrack: track,
          currentAlbumIndex: action.payload,
          currentTime: 0,
        };
      }
      return state;

    default:
      return state;
  }
};