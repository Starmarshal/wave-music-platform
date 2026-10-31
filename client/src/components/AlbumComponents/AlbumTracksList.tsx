'use client';

import {Button, Card, Flex, Tooltip, Typography} from 'antd';
import {
  PauseCircleFilled,
  PauseCircleOutlined,
  PlayCircleFilled,
  PlayCircleOutlined,
  RetweetOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import {useRouter} from 'next/navigation';
import {useDispatch, useSelector} from 'react-redux';
import ArtistLinks from '@/src/components/ArtistLinks';
import usePlayQueue, {useQueueControls} from '@/src/hooks/usePlayQueue';
import {pauseTrack, playTrack} from '@/src/store/action-creators/player';
import {RootState} from '@/src/store/reducers';
import {ITrack} from '@/src/types/track';

type AlbumTracksListProps = {
  albumId: string;
  albumName: string;
  tracks: ITrack[];
};

const toggleClass = (active: boolean) => active
  ? '!text-[#32c4d0] dark:!text-cyan-400 !border-[#32c4d0] dark:!border-cyan-400'
  : '!text-gray-500 dark:!text-gray-400';

export default function AlbumTracksList({albumId, albumName, tracks}: AlbumTracksListProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const playQueue = usePlayQueue();
  const {isRepeat, isQueueShuffle, toggleRepeat, toggleShuffle} = useQueueControls();
  const {queueId, currentTrackId, isPlaying} = useSelector((state: RootState) => state.player);

  const albumQueueId = `album:${albumId}`;
  const isThisAlbum = queueId === albumQueueId;
  const isAlbumPlaying = isThisAlbum && isPlaying;

  const playAlbum = () => {
    if (isThisAlbum) {
      dispatch(isPlaying ? pauseTrack() : playTrack());
      return;
    }
    playQueue(tracks, albumName, {queueId: albumQueueId});
  };

  // Трек из альбома: альбом играет с него и дальше
  const playFrom = (index: number) => {
    if (isThisAlbum && currentTrackId === tracks[index]._id) {
      dispatch(isPlaying ? pauseTrack() : playTrack());
      return;
    }
    playQueue(tracks, undefined, {queueId: albumQueueId, startIndex: index});
  };

  return (
    <div className="!max-w-full lg:!max-w-[600px] !w-full">
      <Card
        className="!shadow-lg !mt-4 !rounded-xl dark:!bg-gray-800 dark:!border-gray-700"
        title={
          <span className="!text-base sm:!text-lg dark:!text-gray-200">Треки альбома ({tracks.length})</span>}
        variant={'borderless'}
      >
        <div className="!flex !flex-wrap !items-center !gap-2 !mb-4">
          <Button
            type="primary"
            size="large"
            icon={isAlbumPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
            onClick={playAlbum}
            disabled={!tracks.length}
            className="!bg-[#32c4d0] !border-[#32c4d0]"
          >
            {isAlbumPlaying ? 'Пауза' : isThisAlbum ? 'Продолжить' : 'Слушать альбом'}
          </Button>
          <Tooltip title={isQueueShuffle ? 'Перемешивание включено' : 'Включить перемешивание'}>
            <Button
              size="large"
              icon={<SwapOutlined />}
              onClick={toggleShuffle}
              aria-pressed={isQueueShuffle}
              className={toggleClass(isQueueShuffle)}
            >
              Вперемешку
            </Button>
          </Tooltip>
          <Tooltip title={isRepeat ? 'Альбом начнётся заново после последнего трека' : 'После альбома включится волна'}>
            <Button
              size="large"
              icon={<RetweetOutlined />}
              onClick={toggleRepeat}
              aria-pressed={isRepeat}
              className={toggleClass(isRepeat)}
            >
              Повтор
            </Button>
          </Tooltip>
        </div>

        <Flex
          vertical
          gap="small"
        >
          {tracks.map((track, index) => {
            const isCurrent = isThisAlbum && currentTrackId === track._id;
            const isTrackPlaying = isCurrent && isPlaying;
            return (
              <div
                key={track._id}
                className={`!px-2 sm:!px-4 !py-2 sm:!py-3 !border-0 !border-b !border-gray-100 dark:!border-gray-700 !cursor-pointer !rounded-lg !transition-colors !duration-200 ${
                  isCurrent ? '!bg-[#f0f9fa] dark:!bg-gray-700' : 'hover:!bg-gray-50 dark:hover:!bg-gray-700'
                }`}
                onClick={() => playFrom(index)}
              >
                <div className="!flex !items-center !justify-between !w-full !gap-2 lg:!gap-4">
                  <div className="!flex !items-center !gap-2 sm:!gap-3 !flex-1 !min-w-0">
                    <Button
                      type="text"
                      aria-label={isTrackPlaying ? 'Пауза' : `Играть «${track.name}»`}
                      icon={isTrackPlaying
                        ? <PauseCircleFilled className="!text-2xl !text-[#32c4d0] dark:!text-cyan-400" />
                        : <PlayCircleFilled className={`!text-2xl ${isCurrent ? '!text-[#32c4d0] dark:!text-cyan-400' : '!text-gray-400 dark:!text-gray-500'}`} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        playFrom(index);
                      }}
                      className="!flex-shrink-0 !border-none !shadow-none"
                    />
                    <Typography.Text
                      type="secondary"
                      className="!w-5 !text-center !text-xs sm:!text-sm !flex-shrink-0 dark:!text-gray-400"
                    >
                      {index + 1}
                    </Typography.Text>

                    <div className="!min-w-0 !flex-1">
                      <Typography.Text
                        strong
                        className={`!text-sm sm:!text-base !truncate !block ${isCurrent ? '!text-[#32c4d0] dark:!text-cyan-400' : 'dark:!text-gray-200'}`}
                      >
                        {track.name}
                      </Typography.Text>
                      <Typography.Text
                        type="secondary"
                        className="!text-xs sm:!text-sm !truncate !block dark:!text-gray-400"
                      >
                        <ArtistLinks artists={track.artists} fallback={track.artist} />
                      </Typography.Text>
                    </div>
                  </div>

                  <div className="!flex !items-center !gap-3 lg:!gap-6 !flex-shrink-0">
                    <Typography.Text
                      type="secondary"
                      className="!hidden lg:!inline !whitespace-nowrap dark:!text-gray-400"
                    >
                      Прослушиваний: {track.listens}
                    </Typography.Text>

                    <Button
                      type="link"
                      size="small"
                      className="!whitespace-nowrap dark:!text-blue-400 !border-none !shadow-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/tracks/${track._id}`);
                      }}
                    >
                      Подробнее →
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </Flex>
      </Card>
    </div>
  );
}
