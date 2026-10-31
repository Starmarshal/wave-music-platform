'use client';

import {Card, Tag, Typography} from 'antd';
import {CustomerServiceOutlined, LockOutlined} from '@ant-design/icons';
import {useRouter} from 'next/navigation';
import {staticUrl} from '@/src/shared/config';
import {IPlaylist} from '@/src/types/album';

export default function PlaylistCard({playlist}: { playlist: IPlaylist }) {
  const router = useRouter();

  return (
    <Card
      hoverable
      onClick={() => router.push(`/playlists/${playlist._id}`)}
      className="!rounded-xl !overflow-hidden !shadow-md hover:!shadow-xl !h-full dark:!bg-gray-800 dark:!border-gray-700"
      cover={
        <div className="!aspect-square !w-full !overflow-hidden !bg-gradient-to-br !from-[#32c4d0] !to-indigo-500 !flex !items-center !justify-center">
          {playlist.cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={staticUrl(playlist.cover)} alt={playlist.name} className="!w-full !h-full !object-cover" />
          ) : (
            <CustomerServiceOutlined className="!text-5xl !text-white/90" />
          )}
        </div>
      }
    >
      <Typography.Text strong className="!block !truncate dark:!text-gray-200">
        {!playlist.isPublic && <LockOutlined className="!mr-1 !text-gray-400" />}
        {playlist.name}
      </Typography.Text>
      <Typography.Text type="secondary" className="!text-xs dark:!text-gray-400">
        {playlist.artist ? <Tag color="cyan" className="!text-[10px]">{playlist.artist.name}</Tag> : playlist.owner.displayName}
        {' · '}{playlist.tracksCount} тр.
      </Typography.Text>
    </Card>
  );
}
