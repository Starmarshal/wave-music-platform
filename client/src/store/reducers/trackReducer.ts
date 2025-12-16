import {TrackAction, TrackActionType, TrackState} from '@/src/types/track';

const initialState: TrackState = {
  tracks: [],
  error: '',
};

export const trackReducer = (state = initialState, action: TrackAction): TrackState => {
  switch (action.type) {
    case TrackActionType.FETCH_TRACKS:
      return {error: '', tracks: action.payload};

    case TrackActionType.FETCH_TRACKS_ERROR:
      return {...state, error: action.payload};

    default:
      return state;
  }
};
