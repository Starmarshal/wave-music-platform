'use client';

import {Slider, Tooltip} from 'antd';

type TrackItemVolumeProps = {
  volume: number;
  onVolumeChange: (value: number) => void;
};

export default function TrackItemVolume({
                                          volume,
                                          onVolumeChange
                                        }: TrackItemVolumeProps) {
  return (
    <Tooltip
      title={`Громкость: ${Math.round(volume * 100)}%`}
      placement="top"
    >
      <Slider
        tooltip={{formatter: null}}
        value={volume}
        min={0}
        max={1}
        step={0.01}
        onChange={onVolumeChange}
        className="!w-[60px] !ml-2.5 !transition-opacity !duration-300 !ease-in-out !mb-4"
      />
    </Tooltip>
  );
}