'use client';

import {Input} from 'antd';
import {useEffect, useState} from 'react';
import debounce from 'lodash.debounce';

type TracksSearchProps = {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceDelay?: number;
  initialValue?: string;
};

export default function TracksSearch({
                                       onSearch,
                                       placeholder = 'Поиск треков...',
                                       debounceDelay = 100,
                                       initialValue = ''
                                     }: TracksSearchProps) {
  const [query, setQuery] = useState<string>(initialValue);

  const debouncedSearch = debounce((value: string) => {
    onSearch(value);
  }, debounceDelay);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  // Очистка debounce при размонтировании
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '20px'
      }}
    >
      <Input
        onChange={handleSearch}
        value={query}
        placeholder={placeholder}
        size={'large'}
        style={{
          borderRadius: '8px',
          height: '45px',
          width: '100%',
        }}
      />
    </div>
  );
}