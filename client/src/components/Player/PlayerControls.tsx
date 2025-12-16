'use client';

import {Button, Tooltip} from 'antd';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  StepForwardOutlined,
  StepBackwardOutlined
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
          icon={<StepBackwardOutlined style={{fontSize: 20}} />}
          onClick={onPrevTrack}
          disabled={!hasPrevTrack}
          style={{
            transition: 'transform 0.2s ease-in-out',
            opacity: hasPrevTrack ? 1 : 0.3,
          }}
          onMouseEnter={(e) => {
            if (hasPrevTrack) e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
      </Tooltip>

      <Button
        type="text"
        icon={isPlaying ? <PauseCircleOutlined style={{fontSize: 28}} /> :
          <PlayCircleOutlined style={{fontSize: 28}} />}
        onClick={onPlayPause}
        style={{
          transition: 'transform 0.2s ease-in-out',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      />

      <Tooltip title="Следующий трек">
        <Button
          type="text"
          icon={<StepForwardOutlined style={{fontSize: 20}} />}
          onClick={onNextTrack}
          disabled={!hasNextTrack}
          style={{
            transition: 'transform 0.2s ease-in-out',
            opacity: hasNextTrack ? 1 : 0.3,
          }}
          onMouseEnter={(e) => {
            if (hasNextTrack) e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
      </Tooltip>
    </>
  );
}