'use client';

import React, {useEffect, useRef, useState} from 'react';
import {
  Button,
  Card,
  Image,
  message,
  Popconfirm,
  Slider,
  Tooltip,
  Typography
} from 'antd';
import {
  DeleteOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined
} from '@ant-design/icons';
import {ITrack} from '@/src/types/track';
import {useRouter} from 'next/navigation';
import {api} from '@/src/shared/api';
import {staticUrl} from '@/src/shared/config';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/src/store/reducers';
import {
  pauseTrack,
  playTrack,
  setCurrentTime,
  setCurrentTrack,
  setCurrentTrackData,
  setDuration,
  setVolume
} from '@/src/store/action-creators/player';

interface TrackItemProps {
  track: ITrack;
  onDelete: () => void;
}

const TrackItem: React.FC<TrackItemProps> = ({track, onDelete}) => {
  const dispatch = useDispatch();
  const {
    currentTrackId,
    isPlaying: globalIsPlaying,
    volume: globalVolume,
    currentTime,
    duration
  } = useSelector((state: RootState) => state.player);
  const router = useRouter();

  const [hasBeenPlayed, setHasBeenPlayed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isCurrentTrack = currentTrackId === track._id;
  const isPlaying = isCurrentTrack && globalIsPlaying;

  const handleDelete = async () => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (isCurrentTrack) {
        dispatch(setCurrentTrack(null));
      }
      await api.delete(`/tracks/${track._id}`);
      message.success('Трек удалён');
      onDelete();
    } catch (error) {
      console.error('Ошибка при удалении трека:', error);
      message.error('Не удалось удалить трек');
    }
  };

  const handlePlayPause = () => {
    if (isCurrentTrack) {
      if (globalIsPlaying) {
        dispatch(pauseTrack());
      } else {
        dispatch(playTrack());
      }
    } else {
      dispatch(setCurrentTrack(track._id));
      dispatch(setCurrentTrackData(track));
      dispatch(playTrack());
    }

    if (!hasBeenPlayed && !isCurrentTrack) {
      setHasBeenPlayed(true);
      api.post(`/tracks/listen/${track._id}`)
        .then(() => {
          console.log('Количество прослушиваний увеличено');
        })
        .catch((error) => {
          console.error('Ошибка при увеличении количества прослушиваний:', error);
        });
    }
  };

  const handleSliderChange = (value: number) => {
    if (audioRef.current && isCurrentTrack) {
      audioRef.current.currentTime = value;
      dispatch(setCurrentTime(value));
    }
  };

  const handleVolumeChange = (value: number) => {
    dispatch(setVolume(value));
  };

  const handleAudioLoadedMetadata = () => {
    if (audioRef.current && isCurrentTrack) {
      dispatch(setDuration(audioRef.current.duration));
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (audioRef.current && isCurrentTrack) {
      audioRef.current.addEventListener('loadedmetadata', handleAudioLoadedMetadata);
      audioRef.current.addEventListener('ended', () => {
        dispatch(setCurrentTrack(null));
        dispatch(setCurrentTrackData(null));
        dispatch(setCurrentTime(0));
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('loadedmetadata', handleAudioLoadedMetadata);
      }
    };
  }, [isCurrentTrack, dispatch]);

  return (
    <Card
      className={`!mt-3.5 !flex !flex-col !p-2.5 !mb-2.5 !transition-all !duration-300 !ease-in-out ${
        isCurrentTrack
          ? '!shadow-xl !border-2 !border-[#32c4d0] !scale-[1.01]'
          : '!shadow-lg !border-transparent !scale-100'
      }`}
    >
      <div
        className="!flex !justify-between !items-center"
      >
        <Image
          className={`!rounded-2xl !border !border-[#293A52] !transition-transform !duration-300 !ease-in-out !w-[70px] !h-[70px] ${
            isCurrentTrack ? '!scale-105' : '!scale-100'
          }`}
          preview={false}
          width={70}
          src={staticUrl(track.picture)}
        />

        <div className="!flex-1 !ml-2.5">
          <Typography.Title
            level={5}
            className={`!m-0 !cursor-pointer !transition-colors !duration-300 !ease-in-out ${
              isCurrentTrack ? '!text-[#32c4d0]' : ''
            }`}
            onClick={() => router.push('/tracks/' + track._id)}
          >
            {track.name}
          </Typography.Title>
          <Typography.Text type="secondary">{track.artist}</Typography.Text>
        </div>

        <Popconfirm
          title="Удалить трек?"
          description="Это действие нельзя отменить"
          okText="Удалить"
          cancelText="Отмена"
          onConfirm={handleDelete}
        >
          <Button
            icon={<DeleteOutlined />}
            type="text"
            className="!ml-auto !text-2xl !transition-transform !duration-200 !ease-in-out"
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
        </Popconfirm>

        <audio
          ref={audioRef}
          controls
          className="!hidden"
        >
          <source
            src={staticUrl(track.audio)}
            type="audio/mpeg"
          />
          Ваш браузер не поддерживает аудиоплеер.
        </audio>
      </div>

      <div className="!flex !items-center !mt-2.5">
        <Button
          className="!mr-4 !transition-transform !duration-200 !ease-in-out"
          type="text"
          icon={isPlaying ? (
            <PauseCircleOutlined
              className={`!text-2xl !transition-colors !duration-300 !ease-in-out ${
                isCurrentTrack ? '!text-[#32c4d0]' : ''
              }`}
            />
          ) : (
            <PlayCircleOutlined
              className={`!text-2xl !transition-colors !duration-300 !ease-in-out ${
                isCurrentTrack ? '!text-[#32c4d0]' : ''
              }`}
            />
          )}
          onClick={handlePlayPause}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />

        <Tooltip
          title={formatTime(isCurrentTrack ? currentTime : 0)}
          placement="top"
        >
          <Slider
            tooltip={{formatter: null}}
            value={isCurrentTrack ? currentTime : 0}
            max={isCurrentTrack ? duration : 0}
            onChange={handleSliderChange}
            disabled={!isCurrentTrack}
            className={`!flex-1 !transition-opacity !duration-300 !ease-in-out ${
              isCurrentTrack ? '!opacity-100' : '!opacity-60'
            }`}
          />
        </Tooltip>

        <Tooltip
          title={`Громкость: ${Math.round(globalVolume * 100)}%`}
          placement="top"
        >
          <Slider
            tooltip={{formatter: null}}
            value={globalVolume}
            min={0}
            max={1}
            step={0.01}
            onChange={handleVolumeChange}
            className="!w-[60px] !ml-2.5 !transition-opacity !duration-300 !ease-in-out"
          />
        </Tooltip>
      </div>

      <div
        className="!flex !justify-between !mt-1.5 !ml-12"
      >
        <Typography.Text
          className={`!transition-opacity !duration-300 !ease-in-out ${
            isCurrentTrack ? '!opacity-100' : '!opacity-60'
          }`}
        >
          {formatTime(isCurrentTrack ? currentTime : 0)} / {formatTime(duration)}
        </Typography.Text>
      </div>
    </Card>
  );
};

export default TrackItem;