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
    <div className="flex justify-between gap-4">
      <Button
        onClick={onCancel}
        size="large"
        disabled={loading}
        className="flex-1 !h-[50px] rounded-lg"
      >
        {cancelText}
      </Button>
      <Button
        type="primary"
        onClick={onSubmit}
        size="large"
        loading={loading}
        disabled={submitDisabled || loading}
        className="flex-1 !h-[50px] rounded-lg !font-semibold"
      >
        {submitText}
      </Button>
    </div>
  );
}