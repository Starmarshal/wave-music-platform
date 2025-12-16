'use client';

import {useState, useEffect} from 'react';
import {message} from 'antd';
import {api} from '@/src/shared/api';
import {ITrack} from '@/src/types/track';

export default function useCreateAlbum() {
  const [name, setName] = useState('');
  const [author, setAuthor] = useState('');
  const [picture, setPicture] = useState<File | null>(null);
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [tracks, setTracks] = useState<ITrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [tracksLoading, setTracksLoading] = useState(false);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setTracksLoading(true);
        const response = await api.get('/tracks');
        setTracks(response.data);
      } catch (error) {
        console.error('Ошибка загрузки треков:', error);
        message.error('Не удалось загрузить список треков');
      } finally {
        setTracksLoading(false);
      }
    };

    fetchTracks();
  }, []);

  const validateForm = (): boolean => {
    if (!name.trim()) {
      message.warning('Введите название альбома');
      return false;
    }
    if (!author.trim()) {
      message.warning('Введите автора альбома');
      return false;
    }
    if (selectedTracks.length === 0) {
      message.warning('Выберите хотя бы один трек');
      return false;
    }
    if (!picture) {
      message.warning('Загрузите обложку альбома');
      return false;
    }
    return true;
  };

  const submitForm = async (): Promise<boolean> => {
    if (!validateForm()) {
      return false;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', name);
      formData.append('author', author);
      selectedTracks.forEach((trackId) => {
        formData.append('tracks', trackId);
      });
      if (picture) formData.append('picture', picture);

      await api.post('/albums', formData, {
        headers: {'Content-Type': 'multipart/form-data'}
      });

      message.success('Альбом успешно создан');
      return true;
    } catch (error) {
      console.error('Ошибка создания альбома:', error);
      message.error('Не удалось создать альбом');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setAuthor('');
    setPicture(null);
    setSelectedTracks([]);
  };

  return {
    // Form values
    name,
    author,
    picture,
    selectedTracks,
    tracks,

    // Loading states
    loading,
    tracksLoading,

    // Setters
    setName,
    setAuthor,
    setPicture,
    setSelectedTracks,

    // Methods
    submitForm,
    resetForm,
    validateForm,
  };
}