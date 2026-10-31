import type {Middleware} from '@reduxjs/toolkit';
import {PlayerActionType} from './reducers/playerReducer';
import {pauseTrack, setActiveTab, syncState} from './action-creators/player';

// Синхронизация плеера между вкладками одного браузера.
// Все действия плеера пересылаются в другие вкладки, а звук играет только в «активной»:
// той, где последний раз запускали трек. Остальные показывают то же состояние и управляют им.

type SyncMessage =
  | { kind: 'action'; action: { type: string; payload?: unknown } }
  | { kind: 'claim' }
  | { kind: 'hello' }
  | { kind: 'state'; state: Record<string, unknown> }
  | { kind: 'gone' };

const CHANNEL_NAME = 'wave-player';

const PLAYER_ACTIONS = new Set<string>(Object.values(PlayerActionType));

// Только для этой вкладки
const LOCAL_ACTIONS = new Set<string>([PlayerActionType.SET_ACTIVE_TAB, PlayerActionType.SYNC_STATE]);

// Запуск трека делает вкладку активной — звук переезжает в неё
const CLAIMING_ACTIONS = new Set<string>([
  PlayerActionType.PLAY,
  PlayerActionType.SET_CURRENT_TRACK,
  PlayerActionType.SET_QUEUE,
  PlayerActionType.PLAY_NEXT_TRACK,
  PlayerActionType.PLAY_PREV_TRACK,
  PlayerActionType.SET_CURRENT_ALBUM_INDEX,
]);

const channel: BroadcastChannel | null =
  typeof window !== 'undefined' && 'BroadcastChannel' in window
    ? new BroadcastChannel(CHANNEL_NAME)
    : null;

const post = (message: SyncMessage) => channel?.postMessage(message);

export const playerSyncMiddleware: Middleware = (api) => (next) => (action) => {
  const result = next(action);
  const {type, payload, meta} = action as { type: string; payload?: unknown; meta?: { remote?: boolean } };
  if (!channel || meta?.remote || !PLAYER_ACTIONS.has(type) || LOCAL_ACTIONS.has(type)) {
    return result;
  }

  const claims = CLAIMING_ACTIONS.has(type) && !(type === PlayerActionType.SET_CURRENT_TRACK && payload === null);
  if (claims) {
    if (!api.getState().player.isActiveTab) api.dispatch(setActiveTab(true));
    // claim уходит раньше действия, чтобы другие вкладки замолчали до того, как получат PLAY
    post({kind: 'claim'});
  }
  post({kind: 'action', action: {type, payload}});
  return result;
};

type SyncStore = {
  dispatch: (action: { type: string; payload?: unknown; meta?: { remote: boolean } }) => unknown;
  getState: () => { player: { isActiveTab: boolean; isPlaying: boolean; currentTrack: unknown } };
};

export const startPlayerSync = (store: SyncStore) => {
  if (!channel) return;

  channel.onmessage = ({data}: MessageEvent<SyncMessage>) => {
    const player = store.getState().player;
    switch (data.kind) {
      case 'action':
        store.dispatch({...data.action, meta: {remote: true}});
        break;
      case 'claim':
        store.dispatch(setActiveTab(false));
        break;
      case 'hello':
        // Новой вкладке отвечает только активная, если в ней что-то играет или стоит на паузе
        if (player.isActiveTab && player.currentTrack) {
          post({kind: 'state', state: {...player}});
        }
        break;
      case 'state':
        store.dispatch(syncState({...data.state, isActiveTab: false}));
        break;
      case 'gone':
        // Активная вкладка закрылась — звука больше нет, показываем паузу
        store.dispatch({...pauseTrack(), meta: {remote: true}});
        break;
    }
  };

  post({kind: 'hello'});

  window.addEventListener('pagehide', () => {
    const player = store.getState().player;
    if (player.isActiveTab && player.isPlaying) post({kind: 'gone'});
  });
};
