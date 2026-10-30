import { Track } from '../track/entities/track.entity';
import { Comment } from '../track/entities/comment.entity';
import { Album } from '../album/entities/album.entity';

// Ответы API сохраняют формат времён MongoDB (поле _id, вложенные comments/tracks),
// чтобы фронтенд работал без изменений

export const serializeComment = (comment: Comment) => ({
  _id: comment.id,
  username: comment.username,
  text: comment.text,
});

// populateComments = true — комментарии целиком (как populate), иначе только их id
export const serializeTrack = (track: Track, populateComments = false) => {
  const comments = [...(track.comments ?? [])].sort(
    (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
  );
  return {
    _id: track.id,
    name: track.name,
    artist: track.artist,
    text: track.text,
    listens: track.listens,
    picture: track.picture,
    audio: track.audio,
    comments: populateComments
      ? comments.map(serializeComment)
      : comments.map((comment) => comment.id),
  };
};

export const serializeAlbum = (album: Album) => ({
  _id: album.id,
  name: album.name,
  author: album.author,
  picture: album.picture,
  tracks: [...(album.albumTracks ?? [])]
    .sort((a, b) => a.position - b.position)
    .map((albumTrack) => serializeTrack(albumTrack.track)),
  comments: [...(album.comments ?? [])]
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    .map(serializeComment),
});
