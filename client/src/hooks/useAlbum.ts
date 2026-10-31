'use client';

import {useEffect, useState} from 'react';
import {api} from '@/src/shared/api';
import {IAlbum} from '@/src/types/album';
import {IComment} from '@/src/types/track';

type CommentType = IComment;

type AlbumType = IAlbum & {
  comments?: CommentType[];
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

  const addComment = async (values: { text: string }) => {
    try {
      const response = await api.post(`/albums/comment`, {
        text: values.text,
        albumId: album?._id,
      });

      const newComment = response.data;
      setComments([...comments, newComment]);
      if (album) {
        setAlbum({
          ...album,
          comments: [...(album.comments || []), newComment],
        });
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  };

  const deleteComment = async (commentId: string) => {
    await api.delete(`/comments/${commentId}`);
    setComments(prev => prev.filter(comment => comment._id !== commentId));
    if (album) {
      setAlbum({
        ...album,
        comments: (album.comments || []).filter((comment: CommentType) => comment._id !== commentId),
      } as typeof album);
    }
  };

  return {
    album,
    loading,
    comments,
    addComment,
    deleteComment,
    setAlbum,
  };
}