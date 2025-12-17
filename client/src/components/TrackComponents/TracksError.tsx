'use client';

import {Typography} from 'antd';

type TracksErrorProps = {
  error: string;
};

export default function TracksError({error}: TracksErrorProps) {
  return (
    <div className="!text-center !p-10">
      <Typography.Title
        level={3}
        className="!text-red-500 dark:!text-red-400"
      >
        Ошибка загрузки
      </Typography.Title>
      <Typography.Text
        type="secondary"
        className="dark:!text-gray-400"
      >
        {error}
      </Typography.Text>
    </div>
  );
}