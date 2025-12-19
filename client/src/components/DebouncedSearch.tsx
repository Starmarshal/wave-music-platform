'use client';

import { Input } from 'antd';
import { type ChangeEvent, useEffect, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';

interface DebouncedSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceDelay?: number;
  initialValue?: string;
  className?: string;
}

export default function DebouncedSearch({
                                          onSearch,
                                          placeholder = 'Поиск...',
                                          debounceDelay = 300,
                                          initialValue = '',
                                          className = '',
                                        }: DebouncedSearchProps) {
  const [query, setQuery] = useState<string>(initialValue);

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        onSearch(value);
      }, debounceDelay),
    [onSearch, debounceDelay]
  );

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <div className={`!flex !justify-center !items-center !mb-4 md:!mb-5 ${className}`}>
      <Input
        onChange={handleSearch}
        value={query}
        placeholder={placeholder}
        size="large"
        className="!rounded-lg !h-[40px] sm:!h-[45px] !w-full dark:!bg-gray-700 dark:!border-gray-600 dark:!text-gray-200"
      />
    </div>
  );
}