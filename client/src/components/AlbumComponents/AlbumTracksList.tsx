'use client';

import { Button, Card, Flex, Typography } from 'antd';
import { useRouter } from 'next/navigation';

type TrackType = {
  _id: string;
  name: string;
  artist: string;
  listens: number;
};

type AlbumTracksListProps = {
  tracks: TrackType[];
};

export default function AlbumTracksList({ tracks }: AlbumTracksListProps) {
  const router = useRouter();

  return (
    <div className="!max-w-full lg:!max-w-[600px] !w-full">
      <Card
        className="!shadow-lg !mt-4 !rounded-xl dark:!bg-gray-800 dark:!border-gray-700"
        title={<span className="!text-base sm:!text-lg dark:!text-gray-200">Треки альбома ({tracks.length})</span>}
        variant={'borderless'}
      >
        <Flex
          vertical
          gap="small"
        >
          {tracks.map((track, index) => (
            <div
              key={track._id}
              className="!px-2 sm:!px-4 !py-2 sm:!py-3 !border-0 !border-b !border-gray-100 dark:!border-gray-700 !cursor-pointer hover:!bg-gray-50 dark:hover:!bg-gray-700 !transition-colors !duration-200"
              onClick={() => router.push(`/tracks/${track._id}`)}
            >
              <div className="!flex !flex-col lg:!flex-row !items-start lg:!items-center !justify-between !w-full !gap-2 lg:!gap-4">
                <div className="!flex !items-center !gap-2 sm:!gap-4 !flex-1 !min-w-0 !w-full lg:!w-auto">
                  <Typography.Text
                    strong
                    className="!w-6 sm:!w-7 !text-center !text-xs sm:!text-sm !flex-shrink-0 dark:!text-gray-300"
                  >
                    {index + 1}
                  </Typography.Text>

                  <div className="!min-w-0 !flex-1">
                    <div className="!flex !items-center !justify-between !gap-2 sm:!gap-3">
                      <Typography.Text
                        strong
                        className="!text-sm sm:!text-base !truncate !flex-1 dark:!text-gray-200"
                      >
                        {track.name}
                      </Typography.Text>

                      <Button
                        type="link"
                        size="small"
                        className="
                          !p-0 lg:!hidden !text-xs sm:!text-sm
                          !whitespace-nowrap !flex-shrink-0
                          dark:!text-blue-400
                          !border-none !outline-none !shadow-none
                          [&_.ant-btn]:!border-none
                          [&_.ant-btn]:!outline-none
                          [&_.ant-btn]:!shadow-none
                          :focus:!border-none :focus:!outline-none
                          :hover:!border-none :active:!border-none
                        "
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/tracks/${track._id}`);
                        }}
                      >
                        Подробнее
                      </Button>
                    </div>

                    <Typography.Text
                      type="secondary"
                      className="!text-xs sm:!text-sm !truncate !block !mt-1 dark:!text-gray-400"
                    >
                      {track.artist}
                    </Typography.Text>
                  </div>
                </div>

                <div className="!hidden lg:!flex !items-center !gap-6 !flex-shrink-0">
                  <Typography.Text
                    type="secondary"
                    className="!whitespace-nowrap dark:!text-gray-400"
                  >
                    Прослушиваний: {track.listens}
                  </Typography.Text>

                  <Button
                    type="link"
                    className="
                      !whitespace-nowrap
                      dark:!text-blue-400
                      !border-none !outline-none !shadow-none
                      [&_.ant-btn]:!border-none
                      [&_.ant-btn]:!outline-none
                      [&_.ant-btn]:!shadow-none
                      :focus:!border-none :focus:!outline-none
                      :hover:!border-none :active:!border-none
                    "
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
          ))}
        </Flex>
      </Card>
    </div>
  );
}