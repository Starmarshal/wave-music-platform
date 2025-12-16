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
    hasNextTrack,
    hasPrevTrack,
    handlePlayPause,
    handleNextTrack,
    handlePrevTrack,
    handleTimeChange,
    handleVolumeChange,
    handleLoadedMetadata,
    handleAudioError,
    formatTime,
  } = usePlayer();

  if (!currentTrack) {
    return null;
  }

  return (
    <>
      <PlayerContainer>
        {/* Левая часть: информация о треке */}
        <PlayerTrackInfo
          track={currentTrack}
          albumTracks={albumTracks}
          currentAlbumIndex={currentAlbumIndex}
        />

        {/* Центральная часть: управление и прогресс */}
        <div className="!flex-10 !flex !items-center !gap-2.5 !min-w-0 !max-w-[calc(100%-120px)]">
          {/* Кнопки управления */}
          <div className="!flex !items-center !gap-2.5">
            <PlayerControls
              isPlaying={isPlaying}
              hasNextTrack={hasNextTrack}
              hasPrevTrack={hasPrevTrack}
              onPlayPause={handlePlayPause}
              onNextTrack={handleNextTrack}
              onPrevTrack={handlePrevTrack}
            />
          </div>

          {/* Прогресс бар */}
          <PlayerProgressBar
            currentTime={currentTime}
            duration={duration}
            onTimeChange={handleTimeChange}
            formatTime={formatTime}
          />
        </div>

        {/* Правая часть: громкость */}
        <PlayerVolumeControl
          volume={volume}
          onVolumeChange={handleVolumeChange}
        />
      </PlayerContainer>

      {/* Скрытый аудио элемент */}
      <PlayerAudio
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        volume={volume}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeChange}
        onError={handleAudioError}
      />
    </>
  );
};

export default FooterPlayer;