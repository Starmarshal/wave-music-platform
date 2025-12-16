import {combineReducers} from 'redux';
import {trackReducer} from './trackReducer';
import {playerReducer} from './playerReducer';

export const rootReducer = combineReducers({
  track: trackReducer,
  player: playerReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
