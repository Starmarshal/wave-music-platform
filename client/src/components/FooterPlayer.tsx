'use client';

import React from 'react';
import usePlayer from '@/src/hooks/usePlayer';
import PlayerContainer from '@/src/components/Player/PlayerContainer';
import PlayerTrackInfo from '@/src/components/Player/PlayerTrackInfo';
import PlayerControls from '@/src/components/Player/PlayerControls';
import PlayerProgressBar from '@/src/components/Player/PlayerProgressBar';
import PlayerVolumeControl from '@/src/components/Player/PlayerVolumeControl';
import PlayerAudio from '@/src/components/Player/PlayerAudio';

const FooterPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    albumTracks,
    currentAlbumIndex,
    isAlbumMode,
    hasNextTrack,
    hasPrevTrack,
    handlePlayPause,
    handleNextTrack,
    handlePrevTrack,
    handleTimeChange,
    handleVolumeChange,
    handleLoadedMetadata,
    handleAudioError,
    handleAudioEnded,
    formatTime,
  } = usePlayer();

  if (!currentTrack) {
    return null;
  }

  return (
    <>
      <PlayerContainer>
        <div className="!w-full sm:!w-auto !flex !items-center !justify-center sm:!justify-start">
          <PlayerTrackInfo
            track={currentTrack}
            albumTracks={albumTracks}
            currentAlbumIndex={currentAlbumIndex}
            isAlbumMode={isAlbumMode}
          />
        </div>

        <div className="!w-full sm:!flex-1 !flex !flex-row !items-center !gap-2 md:!gap-3 !min-w-0 !px-2 md:!px-4">
          <div className="!flex !items-center !justify-center !gap-1 md:!gap-2">
            <PlayerControls
              isPlaying={isPlaying}
              hasNextTrack={hasNextTrack}
              hasPrevTrack={hasPrevTrack}
              onPlayPause={handlePlayPause}
              onNextTrack={handleNextTrack}
              onPrevTrack={handlePrevTrack}
              showNavigation={isAlbumMode}
            />
          </div>

          <div className="!w-full !flex-1">
            <PlayerProgressBar
              currentTime={currentTime}
              duration={duration}
              onTimeChange={handleTimeChange}
              formatTime={formatTime}
            />
          </div>
        </div>

        <div className="!hidden md:!block !flex-shrink-0">
          <PlayerVolumeControl
            volume={volume}
            onVolumeChange={handleVolumeChange}
          />
        </div>
      </PlayerContainer>

      <PlayerAudio
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        volume={volume}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeChange}
        onError={handleAudioError}
        onEnded={handleAudioEnded}
      />
    </>
  );
};

export default FooterPlayer;