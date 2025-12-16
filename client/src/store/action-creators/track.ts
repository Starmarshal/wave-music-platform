import {Dispatch} from 'redux';
import {TrackAction, TrackActionType} from '@/src/types/track';
import {api} from '@/src/shared/api';

export const fetchTracks = () => {
  return async (dispatch: Dispatch<TrackAction>) => {
    try {
      const response = await api.get('/tracks');
      dispatch({type: TrackActionType.FETCH_TRACKS, payload: response.data});
    } catch (e) {
      dispatch({
        type: TrackActionType.FETCH_TRACKS_ERROR,
        payload: 'Произошла ошибка при загрузке треков'
      });
    }
  };
};

export const searchTracks = (query: string) => {
  return async (dispatch: Dispatch<TrackAction>) => {
    try {
      const response = await api.get('/tracks/search', {params: {query}});
      dispatch({type: TrackActionType.FETCH_TRACKS, payload: response.data});
    } catch (e) {
      dispatch({
        type: TrackActionType.FETCH_TRACKS_ERROR,
        payload: 'Произошла ошибка при загрузке треков'
      });
    }
  };
};
