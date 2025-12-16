'use client';

import TrackList from '@/src/components/TrackComponents/TrackList';

type TracksContentProps = {
  children?: React.ReactNode;
};

export default function TracksContent({children}: TracksContentProps) {
  return (
    <div
      className="!bg-white !rounded-xl !p-5"
    >
      {children || <TrackList />}
    </div>
  );
}