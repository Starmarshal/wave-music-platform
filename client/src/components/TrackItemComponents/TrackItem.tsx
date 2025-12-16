'use client';

import React from 'react';
import {Card} from 'antd';
import {ITrack} from '@/src/types/track';
import useTrackItem from '@/src/hooks/useTrackItem';
import TrackItemImage from '@/src/components/TrackItemComponents/TrackItemImage';
import TrackItemInfo from '@/src/components/TrackItemComponents/TrackItemInfo';
import TrackItemDeleteButton
  from '@/src/components/TrackItemComponents/TrackItemDeleteButton';
import TrackItemPlayButton
  from '@/src/components/TrackItemComponents/TrackItemPlayButton';
import TrackItemProgress
  from '@/src/components/TrackItemComponents/TrackItemProgress';
import TrackItemVolume from '@/src/components/TrackItemComponents/TrackItemVolume';
import TrackItemAudio from '@/src/components/TrackItemComponents/TrackItemAudio';

interface TrackItemProps {
  track: ITrack;
  onDelete: () => void;
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
    handleAudioLoadedMetadata,
    handleAudioEnded,
    formatTime
  } = useTrackItem(track);

  const handleImageClick = () => {
    // Можно добавить обработчик клика по изображению
  };

  const handleDeleteWithCallback = async () => {
    await handleDelete();
    onDelete();
  };

  return (
    <Card
      className={`!mt-3.5 !flex !flex-col !p-2.5 !mb-2.5 !transition-all !duration-300 !ease-in-out ${
        isCurrentTrack
          ? '!shadow-xl !border-2 !border-[#32c4d0] !scale-[1.01]'
          : '!shadow-lg !border-transparent !scale-100'
      }`}
    >
      <div className="!flex !justify-between !items-center">
        <TrackItemImage
          picture={track.picture}
          isCurrentTrack={isCurrentTrack}
          onClick={handleImageClick}
        />

        <TrackItemInfo
          trackId={track._id}
          name={track.name}
          artist={track.artist}
          isCurrentTrack={isCurrentTrack}
          listens={track.listens}
        />

        <TrackItemDeleteButton
          onDelete={handleDeleteWithCallback}
        />
      </div>

      <div className="!flex !items-center !mt-2.5">
        <TrackItemPlayButton
          isCurrentTrack={isCurrentTrack}
          isPlaying={isPlaying}
          onClick={handlePlayPause}
        />

        <TrackItemProgress
          isCurrentTrack={isCurrentTrack}
          currentTime={currentTime}
          duration={duration}
          onTimeChange={handleTimeChange}
          formatTime={formatTime}
        />

        <TrackItemVolume
          volume={globalVolume}
          onVolumeChange={handleVolumeChange}
        />
      </div>

      <TrackItemAudio
        audioUrl={track.audio}
        isCurrentTrack={isCurrentTrack}
        volume={globalVolume}
        currentTime={currentTime}
        onTimeUpdate={handleTimeChange}
        onLoadedMetadata={handleAudioLoadedMetadata}
        onEnded={handleAudioEnded}
      />
    </Card>
  );
};

export default TrackItem;