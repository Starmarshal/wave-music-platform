'use client';

import {Slider} from 'antd';
import {SoundOutlined} from '@ant-design/icons';

type PlayerVolumeControlProps = {
  volume: number;
  onVolumeChange: (value: number) => void;
};

export default function PlayerVolumeControl({
                                              volume,
                                              onVolumeChange
                                            }: PlayerVolumeControlProps) {
  return (
    <div
      className="!flex !items-center !gap-2.5 !w-[120px] !mb-2.5"
    >
      <SoundOutlined className="!text-gray-400" />
      <Slider
        value={volume}
        min={0}
        max={1}
        step={0.01}
        onChange={onVolumeChange}
        tooltip={{formatter: (value) => `${Math.round((value || 0) * 100)}%`}}
        className="!w-20"
      />
    </div>
  );
}