'use client';

import {useState, useEffect, useCallback} from 'react';
import {useAppDispatch} from '@/src/hooks/useAppDispatch';
import {useTypedSelector} from '@/src/hooks/useTypedSelector';
import {fetchTracks, searchTracks} from '@/src/store/action-creators/track';

export default function useTracksPage() {
  const dispatch = useAppDispatch();
  const {tracks, error} = useTypedSelector(state => state.track);
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    dispatch(fetchTracks());
  }, [dispatch]);

  const handleSearch = useCallback(async (searchQuery: string) => {
    await dispatch(searchTracks(searchQuery));
  }, [dispatch]);

  const handleQueryChange = (value: string) => {
    setQuery(value);
  };

  return {
    // Data
    tracks,
    error,
    query,

    // Methods
    handleSearch,
    handleQueryChange,
    refetchTracks: () => dispatch(fetchTracks()),
  };
}