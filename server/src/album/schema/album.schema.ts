import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { Track } from '../../track/schemas/track.schema';

export type AlbumDocument = HydratedDocument<Album>;

@Schema()
export class Album {
  @Prop()
  name: string;

  @Prop()
  author: string;

  @Prop()
  picture: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Track' }] })
  tracks: Track[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] })
  comments: mongoose.Types.ObjectId[];
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
