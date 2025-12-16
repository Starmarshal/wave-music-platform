'use client';

import {useEffect, useState} from 'react';
import {api} from '@/src/shared/api';

type CommentType = {
  username: string;
  text: string;
  _id: string;
};

type TrackType = {
  _id: string;
  name: string;
  artist: string;
  listens: number;
  picture: string;
  audio: string;
  duration: number;
};

type AlbumType = {
  _id: string;
  name: string;
  author: string;
  picture: string;
  tracks: TrackType[];
  comments: CommentType[];
  description?: string;
  releaseDate?: string;
};

export default function useAlbum(id: string | undefined) {
  const [album, setAlbum] = useState<AlbumType | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<CommentType[]>([]);

  useEffect(() => {
    const fetchAlbum = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/albums/${id}`);
        setAlbum(response.data);
        setComments(response.data.comments || []);
      } catch (error) {
        console.error('Ошибка загрузки альбома:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [id]);

  const addComment = async (values: {username: string; text: string}) => {
    try {
      const response = await api.post(`/albums/comment`, {
        ...values,
        albumId: id,
      });

      const newComment = response.data;
      setComments([...comments, newComment]);
      if (album) {
        setAlbum({
          ...album,
          comments: [...album.comments, newComment],
        });
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  };

  return {
    album,
    loading,
    comments,
    addComment,
    setAlbum,
  };
}