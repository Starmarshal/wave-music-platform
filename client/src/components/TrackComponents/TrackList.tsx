'use client';

import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchTracks} from '@/src/store/action-creators/track';
import {RootState} from '@/src/store/reducers';
import TrackItem from './TrackItem';
import {AppDispatch} from '@/src/store/store';

const TrackList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tracks = useSelector((state: RootState) => state.track.tracks);

  useEffect(() => {
    dispatch(fetchTracks());
  }, [dispatch]);

  return (
    <div>
      {tracks.map(track => (
        <TrackItem
          key={track._id}
          track={track}
          onDelete={() => dispatch(fetchTracks())}
        />
      ))}
    </div>
  );
};

export default TrackList;
