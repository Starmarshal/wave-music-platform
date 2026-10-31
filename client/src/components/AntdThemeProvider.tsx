'use client';

import React, {useEffect, useState} from 'react';
import {ConfigProvider, theme} from 'antd';
import ruRU from 'antd/locale/ru_RU';

// Тёмная тема antd по системной настройке — так же, как ThemeSync переключает класс dark для Tailwind
export default function AntdThemeProvider({children}: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setDark(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setDark(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <ConfigProvider
      locale={ruRU}
      theme={{algorithm: dark ? theme.darkAlgorithm : theme.defaultAlgorithm}}
    >
      {children}
    </ConfigProvider>
  );
}
