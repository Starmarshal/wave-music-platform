'use client';

import React from 'react';
import {Card} from 'antd';
import {ITrack} from '@/src/types/track';
import useTrackItem from '@/src/hooks/useTrackItem';
import TrackItemImage
  from '@/src/components/TrackItemComponents/TrackItemImage';
import TrackItemInfo from '@/src/components/TrackItemComponents/TrackItemInfo';
import TrackItemDeleteButton
  from '@/src/components/TrackItemComponents/TrackItemDeleteButton';
import TrackItemPlayButton
  from '@/src/components/TrackItemComponents/TrackItemPlayButton';
import TrackItemProgress
  from '@/src/components/TrackItemComponents/TrackItemProgress';
import TrackItemVolume
  from '@/src/components/TrackItemComponents/TrackItemVolume';

interface TrackItemProps {
  track: ITrack;
  onDelete?: () => void;
}

const TrackItem: React.FC<TrackItemProps> = ({track, onDelete}) => {
  const {
    isCurrentTrack,
    isPlaying,
    globalVolume,
    currentTime,
    duration,
    handleDelete,
    handlePlayPause,
    handleTimeChange,
    handleVolumeChange,
    formatTime
  } = useTrackItem(track);

  const handleImageClick = () => {
  };

  const handleDeleteWithCallback = async () => {
    await handleDelete();
    onDelete?.();
  };

  return (
    <Card
      className={`!mt-2 sm:!mt-3 !flex !flex-col !p-3 sm:!p-4 !mb-2 sm:!mb-2.5 !transition-all !duration-300 !ease-in-out !max-w-full !mx-auto dark:!bg-gray-800 dark:!border-gray-700 ${
        isCurrentTrack
          ? '!shadow-lg !border-2 !border-[#32c4d0] dark:!border-cyan-400 !bg-gradient-to-r !from-[#f0f9fa] !to-white dark:!from-gray-800 dark:!to-gray-700'
          : '!shadow-md !border !border-gray-200 dark:!border-gray-700 !bg-white dark:!bg-gray-800 hover:!shadow-lg'
      }`}
    >
      <div className="!flex !items-center !gap-3 !w-full">
        <div className="!flex-shrink-0">
          <TrackItemImage
            picture={track.picture}
            isCurrentTrack={isCurrentTrack}
            onClick={handleImageClick}
          />
        </div>

        <div className="!flex-1 !min-w-0 !flex !flex-col !justify-center">
          <TrackItemInfo
            trackId={track._id}
            name={track.name}
            artist={track.artist}
            isCurrentTrack={isCurrentTrack}
            listens={track.listens}
          />
        </div>

        <div className="!flex-shrink-0 !hidden sm:!block">
          <TrackItemDeleteButton
            onDelete={handleDeleteWithCallback}
          />
        </div>
      </div>

      <div className="!flex !items-center !gap-3 !mt-3 !w-full">
        <TrackItemPlayButton
          isCurrentTrack={isCurrentTrack}
          isPlaying={isPlaying}
          onClick={handlePlayPause}
        />

        <div className="!flex-1 !min-w-0">
          <TrackItemProgress
            isCurrentTrack={isCurrentTrack}
            currentTime={currentTime}
            duration={duration}
            onTimeChange={handleTimeChange}
            formatTime={formatTime}
          />
        </div>

        <div className="!hidden sm:!block !flex-shrink-0">
          <TrackItemVolume
            volume={globalVolume}
            onVolumeChange={handleVolumeChange}
          />
        </div>
      </div>
    </Card>
  );
};

export default TrackItem;