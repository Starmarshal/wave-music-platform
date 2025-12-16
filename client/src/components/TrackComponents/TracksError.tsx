'use client';

import {Typography} from 'antd';

type TracksErrorProps = {
  error: string;
};

export default function TracksError({error}: TracksErrorProps) {
  return (
    <div style={{textAlign: 'center', padding: '40px'}}>
      <Typography.Title level={3} style={{color: '#ff4d4f'}}>
        Ошибка загрузки
      </Typography.Title>
      <Typography.Text type="secondary">
        {error}
      </Typography.Text>
    </div>
  );
}