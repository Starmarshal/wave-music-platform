'use client';

import {Slider} from 'antd';

type PlayerProgressBarProps = {
  currentTime: number;
  duration: number;
  onTimeChange: (value: number) => void;
  formatTime?: (time: number) => string;
};

export default function PlayerProgressBar({
                                            currentTime,
                                            duration,
                                            onTimeChange,
                                            formatTime = (time) => {
                                              if (isNaN(time) || !isFinite(time)) return '00:00';
                                              const minutes = Math.floor(time / 60);
                                              const seconds = Math.floor(time % 60);
                                              return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                                            }
                                          }: PlayerProgressBarProps) {
  return (
    <div className="!flex-1 !min-w-0 !mt-2.5">
      <Slider
        value={currentTime}
        max={duration || 0}
        onChange={onTimeChange}
        tooltip={{formatter: (value) => formatTime(value || 0)}}
        className="!m-0"
      />
      <div
        className="!flex !justify-between !text-xs !text-gray-400 !mt-1"
      >
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}