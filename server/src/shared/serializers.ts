import { Track } from '../track/entities/track.entity';
import { Comment } from '../track/entities/comment.entity';
import { Album } from '../album/entities/album.entity';
import { Artist } from '../artists/entities/artist.entity';
import { Playlist } from '../playlists/entities/playlist.entity';

// Ответы API сохраняют формат времён MongoDB (поле _id, вложенные comments/tracks),
// чтобы фронтенд работал без изменений

// Связи, которые нужны serializeTrack
export const TRACK_RELATIONS = {
  comments: { user: true },
  trackArtists: { artist: true },
} as const;

export const serializeComment = (comment: Comment) => ({
  _id: comment.id,
  // У старых гостевых комментариев пользователя нет, остаётся введённое имя
  username: comment.user?.displayName ?? comment.username,
  text: comment.text,
  userId: comment.userId ?? null,
  guest: !comment.userId,
  createdAt: comment.createdAt,
});

export const serializeArtistRef = (artist: Artist) => ({
  _id: artist.id,
  name: artist.name,
  slug: artist.slug,
});

const byPosition = (a: { position: number }, b: { position: number }) =>
  a.position - b.position;

const byCreatedAt = (a: Comment, b: Comment) =>
  a.createdAt.getTime() - b.createdAt.getTime();

// populateComments = true — комментарии целиком (как populate), иначе только их id
export const serializeTrack = (track: Track, populateComments = false) => {
  const comments = [...(track.comments ?? [])].sort(byCreatedAt);
  return {
    _id: track.id,
    name: track.name,
    artist: track.artist,
    artists: [...(track.trackArtists ?? [])]
      .sort(byPosition)
      .filter((trackArtist) => trackArtist.artist)
      .map((trackArtist) => serializeArtistRef(trackArtist.artist)),
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
  artists: [...(album.albumArtists ?? [])]
    .sort(byPosition)
    .filter((albumArtist) => albumArtist.artist)
    .map((albumArtist) => serializeArtistRef(albumArtist.artist)),
  picture: album.picture,
  tracks: [...(album.albumTracks ?? [])]
    .sort(byPosition)
    .map((albumTrack) => serializeTrack(albumTrack.track)),
  comments: [...(album.comments ?? [])].sort(byCreatedAt).map(serializeComment),
});

export const serializeArtist = (artist: Artist) => ({
  ...serializeArtistRef(artist),
  bio: artist.bio,
  photo: artist.photo,
  label: artist.label
    ? { _id: artist.label.id, name: artist.label.name }
    : null,
});

export const serializePlaylist = (playlist: Playlist, withTracks = false) => {
  const playlistTracks = [...(playlist.playlistTracks ?? [])].sort(byPosition);
  return {
    _id: playlist.id,
    name: playlist.name,
    description: playlist.description,
    cover: playlist.cover,
    isPublic: playlist.isPublic,
    owner: playlist.owner
      ? { _id: playlist.owner.id, displayName: playlist.owner.displayName }
      : { _id: playlist.ownerId },
    artist: playlist.artist ? serializeArtistRef(playlist.artist) : null,
    tracksCount: playlistTracks.length,
    tracks: withTracks
      ? playlistTracks
          .filter((playlistTrack) => playlistTrack.track)
          .map((playlistTrack) => serializeTrack(playlistTrack.track))
      : undefined,
    createdAt: playlist.createdAt,
    updatedAt: playlist.updatedAt,
  };
};
