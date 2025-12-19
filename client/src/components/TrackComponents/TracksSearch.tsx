'use client';

import DebouncedSearch from '@/src/components/DebouncedSearch';

interface TracksSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceDelay?: number;
  initialValue?: string;
}

export default function TracksSearch({
                                       onSearch,
                                       placeholder = 'Поиск треков...',
                                       debounceDelay = 300,
                                       initialValue = '',
                                     }: TracksSearchProps) {
  return (
    <DebouncedSearch
      onSearch={onSearch}
      placeholder={placeholder}
      debounceDelay={debounceDelay}
      initialValue={initialValue}
    />
  );
}