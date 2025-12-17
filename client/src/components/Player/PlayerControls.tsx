'use client';

import React from 'react';
import {Button, Tooltip} from 'antd';
import {
  StepBackwardOutlined,
  StepForwardOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined
} from '@ant-design/icons';

interface PlayerControlsProps {
  isPlaying: boolean;
  hasNextTrack: boolean;
  hasPrevTrack: boolean;
  onPlayPause: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  showNavigation?: boolean;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
                                                         isPlaying,
                                                         hasNextTrack,
                                                         hasPrevTrack,
                                                         onPlayPause,
                                                         onNextTrack,
                                                         onPrevTrack,
                                                         showNavigation = false,
                                                       }) => {
  return (
    <div className="!flex !items-center !gap-1 md:!gap-2 !mb-5">
      {showNavigation && (
        <Tooltip
          title="Предыдущий трек"
          placement="top"
        >
          <Button
            type="text"
            icon={<StepBackwardOutlined />}
            onClick={onPrevTrack}
            disabled={!hasPrevTrack}
            className="
              !text-base md:!text-lg
              !text-gray-600 dark:!text-gray-400
              hover:!text-[#32c4d0] dark:hover:!text-cyan-400
              !p-1 md:!p-2 !transition-colors
              !border-none !outline-none !shadow-none
              [&_.ant-btn]:!border-none
              [&_.ant-btn]:!outline-none
              [&_.ant-btn]:!shadow-none
              :focus:!border-none :focus:!outline-none
              :hover:!border-none :active:!border-none
            "
          />
        </Tooltip>
      )}

      <Tooltip
        title={isPlaying ? 'Пауза' : 'Воспроизвести'}
        placement="top"
      >
        <Button
          type="text"
          icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
          onClick={onPlayPause}
          className="
            !text-xl md:!text-2xl
            !text-[#32c4d0] dark:!text-cyan-400
            hover:!text-[#28a5b0] dark:hover:!text-cyan-300
            !p-1 md:!p-2 !transition-all hover:!scale-110
            !border-none !outline-none !shadow-none
            [&_.ant-btn]:!border-none
            [&_.ant-btn]:!outline-none
            [&_.ant-btn]:!shadow-none
            :focus:!border-none :focus:!outline-none
            :hover:!border-none :active:!border-none
          "
        />
      </Tooltip>

      {showNavigation && (
        <Tooltip
          title="Следующий трек"
          placement="top"
        >
          <Button
            type="text"
            icon={<StepForwardOutlined />}
            onClick={onNextTrack}
            disabled={!hasNextTrack}
            className="
              !text-base md:!text-lg
              !text-gray-600 dark:!text-gray-400
              hover:!text-[#32c4d0] dark:hover:!text-cyan-400
              !p-1 md:!p-2 !transition-colors
              !border-none !outline-none !shadow-none
              [&_.ant-btn]:!border-none
              [&_.ant-btn]:!outline-none
              [&_.ant-btn]:!shadow-none
              :focus:!border-none :focus:!outline-none
              :hover:!border-none :active:!border-none
            "
          />
        </Tooltip>
      )}
    </div>
  );
};

export default PlayerControls;