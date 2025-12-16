'use client';

import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  Card,
  Typography,
  Button,
  Slider,
  Image,
  Tooltip,
  Popconfirm,
  message
} from 'antd';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import {ITrack} from '@/src/types/track';
import {useRouter} from 'next/navigation';
import {api} from '@/src/shared/api';
import {staticUrl} from '@/src/shared/config';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/src/store/reducers';
import {
  setCurrentTrack,
  setCurrentTrackData,
  playTrack,
  pauseTrack,
  setVolume,
  setCurrentTime,
  setDuration
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

  // Убираем эту логику - FooterPlayer сам управляет воспроизведением

  // Убираем синхронизацию громкости - это делает FooterPlayer

  // Убираем обновление времени - это делает FooterPlayer

  // Убираем воспроизведение из TrackItem - только FooterPlayer воспроизводит
  // TrackItem только управляет состоянием через Redux

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
      // Если это текущий трек, просто пауза/воспроизведение
      if (globalIsPlaying) {
        dispatch(pauseTrack());
      } else {
        dispatch(playTrack());
      }
    } else {
      // Если это другой трек, останавливаем текущий и начинаем новый
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

  // Загружаем метаданные только для получения длительности
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
      style={{
        marginTop: '15px',
        display: 'flex',
        flexDirection: 'column',
        padding: '10px',
        marginBottom: '10px',
        boxShadow: isCurrentTrack ? '0 4px 20px rgba(50, 196, 208, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
        border: isCurrentTrack ? '2px solid #32c4d0' : '1px solid transparent',
        transition: 'all 0.3s ease-in-out',
        transform: isCurrentTrack ? 'scale(1.01)' : 'scale(1)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Image
          style={{
            borderRadius: '1rem',
            border: '1px solid #293A52',
            transition: 'transform 0.3s ease-in-out',
            width: '70px',
            height: '70px',
            transform: isCurrentTrack ? 'scale(1.05)' : 'scale(1)',
          }}
          preview={false}
          width={70}
          src={staticUrl(track.picture)}
        />

        <div style={{flex: 1, marginLeft: '10px'}}>
          <Typography.Title
            level={5}
            style={{
              margin: 0,
              cursor: 'pointer',
              color: isCurrentTrack ? '#32c4d0' : 'inherit',
              transition: 'color 0.3s ease-in-out',
            }}
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
            style={{
              marginLeft: 'auto',
              fontSize: 24,
              transition: 'transform 0.2s ease-in-out',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
        </Popconfirm>

        <audio
          ref={audioRef}
          controls
          style={{display: 'none'}}
        >
          <source
            src={staticUrl(track.audio)}
            type="audio/mpeg"
          />
          Ваш браузер не поддерживает аудиоплеер.
        </audio>
      </div>

      <div style={{display: 'flex', alignItems: 'center', marginTop: '10px'}}>
        <Button
          style={{
            marginRight: '1rem',
            transition: 'transform 0.2s ease-in-out',
          }}
          type="text"
          icon={isPlaying ? (
            <PauseCircleOutlined
              style={{
                fontSize: 24,
                color: isCurrentTrack ? '#32c4d0' : 'inherit',
                transition: 'color 0.3s ease-in-out',
              }}
            />
          ) : (
            <PlayCircleOutlined
              style={{
                fontSize: 24,
                color: isCurrentTrack ? '#32c4d0' : 'inherit',
                transition: 'color 0.3s ease-in-out',
              }}
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
            style={{
              flex: 1,
              transition: 'opacity 0.3s ease-in-out',
              opacity: isCurrentTrack ? 1 : 0.6,
            }}
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
            style={{
              width: '60px',
              marginLeft: '10px',
              transition: 'opacity 0.3s ease-in-out',
            }}
          />
        </Tooltip>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '5px',
          marginLeft: '3rem'
        }}
      >
        <Typography.Text
          style={{
            transition: 'opacity 0.3s ease-in-out',
            opacity: isCurrentTrack ? 1 : 0.6
          }}
        >
          {formatTime(isCurrentTrack ? currentTime : 0)} / {formatTime(duration)}
        </Typography.Text>
      </div>
    </Card>
  );
};

export default TrackItem;
