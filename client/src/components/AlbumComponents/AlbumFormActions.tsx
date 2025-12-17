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
    <div className="flex justify-between gap-3 sm:!gap-4 !mt-6 sm:!mt-8">
      <Button
        onClick={onCancel}
        size="large"
        disabled={loading}
        className="!flex-1 !h-[40px] sm:!h-[45px] md:!h-[50px] !rounded-lg dark:!bg-gray-700 dark:!border-gray-600 dark:!text-gray-200"
      >
        {cancelText}
      </Button>
      <Button
        type="primary"
        onClick={onSubmit}
        size="large"
        loading={loading}
        disabled={submitDisabled || loading}
        className="!flex-1 !h-[40px] sm:!h-[45px] md:!h-[50px] !rounded-lg !font-semibold dark:!bg-blue-600 dark:!border-blue-600"
      >
        {submitText}
      </Button>
    </div>
  );
}