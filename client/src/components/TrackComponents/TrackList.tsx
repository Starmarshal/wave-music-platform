'use client';

import React, {useEffect, useMemo, useState} from 'react';
import {ITrack} from '@/src/types/track';
import TrackItem from '../TrackItemComponents/TrackItem';
import {ShowMore, TRACKS_PAGE_LIMIT} from '@/src/components/show-more';

interface TrackListProps {
  tracks: ITrack[];
  onDelete?: () => void;
}

const TrackList: React.FC<TrackListProps> = ({tracks, onDelete}) => {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [tracks]);

  const visibleCount = useMemo(() => page * TRACKS_PAGE_LIMIT, [page]);
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
          onDelete={onDelete}
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
