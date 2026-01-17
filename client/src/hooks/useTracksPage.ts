'use client';

import {useEffect, useMemo, useState} from 'react';
import {useAppDispatch} from '@/src/hooks/useAppDispatch';
import {useTypedSelector} from '@/src/hooks/useTypedSelector';
import {fetchTracks} from '@/src/store/action-creators/track';

export default function useTracksPage() {
  const dispatch = useAppDispatch();
  const {tracks, error, loading} = useTypedSelector(state => state.track);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    dispatch(fetchTracks());
  }, [dispatch]);

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase().trim());
  };

  const filteredTracks = useMemo(() => {
    if (!searchQuery) return tracks;

    return tracks.filter((track) => {
      const query = searchQuery.toLowerCase();

      if (track.name?.toLowerCase().includes(query)) {
        return true;
      }

      if (track.artist?.toLowerCase().includes(query)) {
        return true;
      }

      if (track.text?.toLowerCase().includes(query)) {
        return true;
      }

      return false;
    });
  }, [tracks, searchQuery]);

  return {
    tracks: filteredTracks,
    allTracks: tracks,
    error,
    loading,
    searchQuery,

    handleSearch,
  };
}
