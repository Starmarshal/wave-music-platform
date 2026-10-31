import {configureStore} from '@reduxjs/toolkit';
import {rootReducer} from './reducers';
import {playerSyncMiddleware, startPlayerSync} from './playerSync';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({serializableCheck: false}).concat(playerSyncMiddleware),
});

// Состояние плеера общее для всех вкладок
startPlayerSync(store);

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
