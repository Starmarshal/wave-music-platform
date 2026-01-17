'use client';

import TrackList from '@/src/components/TrackComponents/TrackList';

type TracksContentProps = {
  children?: React.ReactNode;
};

export default function TracksContent({children}: TracksContentProps) {
  return (
    <div
      className="!bg-white/0 dark:!bg-gray-500/0 !border-none !border-white/30 dark:!border-gray-700/20 !rounded-xl !p-5"
    >
      {children || <TrackList tracks={[]} />}
    </div>
  );
}