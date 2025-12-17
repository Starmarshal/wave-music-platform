'use client';

import {Slider, Tooltip, Typography} from 'antd';

type TrackItemProgressProps = {
  isCurrentTrack: boolean;
  currentTime: number;
  duration: number;
  onTimeChange: (value: number) => void;
  formatTime?: (time: number) => string;
};

export default function TrackItemProgress({
                                            isCurrentTrack,
                                            currentTime,
                                            duration,
                                            onTimeChange,
                                            formatTime = (time) => {
                                              const minutes = Math.floor(time / 60);
                                              const seconds = Math.floor(time % 60);
                                              return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                                            }
                                          }: TrackItemProgressProps) {
  return (
    <div className="!flex-1 !mt-0 sm:!mt-4 !w-full">
      <Tooltip
        title={formatTime(isCurrentTrack ? currentTime : 0)}
        placement="top"
      >
        <Slider
          tooltip={{formatter: null}}
          value={isCurrentTrack ? currentTime : 0}
          max={isCurrentTrack ? duration : 0}
          onChange={onTimeChange}
          disabled={!isCurrentTrack}
          className={`!transition-opacity !duration-300 !ease-in-out ${
            isCurrentTrack ? '!opacity-100' : '!opacity-60'
          }`}
        />
      </Tooltip>

      <div className="!flex !justify-between !mt-1 sm:!mt-1.5 !ml-0">
        <Typography.Text
          className={`!transition-opacity !duration-300 !ease-in-out !text-[10px] sm:!text-xs dark:!text-gray-400 ${
            isCurrentTrack ? '!opacity-100' : '!opacity-60'
          }`}
        >
          {formatTime(isCurrentTrack ? currentTime : 0)} / {formatTime(duration)}
        </Typography.Text>
      </div>
    </div>
  );
}