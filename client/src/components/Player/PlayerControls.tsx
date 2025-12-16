'use client';

import {Button, Tooltip} from 'antd';
import {
  PauseCircleOutlined,
  PlayCircleOutlined,
  StepBackwardOutlined,
  StepForwardOutlined
} from '@ant-design/icons';

type PlayerControlsProps = {
  isPlaying: boolean;
  hasNextTrack: boolean;
  hasPrevTrack: boolean;
  onPlayPause: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
};

export default function PlayerControls({
                                         isPlaying,
                                         hasNextTrack,
                                         hasPrevTrack,
                                         onPlayPause,
                                         onNextTrack,
                                         onPrevTrack
                                       }: PlayerControlsProps) {
  return (
    <>
      <Tooltip title="Предыдущий трек">
        <Button
          type="text"
          icon={<StepBackwardOutlined className="!text-xl" />}
          onClick={onPrevTrack}
          disabled={!hasPrevTrack}
          className={`!transition-transform !duration-200 !ease-in-out ${
            hasPrevTrack ? '!opacity-100' : '!opacity-30'
          }`}
          onMouseEnter={(e) => {
            if (hasPrevTrack) e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
      </Tooltip>

      <Button
        type="text"
        icon={isPlaying ? <PauseCircleOutlined className="!text-2xl" /> :
          <PlayCircleOutlined className="!text-2xl" />}
        onClick={onPlayPause}
        className="!transition-transform !duration-200 !ease-in-out"
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      />

      <Tooltip title="Следующий трек">
        <Button
          type="text"
          icon={<StepForwardOutlined className="!text-xl" />}
          onClick={onNextTrack}
          disabled={!hasNextTrack}
          className={`!transition-transform !duration-200 !ease-in-out ${
            hasNextTrack ? '!opacity-100' : '!opacity-30'
          }`}
          onMouseEnter={(e) => {
            if (hasNextTrack) e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
      </Tooltip>
    </>
  );
}