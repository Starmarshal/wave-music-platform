'use client';

import {useState} from 'react';
import {Avatar, Button, message, Popconfirm, Space, Typography, Upload} from 'antd';
import {DeleteOutlined, UploadOutlined, UserOutlined} from '@ant-design/icons';
import {api, apiError} from '@/src/shared/api';
import {staticUrl} from '@/src/shared/config';
import {useAuth} from '@/src/shared/auth/AuthProvider';

const MAX_SIZE_MB = 10;

// Аватар пользователя: загружается сразу после выбора файла
export default function AvatarUploader() {
  const {user, setUser} = useAuth();
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const upload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      message.error('Выберите изображение');
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      message.error(`Файл больше ${MAX_SIZE_MB} МБ`);
      return;
    }
    const data = new FormData();
    data.append('avatar', file);
    setLoading(true);
    try {
      const response = await api.post('/auth/avatar', data);
      setUser(response.data.user);
      message.success('Аватар обновлён');
    } catch (error) {
      message.error(apiError(error, 'Не удалось загрузить аватар'));
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    try {
      const response = await api.delete('/auth/avatar');
      setUser(response.data.user);
    } catch (error) {
      message.error(apiError(error));
    }
  };

  return (
    <div className="!flex !items-center !gap-4 !mb-5">
      <Avatar
        size={88}
        src={user.avatar ? staticUrl(user.avatar) : undefined}
        icon={!user.avatar && <UserOutlined />}
        className="!flex-shrink-0 !bg-gradient-to-br !from-[#32c4d0] !to-blue-500"
      />
      <div>
        <Space wrap>
          <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={(file) => {
              upload(file);
              return false;
            }}
          >
            <Button icon={<UploadOutlined />} loading={loading}>
              {user.avatar ? 'Сменить аватар' : 'Загрузить аватар'}
            </Button>
          </Upload>
          {user.avatar && (
            <Popconfirm title="Удалить аватар?" okText="Удалить" cancelText="Отмена" onConfirm={remove}>
              <Button icon={<DeleteOutlined />} danger />
            </Popconfirm>
          )}
        </Space>
        <Typography.Paragraph type="secondary" className="!text-xs !mt-2 !mb-0 dark:!text-gray-400">
          JPG, PNG или WEBP до {MAX_SIZE_MB} МБ. Лучше квадратное.
        </Typography.Paragraph>
      </div>
    </div>
  );
}
