import * as playerActions from './player';
import * as trackActions from './track';

export const ActionCreators = {
  ...playerActions,
  ...trackActions,
};

// Или если нужны отдельные импорты:
export * from './player';
export * from './track';