import {ITrack} from './track';

export interface IAlbum {
  _id: string;
  name: string;
  author: string;
  picture: string;
  tracks: ITrack[];
}

