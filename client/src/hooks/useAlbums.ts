'use client';

import {useEffect, useState} from 'react';
import {api} from '@/src/shared/api';
import {IAlbum} from '@/src/types/album';
import {message} from 'antd';

export default function useAlbums() {
  const [albums, setAlbums] = useState<IAlbum[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await api.get('/albums');
        setAlbums(response.data);
      } catch (error) {
        console.error('Ошибка загрузки альбомов:', error);
        message.error('Не удалось загрузить альбомы');
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  return {
    albums,
    loading,
    setAlbums,
  };
}