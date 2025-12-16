'use client';

import {Button, Popconfirm, message} from 'antd';
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
        className="!ml-auto !text-2xl !transition-transform !duration-200 !ease-in-out"
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      />
    </Popconfirm>
  );
}