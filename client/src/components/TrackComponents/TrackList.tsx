'use client';

import React, {useEffect, useState, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchTracks} from '@/src/store/action-creators/track';
import {RootState} from '@/src/store/reducers';
import TrackItem from '../TrackItemComponents/TrackItem';
import {AppDispatch} from '@/src/store/store';
import {ShowMore} from '@/src/components/show-more';
import {PAGE_LIMIT} from '@/src/components/show-more';

const TrackList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tracks = useSelector((state: RootState) => state.track.tracks);

  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchTracks());
  }, [dispatch]);

  // Сбрасываем страницу при смене списка треков (например, при поиске)
  useEffect(() => {
    setPage(1);
  }, [tracks]);

  const visibleCount = useMemo(() => page * PAGE_LIMIT, [page]);
  const visibleTracks = useMemo(
    () => tracks.slice(0, visibleCount),
    [tracks, visibleCount],
  );

  const hasMore = visibleTracks.length < tracks.length;

  const handleShowMore = () => {
    if (hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div>
      {visibleTracks.map(track => (
        <TrackItem
          key={track._id}
          track={track}
          onDelete={() => dispatch(fetchTracks())}
        />
      ))}

      {hasMore && (
        <div className="flex justify-center mt-4">
          <ShowMore
            onClick={handleShowMore}
            disabled={!hasMore}
          />
        </div>
      )}
    </div>
  );
};

export default TrackList;
