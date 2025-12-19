'use client';

import { useState, useEffect } from 'react';
import { api } from '@/src/shared/api';
import { IAlbum } from '@/src/types/album';

export default function useAlbums() {
  const [albums, setAlbums] = useState<IAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        const response = await api.get('/albums');
        setAlbums(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке альбомов');
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  return { albums, loading, error };
}