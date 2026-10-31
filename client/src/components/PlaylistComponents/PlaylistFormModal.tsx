'use client';

import {useEffect, useState} from 'react';
import {Form, Input, message, Modal, Select, Switch, Upload} from 'antd';
import {UploadOutlined} from '@ant-design/icons';
import {api, apiError} from '@/src/shared/api';
import {IPlaylist} from '@/src/types/album';
import {IArtistRef} from '@/src/types/user';

type PlaylistFormModalProps = {
  open: boolean;
  playlist?: IPlaylist | null;
  // Для лейбла: можно создать официальный плейлист своего артиста
  artists?: IArtistRef[];
  onClose: () => void;
  onSaved: (playlist: IPlaylist) => void;
};

export default function PlaylistFormModal({open, playlist, artists, onClose, onSaved}: PlaylistFormModalProps) {
  const [form] = Form.useForm();
  const [cover, setCover] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setCover(null);
    form.setFieldsValue({
      name: playlist?.name ?? '',
      description: playlist?.description ?? '',
      isPublic: playlist?.isPublic ?? false,
      artistId: undefined,
    });
  }, [open, playlist, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    const data = new FormData();
    data.append('name', values.name);
    data.append('description', values.description ?? '');
    data.append('isPublic', String(!!values.isPublic));
    if (values.artistId) data.append('artistId', values.artistId);
    if (cover) data.append('cover', cover);
    setSaving(true);
    try {
      const response = playlist
        ? await api.patch(`/playlists/${playlist._id}`, data)
        : await api.post('/playlists', data);
      onSaved(response.data);
      onClose();
    } catch (error) {
      message.error(apiError(error, 'Не удалось сохранить плейлист'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      title={playlist ? 'Редактировать плейлист' : 'Новый плейлист'}
      okText="Сохранить"
      cancelText="Отмена"
      confirmLoading={saving}
      onOk={handleOk}
      onCancel={onClose}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item name="name" label="Название" rules={[{required: true, message: 'Укажите название'}]}>
          <Input maxLength={128} autoFocus />
        </Form.Item>
        <Form.Item name="description" label="Описание">
          <Input.TextArea rows={3} maxLength={1000} />
        </Form.Item>
        {!playlist && artists && artists.length > 0 && (
          <Form.Item name="artistId" label="Официальный плейлист артиста" extra="Оставьте пустым для личного плейлиста">
            <Select
              allowClear
              placeholder="Личный плейлист"
              options={artists.map((artist) => ({value: artist._id, label: artist.name}))}
            />
          </Form.Item>
        )}
        <Form.Item name="isPublic" label="Публичный" valuePropName="checked" extra="Публичный плейлист видят все, им можно поделиться по ссылке">
          <Switch />
        </Form.Item>
        <Form.Item label="Обложка">
          <Upload
            accept="image/*"
            maxCount={1}
            beforeUpload={(file) => {
              setCover(file);
              return false;
            }}
            onRemove={() => setCover(null)}
          >
            <button type="button" className="!flex !items-center !gap-2 !px-3 !py-1 !border !rounded dark:!border-gray-600">
              <UploadOutlined /> Выбрать файл
            </button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
}
