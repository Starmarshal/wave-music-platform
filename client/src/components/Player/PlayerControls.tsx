'use client';

import React from 'react';
import { Button, Tooltip } from 'antd';
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
  showNavigation?: boolean; // Новый пропс для контроля отображения навигации
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
                                                         isPlaying,
                                                         hasNextTrack,
                                                         hasPrevTrack,
                                                         onPlayPause,
                                                         onNextTrack,
                                                         onPrevTrack,
                                                         showNavigation = false, // По умолчанию скрываем
                                                       }) => {
  return (
    <div className="!flex !items-center !gap-2">
      {/* Кнопка предыдущего трека (только в режиме альбома) */}
      {showNavigation && (
        <Tooltip title="Предыдущий трек" placement="top">
          <Button
            type="text"
            icon={<StepBackwardOutlined />}
            onClick={onPrevTrack}
            disabled={!hasPrevTrack}
            className={`!text-xl '!text-gray-500' `}
          />
        </Tooltip>
      )}

      {/* Кнопка воспроизведения/паузы */}
      <Tooltip title={isPlaying ? "Пауза" : "Воспроизвести"} placement="top">
        <Button
          type="text"
          icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
          onClick={onPlayPause}
          className="!text-2xl !text-gray-500 hover:!text-blue-400"
        />
      </Tooltip>

      {/* Кнопка следующего трека (только в режиме альбома) */}
      {showNavigation && (
        <Tooltip title="Следующий трек" placement="top">
          <Button
            type="text"
            icon={<StepForwardOutlined />}
            onClick={onNextTrack}
            disabled={!hasNextTrack}
            className={`!text-xl'!text-gray-500'`}
          />
        </Tooltip>
      )}
    </div>
  );
};

export default PlayerControls;