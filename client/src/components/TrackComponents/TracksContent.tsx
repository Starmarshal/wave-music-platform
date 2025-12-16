'use client';

import TrackList from '@/src/components/TrackComponents/TrackList';

type TracksContentProps = {
  children?: React.ReactNode;
};

export default function TracksContent({children}: TracksContentProps) {
  return (
    <div
      style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '20px'
      }}
    >
      {children || <TrackList />}
    </div>
  );
}