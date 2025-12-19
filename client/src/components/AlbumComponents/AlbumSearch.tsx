'use client';

import DebouncedSearch from '@/src/components/DebouncedSearch';

interface AlbumSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceDelay?: number;
  initialValue?: string;
}

export default function AlbumSearch({
                                      onSearch,
                                      placeholder = 'Поиск альбомов...',
                                      debounceDelay = 300,
                                      initialValue = '',
                                    }: AlbumSearchProps) {
  return (
    <DebouncedSearch
      onSearch={onSearch}
      placeholder={placeholder}
      debounceDelay={debounceDelay}
      initialValue={initialValue}
    />
  );
}