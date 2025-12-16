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
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        width: '120px'
      }}
    >
      <SoundOutlined style={{color: '#999'}} />
      <Slider
        value={volume}
        min={0}
        max={1}
        step={0.01}
        onChange={onVolumeChange}
        tooltip={{formatter: (value) => `${Math.round((value || 0) * 100)}%`}}
        style={{width: '80px'}}
      />
    </div>
  );
}