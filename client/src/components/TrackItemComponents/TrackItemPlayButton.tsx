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
      onClick={onClick}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    />
  );
}