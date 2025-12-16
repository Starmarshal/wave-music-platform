// src/shared/api/trackService.ts
import { api } from '../api';

export const trackService = {
  // Увеличить счетчик прослушиваний
  incrementListenCount: async (trackId: string) => {
    try {
      const response = await api.post(`/tracks/listen/${trackId}`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при увеличении счетчика прослушиваний:', error);
      throw error;
    }
  },

  // Получить информацию о треке
  getTrack: async (trackId: string) => {
    try {
      const response = await api.get(`/tracks/${trackId}`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении трека:', error);
      throw error;
    }
  },

  // Получить треки по ID альбома
  getTracksByAlbum: async (albumId: string) => {
    try {
      const response = await api.get(`/tracks?album=${albumId}`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении треков альбома:', error);
      throw error;
    }
  }
};