import { ObjectId } from 'mongoose';

export class CreateAlbumCommentDTO {
  readonly username: string;
  readonly text: string;
  readonly albumId: ObjectId;
}
