'use client';

import {Button} from 'antd';

type AlbumFormActionsProps = {
  onCancel?: () => void;
  onSubmit?: () => void;
  submitText?: string;
  cancelText?: string;
  loading?: boolean;
  submitDisabled?: boolean;
};

export default function AlbumFormActions({
                                           onCancel,
                                           onSubmit,
                                           submitText = 'Создать',
                                           cancelText = 'Отмена',
                                           loading = false,
                                           submitDisabled = false
                                         }: AlbumFormActionsProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '16px'
      }}
    >
      <Button
        onClick={onCancel}
        size="large"
        disabled={loading}
        style={{flex: 1, height: '50px', borderRadius: '8px'}}
      >
        {cancelText}
      </Button>
      <Button
        type="primary"
        onClick={onSubmit}
        size="large"
        loading={loading}
        disabled={submitDisabled || loading}
        style={{
          flex: 1,
          height: '50px',
          borderRadius: '8px',
          fontWeight: 600
        }}
      >
        {submitText}
      </Button>
    </div>
  );
}