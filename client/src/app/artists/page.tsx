'use client';

import {useEffect, useState} from 'react';
import {Col, Empty, Row, Typography} from 'antd';
import Header from '@/src/components/Header';
import Loader from '@/src/components/Loader';
import DebouncedSearch from '@/src/components/DebouncedSearch';
import ArtistCard from '@/src/components/ArtistComponents/ArtistCard';
import {api} from '@/src/shared/api';
import {IArtist} from '@/src/types/user';

export default function ArtistsPage() {
  const [artists, setArtists] = useState<IArtist[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get('/artists', {params: query ? {query} : {}})
      .then(({data}) => setArtists(data))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <>
      <Header />
      <div className="!max-w-[1200px] !mx-auto !px-3 sm:!px-5 !py-6 !mb-10">
        <Typography.Title
          level={2}
          className="!text-[#32c2ce] dark:!text-cyan-400 !font-bold !text-xl sm:!text-2xl md:!text-3xl"
        >
          Артисты
        </Typography.Title>
        <div className="!mb-6">
          <DebouncedSearch onSearch={setQuery} placeholder="Поиск артистов..." />
        </div>
        {loading ? <Loader /> : artists.length === 0 ? (
          <Empty description="Артисты не найдены" />
        ) : (
          <Row gutter={[16, 16]}>
            {artists.map((artist) => (
              <Col key={artist._id} xs={12} sm={8} md={6} lg={4}>
                <ArtistCard artist={artist} />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </>
  );
}
