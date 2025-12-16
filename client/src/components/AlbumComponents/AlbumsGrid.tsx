'use client';

import {Row, Col} from 'antd';
import {IAlbum} from '@/src/types/album';
import AlbumCard from '@/src/components/AlbumComponents/AlbumCard';

type AlbumsGridProps = {
  albums: IAlbum[];
  onPlayAlbum: (album: IAlbum) => void;
};

export default function AlbumsGrid({albums, onPlayAlbum}: AlbumsGridProps) {
  return (
    <Row gutter={[24, 24]}>
      {albums.map((album) => (
        <Col
          xs={24}
          sm={12}
          md={8}
          lg={6}
          key={album._id}
        >
          <AlbumCard
            album={album}
            onPlayAlbum={onPlayAlbum}
          />
        </Col>
      ))}
    </Row>
  );
}