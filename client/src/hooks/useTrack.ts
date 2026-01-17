'use client';

import {useEffect, useState} from 'react';
import {api} from '@/src/shared/api';
import {ITrack} from '@/src/types/track';

type CommentType = {
  username: string;
  text: string;
  _id?: string;
};

type TrackType = ITrack & {
  duration?: number;
  album?: {
    name: string;
  };
};

export default function useTrack(id: string | undefined) {
  const [track, setTrack] = useState<TrackType | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<CommentType[]>([]);

  useEffect(() => {
    const fetchTrack = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/tracks/${id}`);
        setTrack(response.data);
        setComments(response.data.comments || []);
      } catch (error) {
        console.error('Ошибка загрузки трека:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrack();
  }, [id]);

  const addComment = async (values: { username: string; text: string }) => {
    try {
      const response = await api.post(`/tracks/comment`, {
        ...values,
        trackId: track?._id,
      });

      const newComment = response.data;
      setComments([...comments, newComment]);
      if (track) {
        setTrack({
          ...track,
          comments: [...(track.comments || []), newComment],
        });
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  };

  return {
    track,
    loading,
    comments,
    addComment,
    setTrack,
  };
}

// Экспорт для списка треков (если понадобится)
export type {TrackType};

export function useTracks() {
  const [tracks, setTracks] = useState<TrackType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await api.get('/tracks');
        setTracks(response.data);
        setError(null);
      } catch (error) {
        console.error('Ошибка загрузки треков:', error);
        setError('Ошибка при загрузке треков');
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  return {
    tracks,
    loading,
    error,
    setTracks,
  };
}
