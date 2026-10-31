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
  isShuffleMode: boolean;
  // Повтор очереди (альбом, плейлист) после последнего трека
  isRepeat: boolean;
  // Перемешивать очередь — настройка плеера, действует и на следующие альбомы
  isQueueShuffle: boolean;
  // Очередь в исходном порядке, чтобы выключение перемешивания возвращало его
  queueSource: ITrack[];
  // Что играет: 'album:<id>', 'playlist:<id>' и т.п.
  queueId: string | null;
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
  SET_SHUFFLE_MODE = 'SET_SHUFFLE_MODE',
  SET_REPEAT = 'SET_REPEAT',
  SET_QUEUE_SHUFFLE = 'SET_QUEUE_SHUFFLE',
  SET_QUEUE = 'SET_QUEUE',
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

interface SetShuffleModeAction {
  type: PlayerActionType.SET_SHUFFLE_MODE;
  payload: boolean;

  [key: string]: any;
}

interface SetRepeatAction {
  type: PlayerActionType.SET_REPEAT;
  payload: boolean;

  [key: string]: any;
}

interface SetQueueShuffleAction {
  type: PlayerActionType.SET_QUEUE_SHUFFLE;
  payload: boolean;

  [key: string]: any;
}

interface SetQueueAction {
  type: PlayerActionType.SET_QUEUE;
  payload: { tracks: ITrack[]; source: ITrack[]; index: number; queueId: string | null };

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
  | SetAlbumModeAction
  | SetShuffleModeAction
  | SetRepeatAction
  | SetQueueShuffleAction
  | SetQueueAction;

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
  isShuffleMode: false,
  isRepeat: false,
  isQueueShuffle: false,
  queueSource: [],
  queueId: null,
};

export const playerReducer = (state = initialState, action: PlayerAction): PlayerState => {
  switch (action.type) {
    case 'SET_ALBUM_MODE': // Добавляем обработчик для SET_ALBUM_MODE
      return {
        ...state,
        isAlbumMode: action.payload,
      };

    case PlayerActionType.SET_SHUFFLE_MODE:
      return {
        ...state,
        isShuffleMode: action.payload,
        // Волна — не альбом: очередь альбома забываем
        queueId: action.payload ? null : state.queueId,
        queueSource: action.payload ? [] : state.queueSource,
        // Выключаем режим альбома при включении shuffle mode
        isAlbumMode: action.payload ? false : state.isAlbumMode,
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

    case PlayerActionType.SET_REPEAT:
      return {
        ...state,
        isRepeat: action.payload,
      };

    case PlayerActionType.SET_QUEUE_SHUFFLE:
      return {
        ...state,
        isQueueShuffle: action.payload,
      };

    // Запуск очереди с конкретного трека; порядок tracks уже учитывает перемешивание
    case PlayerActionType.SET_QUEUE: {
      const {tracks, source, index, queueId} = action.payload;
      const track = tracks[index] ?? null;
      return {
        ...state,
        albumTracks: tracks,
        queueSource: source,
        queueId,
        currentAlbumIndex: track ? index : -1,
        currentTrackId: track?._id ?? null,
        currentTrack: track,
        isAlbumMode: tracks.length > 0,
        isShuffleMode: false,
      };
    }

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
        isShuffleMode: false,
      };

    case 'SET_ALBUM_TRACKS':
      return {
        ...state,
        albumTracks: action.payload,
        currentAlbumIndex: action.payload.length > 0 ? 0 : -1,
        // Автоматически включаем режим альбома при установке треков, только если не в режиме shuffle
        isAlbumMode: action.payload.length > 0 && !state.isShuffleMode,
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