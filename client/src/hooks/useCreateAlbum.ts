'use client';

import {useEffect, useState} from 'react';
import {message} from 'antd';
import {api, apiError} from '@/src/shared/api';
import {IArtist} from '@/src/types/user';
import {ITrack} from '@/src/types/track';

export default function useCreateAlbum() {
  const [name, setName] = useState('');
  const [artistIds, setArtistIds] = useState<string[]>([]);
  const [artists, setArtists] = useState<IArtist[]>([]);
  const [picture, setPicture] = useState<File | null>(null);
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [tracks, setTracks] = useState<ITrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [tracksLoading, setTracksLoading] = useState(false);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setTracksLoading(true);
        const response = await api.get('/studio');
        setTracks(response.data.tracks);
        setArtists(response.data.artists);
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
    if (!artistIds.length) {
      message.warning('Выберите исполнителей');
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
      artistIds.forEach((id) => formData.append('artistIds', id));
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
      message.error(apiError(error, 'Не удалось создать альбом'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setArtistIds([]);
    setPicture(null);
    setSelectedTracks([]);
  };

  return {
    // Form values
    name,
    artistIds,
    artists,
    picture,
    selectedTracks,
    tracks,

    // Loading states
    loading,
    tracksLoading,

    // Setters
    setName,
    setArtistIds,
    setPicture,
    setSelectedTracks,

    // Methods
    submitForm,
    resetForm,
    validateForm,
  };
}