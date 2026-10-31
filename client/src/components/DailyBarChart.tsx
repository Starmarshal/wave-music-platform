'use client';

import {Tooltip, Typography} from 'antd';

type DailyBarChartProps = {
  title: string;
  data: { day: string; value: number; hint?: string }[];
  unit?: string;
};

const formatDay = (day: string) =>
  new Date(day).toLocaleDateString('ru-RU', {day: 'numeric', month: 'short'});

// Один ряд — легенда не нужна, заголовок называет показатель.
// Столбики на общей базовой линии, подсказка с точным значением при наведении
export default function DailyBarChart({title, data, unit = ''}: DailyBarChartProps) {
  const max = Math.max(1, ...data.map((point) => point.value));
  const total = data.reduce((sum, point) => sum + point.value, 0);

  return (
    <div>
      <div className="!flex !justify-between !items-baseline !mb-2">
        <Typography.Text strong className="dark:!text-gray-200">{title}</Typography.Text>
        <Typography.Text type="secondary" className="!text-xs dark:!text-gray-400">
          всего {total.toLocaleString('ru-RU')}{unit}
        </Typography.Text>
      </div>
      <div className="!flex !items-end !gap-[2px] !h-32 !border-0 !border-b !border-gray-200 dark:!border-gray-700">
        {data.map((point) => (
          <Tooltip
            key={point.day}
            title={`${formatDay(point.day)}: ${point.value.toLocaleString('ru-RU')}${unit}${point.hint ? ` · ${point.hint}` : ''}`}
          >
            {/* Зона наведения во всю высоту, сам столбик внутри */}
            <div className="!flex-1 !h-full !flex !items-end !cursor-default group">
              <div
                className="!w-full !rounded-t !bg-[#32c4d0] dark:!bg-cyan-400 group-hover:!opacity-80"
                style={{height: point.value ? `${Math.max(2, (point.value / max) * 100)}%` : 0}}
              />
            </div>
          </Tooltip>
        ))}
      </div>
      <div className="!flex !justify-between !text-[11px] !text-gray-500 dark:!text-gray-400 !mt-1">
        <span>{data[0] && formatDay(data[0].day)}</span>
        <span>{data.length > 0 && formatDay(data[data.length - 1].day)}</span>
      </div>
    </div>
  );
}
