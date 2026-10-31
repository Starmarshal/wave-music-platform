export type Role = 'user' | 'label' | 'admin';

export interface IUser {
  _id: string;
  email: string;
  displayName: string;
  role: Role;
  emailVerified: boolean;
  totpEnabled: boolean;
  label: { _id: string; name: string } | null;
}

export interface IArtistRef {
  _id: string;
  name: string;
  slug: string;
}

export interface IArtist extends IArtistRef {
  bio: string;
  photo: string;
  label: { _id: string; name: string } | null;
  monthlyListeners?: number;
  monthlyListens?: number;
}

export type LikeType = 'tracks' | 'albums' | 'artists' | 'playlists';

// Каждая следующая роль включает права предыдущей
export const ROLE_LEVEL: Record<Role, number> = {user: 0, label: 1, admin: 2};

export const ROLE_NAMES: Record<Role, string> = {
  user: 'Пользователь',
  label: 'Лейбл',
  admin: 'Администратор',
};
