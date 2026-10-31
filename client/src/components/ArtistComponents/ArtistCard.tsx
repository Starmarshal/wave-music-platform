'use client';

import {Avatar, Card, Typography} from 'antd';
import {useRouter} from 'next/navigation';
import {staticUrl} from '@/src/shared/config';
import LikeButton from '@/src/components/LikeButton';
import {IArtist} from '@/src/types/user';

export default function ArtistCard({artist}: { artist: IArtist }) {
  const router = useRouter();

  return (
    <Card
      hoverable
      onClick={() => router.push(`/artists/${artist.slug}`)}
      className="!rounded-xl !text-center !shadow-md hover:!shadow-xl !h-full dark:!bg-gray-800 dark:!border-gray-700"
    >
      <Avatar
        shape="square"
        size={112}
        src={artist.photo ? staticUrl(artist.photo) : undefined}
        className="!mx-auto !mb-3 !rounded-2xl !bg-gradient-to-br !from-[#32c4d0] !to-blue-500 !text-4xl"
      >
        {artist.name.slice(0, 1).toUpperCase()}
      </Avatar>
      <Typography.Title level={5} className="!mb-0 !truncate dark:!text-gray-200">
        {artist.name}
      </Typography.Title>
      <Typography.Text type="secondary" className="!text-xs dark:!text-gray-400">
        {artist.label?.name ?? 'Артист'}
      </Typography.Text>
      <div className="!mt-1">
        <LikeButton type="artists" id={artist._id} size="small" />
      </div>
    </Card>
  );
}
