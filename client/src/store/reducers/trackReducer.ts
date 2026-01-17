import {TrackAction, TrackActionType, TrackState} from '@/src/types/track';

const initialState: TrackState = {
  tracks: [],
  error: '',
  loading: false,
};

export const trackReducer = (state = initialState, action: TrackAction): TrackState => {
  switch (action.type) {
    case TrackActionType.FETCH_TRACKS:
      return {error: '', tracks: action.payload, loading: false};

    case TrackActionType.FETCH_TRACKS_ERROR:
      return {...state, error: action.payload, loading: false};

    default:
      return state;
  }
};
