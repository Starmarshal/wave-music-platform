'use client';

import {Button} from 'antd';
import {PauseCircleOutlined, PlayCircleOutlined} from '@ant-design/icons';

type TrackItemPlayButtonProps = {
  isCurrentTrack: boolean;
  isPlaying: boolean;
  onClick: () => void;
};

export default function TrackItemPlayButton({
                                              isCurrentTrack,
                                              isPlaying,
                                              onClick
                                            }: TrackItemPlayButtonProps) {
  return (
    <Button
      className="
        !mr-2 sm:!mr-4
        !transition-transform !duration-200 !ease-in-out
        !p-1 sm:!p-2 !mb-1.5
        hover:!scale-110
        !border-none !shadow-none
        ![&_.ant-btn]:!border-none
        ![&_.ant-btn]:!shadow-none
        :focus:!border-none :focus:!shadow-none
        :active:!border-none :active:!shadow-none
        !outline-none
        :focus-visible:!outline-none
        :focus-visible:!ring-0
      "
      type="text"
      icon={isPlaying ? (
        <PauseCircleOutlined
          className={`!text-xl sm:!text-2xl !transition-colors !duration-300 !ease-in-out ${
            isCurrentTrack ? '!text-[#32c4d0] dark:!text-cyan-400' : 'dark:!text-gray-400'
          }`}
        />
      ) : (
        <PlayCircleOutlined
          className={`!text-xl sm:!text-2xl !transition-colors !duration-300 !ease-in-out ${
            isCurrentTrack ? '!text-[#32c4d0] dark:!text-cyan-400' : 'dark:!text-gray-400'
          }`}
        />
      )}
      onClick={onClick}
    />
  );
}