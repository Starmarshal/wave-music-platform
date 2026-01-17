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
    isShuffleMode,
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
        <div className="!w-full md:!w-[95%] md:!mx-auto !mt-2">
          <div className="!w-full !flex !flex-col sm:!hidden !gap-2">
            <div className="!w-full !flex !items-start !justify-between !gap-2">
              <div className="!flex-1 !min-w-0">
                <PlayerTrackInfo
                  track={currentTrack}
                  albumTracks={albumTracks}
                  currentAlbumIndex={currentAlbumIndex}
                  isAlbumMode={isAlbumMode}
                  isShuffleMode={isShuffleMode}
                />
              </div>

              <div className="!flex-shrink-0 !flex !items-center !gap-1">
                <PlayerControls
                  isPlaying={isPlaying}
                  hasNextTrack={hasNextTrack}
                  hasPrevTrack={hasPrevTrack}
                  onPlayPause={handlePlayPause}
                  onNextTrack={handleNextTrack}
                  onPrevTrack={handlePrevTrack}
                  showNavigation={isAlbumMode || isShuffleMode}
                />
              </div>
            </div>

            {/* ProgressBar посередине */}
            <div className="!w-full">
              <PlayerProgressBar
                currentTime={currentTime}
                duration={duration}
                onTimeChange={handleTimeChange}
                formatTime={formatTime}
              />
            </div>
          </div>

          <div className="!hidden sm:!flex !w-full !flex-col !gap-3 md:!gap-4">
            <div className="!w-full !flex !items-center !justify-between !gap-2 md:!gap-4">
              {/* TrackInfo в левом углу */}
              <div className="!flex-shrink-0">
                <PlayerTrackInfo
                  track={currentTrack}
                  albumTracks={albumTracks}
                  currentAlbumIndex={currentAlbumIndex}
                  isAlbumMode={isAlbumMode}
                  isShuffleMode={isShuffleMode}
                />
              </div>

              <div className="!flex !items-center !gap-2 md:!gap-4">
                <div className="!flex !items-center !justify-center !gap-1 md:!gap-2">
                  <PlayerControls
                    isPlaying={isPlaying}
                    hasNextTrack={hasNextTrack}
                    hasPrevTrack={hasPrevTrack}
                    onPlayPause={handlePlayPause}
                    onNextTrack={handleNextTrack}
                    onPrevTrack={handlePrevTrack}
                    showNavigation={isAlbumMode || isShuffleMode}
                  />
                </div>
              </div>
            </div>

            <div className="!w-full !flex !items-center !gap-2 md:!gap-3 lg:!gap-4">
              <div className="!flex-1 !min-w-0">
                <PlayerProgressBar
                  currentTime={currentTime}
                  duration={duration}
                  onTimeChange={handleTimeChange}
                  formatTime={formatTime}
                />
              </div>

              <div className="!flex-shrink-0 !mb-2.5">
                <PlayerVolumeControl
                  volume={volume}
                  onVolumeChange={handleVolumeChange}
                />
              </div>
            </div>
          </div>
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