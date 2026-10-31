import {IComment, ITrack} from './track';
import {IArtistRef} from './user';

export interface IAlbum {
  _id: string;
  name: string;
  author: string;
  artists?: IArtistRef[];
  picture: string;
  tracks: ITrack[];
  comments?: IComment[];
}

export interface IPlaylist {
  _id: string;
  name: string;
  description: string;
  cover: string;
  isPublic: boolean;
  owner: { _id: string; displayName?: string };
  artist: IArtistRef | null;
  tracksCount: number;
  tracks?: ITrack[];
  canEdit?: boolean;
  createdAt: string;
  updatedAt: string;
}
