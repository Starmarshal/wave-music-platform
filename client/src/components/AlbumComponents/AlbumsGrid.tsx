'use client';

import {Col, Row} from 'antd';
import {IAlbum} from '@/src/types/album';
import AlbumCard from '@/src/components/AlbumComponents/AlbumCard';
import {useEffect, useMemo, useState} from 'react';
import {ALBUMS_PAGE_LIMIT, ShowMore} from '@/src/components/show-more';

type AlbumsGridProps = {
  albums: IAlbum[];
  onPlayAlbum: (album: IAlbum) => void;
};

export default function AlbumsGrid({albums, onPlayAlbum}: AlbumsGridProps) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [albums]);

  const visibleCount = useMemo(() => page * ALBUMS_PAGE_LIMIT, [page]);
  const visibleAlbums = useMemo(
    () => albums.slice(0, visibleCount),
    [albums, visibleCount],
  );

  const hasMore = visibleAlbums.length < albums.length;

  const handleShowMore = () => {
    if (hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <>
      <Row gutter={[24, 24]}>
        {visibleAlbums.map((album) => (
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

      {hasMore && (
        <div className="flex justify-center mt-4">
          <ShowMore
            onClick={handleShowMore}
            disabled={!hasMore}
          />
        </div>
      )}
    </>
  );
}