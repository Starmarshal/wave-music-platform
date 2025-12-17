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

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <div
      className="!flex !justify-center !items-center !mb-4 md:!mb-5"
    >
      <Input
        onChange={handleSearch}
        value={query}
        placeholder={placeholder}
        size={'large'}
        className="!rounded-lg !h-[40px] sm:!h-[45px] !w-full dark:!bg-gray-700 dark:!border-gray-600 dark:!text-gray-200"
      />
    </div>
  );
}