'use client';

import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {api} from '@/src/shared/api';
import {IUser, LikeType, Role, ROLE_LEVEL} from '@/src/types/user';

type LikeIds = Record<LikeType, Set<string>>;

const emptyLikes = (): LikeIds => ({
  tracks: new Set(),
  albums: new Set(),
  artists: new Set(),
  playlists: new Set(),
});

type AuthContextValue = {
  user: IUser | null;
  loading: boolean;
  // Пароль введён, ждём код 2FA
  mfaPending: boolean;
  refresh: () => Promise<IUser | null>;
  setUser: (user: IUser | null) => void;
  logout: (everywhere?: boolean) => Promise<void>;
  hasRole: (role: Role) => boolean;
  likes: LikeIds;
  isLiked: (type: LikeType, id: string) => boolean;
  toggleLike: (type: LikeType, id: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({children}: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mfaPending, setMfaPending] = useState(false);
  const [likes, setLikes] = useState<LikeIds>(emptyLikes);

  const refresh = useCallback(async () => {
    try {
      const {data} = await api.get('/auth/me');
      setUser(data.user);
      setMfaPending(data.mfaPending);
      return data.user as IUser | null;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Лайки нужны только вошедшему пользователю с подтверждённой почтой
  useEffect(() => {
    if (!user?.emailVerified) {
      setLikes(emptyLikes());
      return;
    }
    api.get('/likes/ids').then(({data}) => {
      setLikes({
        tracks: new Set(data.tracks),
        albums: new Set(data.albums),
        artists: new Set(data.artists),
        playlists: new Set(data.playlists),
      });
    }).catch(() => setLikes(emptyLikes()));
  }, [user?._id, user?.emailVerified]);

  const logout = useCallback(async (everywhere = false) => {
    await api.post('/auth/logout', {everywhere});
    setUser(null);
    setMfaPending(false);
  }, []);

  const hasRole = useCallback(
    (role: Role) => !!user && ROLE_LEVEL[user.role] >= ROLE_LEVEL[role],
    [user],
  );

  const isLiked = useCallback(
    (type: LikeType, id: string) => likes[type].has(id),
    [likes],
  );

  // Оптимистично меняем сердечко, при ошибке откатываем
  const toggleLike = useCallback(async (type: LikeType, id: string) => {
    const liked = likes[type].has(id);
    const update = (add: boolean) => setLikes(prev => {
      const next = new Set(prev[type]);
      if (add) next.add(id); else next.delete(id);
      return {...prev, [type]: next};
    });
    update(!liked);
    try {
      if (liked) await api.delete(`/likes/${type}/${id}`);
      else await api.put(`/likes/${type}/${id}`);
      return !liked;
    } catch (error) {
      update(liked);
      throw error;
    }
  }, [likes]);

  const value = useMemo(() => ({
    user, loading, mfaPending, refresh, setUser, logout, hasRole, likes, isLiked, toggleLike,
  }), [user, loading, mfaPending, refresh, logout, hasRole, likes, isLiked, toggleLike]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
