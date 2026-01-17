'use client';

export const dynamic = 'force-static';

import {useEffect, useState} from 'react';
import Header from '@/src/components/Header';
import {Button, message, Typography} from 'antd';
import {PlayCircleOutlined} from '@ant-design/icons';
import {useAppDispatch} from '@/src/hooks/useAppDispatch';
import {useTypedSelector} from '@/src/hooks/useTypedSelector';
import {fetchTracks} from '@/src/store/action-creators/track';
import {
  playTrack,
  setAlbumTracks,
  setCurrentTrack,
  setCurrentTrackData,
  setShuffleMode,
} from '@/src/store/action-creators/player';
import {trackService} from '@/src/shared/api/trackService';
import {ITrack} from '@/src/types/track';
import Loader from '@/src/components/Loader';

const {Title, Text} = Typography;

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function WavePage() {
  const dispatch = useAppDispatch();
  const {tracks, loading} = useTypedSelector(state => state.track);
  const [shouldStartPlaying, setShouldStartPlaying] = useState(false);

  useEffect(() => {
    if (tracks.length === 0 && !loading) {
      dispatch(fetchTracks());
    }
  }, [dispatch, tracks.length, loading]);

  useEffect(() => {
    if (shouldStartPlaying && tracks.length > 0 && !loading) {
      handleStartPlaying(tracks);
      setShouldStartPlaying(false);
    }
  }, [tracks.length, loading, shouldStartPlaying]);

  const handleStartRandomPlay = () => {
    if (tracks.length === 0) {
      if (!loading) {
        setShouldStartPlaying(true);
        dispatch(fetchTracks());
      }
      return;
    }

    handleStartPlaying(tracks);
  };

  const handleStartPlaying = async (allTracks: ITrack[]) => {
    if (allTracks.length === 0) {
      message.warning('Нет доступных треков для воспроизведения');
      return;
    }

    // Перемешиваем треки
    const shuffledTracks = shuffleArray<ITrack>(allTracks);

    dispatch(setShuffleMode(true));
    dispatch(setAlbumTracks(shuffledTracks));

    // Загружаем данные первого трека
    try {
      const firstTrack = shuffledTracks[0];
      const trackData = await trackService.getTrack(firstTrack._id);

      dispatch(setCurrentTrack(firstTrack._id));
      dispatch(setCurrentTrackData(trackData));
      dispatch(playTrack());

      message.success('Волна запущена');
    } catch (error) {
      console.error('Ошибка при загрузке трека:', error);
      message.error('Не удалось загрузить трек');
    }
  };

  return (
    <>
      <Header />
      <div className="!min-h-[calc(100vh-200px)] !flex !items-center !justify-center !px-4">
        <div className="!text-center !max-w-md !w-full">
          <Title
            level={1}
            className="!mb-4 !text-4xl md:!text-5xl dark:!text-white"
          >
            Волна
          </Title>
          <Text className="!text-lg !mb-8 !block dark:!text-gray-300">
            Нажмите кнопку, чтобы начать воспроизведение случайных треков
          </Text>
          {loading ? (
            <Loader />
          ) : (
            <Button
              type="primary"
              size="large"
              icon={<PlayCircleOutlined />}
              onClick={handleStartRandomPlay}
              className="!bg-[#32c4d0] !border-[#32c4d0] !h-14 !px-8 !text-lg hover:!bg-[#28a5b0] hover:!border-[#28a5b0]"
            >
              Начать воспроизведение
            </Button>
          )}
        </div>
      </div>
    </>
  );
}


