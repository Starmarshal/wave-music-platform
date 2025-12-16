'use client';

import {useEffect, useState} from 'react';
import {api} from '@/src/shared/api';

type CommentType = {
  username: string;
  text: string;
  _id?: string;
};

type TrackType = {
  _id: string;
  name: string;
  artist: string;
  listens: number;
  picture: string;
  audio: string;
  duration: number;
  text: string;
  comments: CommentType[];
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

  const addComment = async (values: {username: string; text: string}) => {
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
          comments: [...track.comments, newComment],
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