'use client';

import {Button, message, Popconfirm} from 'antd';
import {DeleteOutlined} from '@ant-design/icons';

type TrackItemDeleteButtonProps = {
  onDelete: () => Promise<void>;
  title?: string;
  description?: string;
  okText?: string;
  cancelText?: string;
};

export default function TrackItemDeleteButton({
                                                onDelete,
                                                title = 'Удалить трек?',
                                                description = 'Это действие нельзя отменить',
                                                okText = 'Удалить',
                                                cancelText = 'Отмена'
                                              }: TrackItemDeleteButtonProps) {
  const handleDelete = async () => {
    try {
      await onDelete();
      message.success('Трек удалён');
    } catch (error) {
      console.error('Ошибка при удалении трека:', error);
      message.error('Не удалось удалить трек');
    }
  };

  return (
    <Popconfirm
      title={title}
      description={description}
      okText={okText}
      cancelText={cancelText}
      onConfirm={handleDelete}
    >
      <Button
        icon={<DeleteOutlined />}
        type="text"
        className="
          !ml-auto !text-lg sm:!text-xl md:!text-2xl
          !transition-transform !duration-200 !ease-in-out
          !p-1 sm:!p-2 hover:!scale-110
          !text-gray-600 dark:!text-gray-400
          hover:!text-red-500 dark:hover:!text-red-400
          !border-none !shadow-none
          hover:!border-none active:!border-none focus:!border-none
          ![&:focus]:!shadow-none ![&:hover]:!border-none
          ![&_.ant-btn]:!border-none
        "
      />
    </Popconfirm>
  );
}